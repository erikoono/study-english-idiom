// 外部辞書API統合層
const https = require('https');
const { URL } = require('url');

// Free Dictionary API 設定
const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// 学習レベル別単語リスト
const WORD_LISTS = {
  easy: [
    'happy', 'quick', 'bright', 'kind', 'clean', 'warm', 'free', 'safe', 
    'simple', 'friend', 'strong', 'good', 'nice', 'big', 'small', 'new',
    'old', 'young', 'fast', 'slow', 'hot', 'cold', 'long', 'short',
    'high', 'low', 'light', 'dark', 'open', 'close', 'easy', 'hard'
  ],
  medium: [
    'analyze', 'influence', 'consider', 'experience', 'opportunity', 
    'challenge', 'environment', 'technology', 'community', 'creative',
    'perspective', 'establish', 'significant', 'develop', 'achieve',
    'determine', 'require', 'provide', 'increase', 'improve', 'manage',
    'organize', 'process', 'solution', 'strategy', 'system', 'research',
    'effective', 'efficient', 'important', 'necessary', 'possible'
  ],
  hard: [
    'paradigm', 'meticulous', 'ambiguous', 'contemplate', 'sophisticated',
    'intricate', 'inevitable', 'synthesize', 'profound', 'ameliorate',
    'ubiquitous', 'ephemeral', 'eloquent', 'pragmatic', 'comprehensive',
    'fundamental', 'substantial', 'distinguish', 'implement', 'facilitate',
    'demonstrate', 'consequence', 'phenomenon', 'hypothesis', 'methodology',
    'theoretical', 'empirical', 'contemporary', 'conventional', 'innovative'
  ]
};

// メモリキャッシュ (シンプルなLRUキャッシュ)
class WordCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // アクセスされたアイテムを最新に移動
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 最も古いアイテムを削除
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

const wordCache = new WordCache(200); // 200語までキャッシュ

// HTTPSリクエストのPromiseラッパー
function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'EnglishLearningApp/1.0'
      },
      timeout: 5000 // 5秒タイムアウト
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          reject(new Error(`JSON解析エラー: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`リクエストエラー: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('リクエストタイムアウト'));
    });

    req.end();
  });
}

// Free Dictionary APIから単語データを取得
async function fetchWordFromAPI(word) {
  try {
    const url = `${DICTIONARY_API_BASE}/${encodeURIComponent(word.toLowerCase())}`;
    const apiResponse = await httpsRequest(url);
    
    if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
      throw new Error('無効なAPIレスポンス');
    }

    return transformAPIResponse(apiResponse[0], word);
  } catch (error) {
    console.error(`単語 "${word}" の取得エラー:`, error.message);
    throw error;
  }
}

// APIレスポンスをアプリ形式に変換
function transformAPIResponse(apiData, originalWord) {
  const word = apiData.word || originalWord;
  
  // 音節情報の取得
  const phonetic = apiData.phonetics && apiData.phonetics.length > 0 
    ? apiData.phonetics.find(p => p.text) || apiData.phonetics[0]
    : null;

  // 定義と品詞の取得（最初の意味を使用）
  let definition = '';
  let partOfSpeech = 'noun'; // デフォルト
  let exampleSentences = [];
  let synonyms = [];
  let antonyms = [];

  if (apiData.meanings && apiData.meanings.length > 0) {
    const meaning = apiData.meanings[0];
    partOfSpeech = meaning.partOfSpeech || 'noun';
    
    if (meaning.definitions && meaning.definitions.length > 0) {
      const def = meaning.definitions[0];
      definition = def.definition || '';
      
      if (def.example) {
        exampleSentences.push(def.example);
      }
      
      if (def.synonyms && def.synonyms.length > 0) {
        synonyms = def.synonyms.slice(0, 3); // 最大3個
      }
      
      if (def.antonyms && def.antonyms.length > 0) {
        antonyms = def.antonyms.slice(0, 3); // 最大3個
      }
    }
    
    // 意味レベルでのシノニム・アントニムも確認
    if (synonyms.length === 0 && meaning.synonyms) {
      synonyms = meaning.synonyms.slice(0, 3);
    }
    if (antonyms.length === 0 && meaning.antonyms) {
      antonyms = meaning.antonyms.slice(0, 3);
    }
  }

  // 音声URLの取得
  const audioUrl = phonetic && phonetic.audio ? phonetic.audio : null;

  return {
    english: word,
    japanese: '', // 日本語翻訳は別途処理が必要
    partOfSpeech: partOfSpeech,
    pronunciation: phonetic ? phonetic.text || '' : '',
    definition: definition,
    exampleSentences: exampleSentences.length > 0 ? exampleSentences : [
      `The word "${word}" is commonly used in English.`,
      `Learning "${word}" will improve your vocabulary.`
    ],
    synonyms: synonyms,
    antonyms: antonyms,
    audioUrl: audioUrl,
    difficulty: determineDifficulty(word), // 単語の難易度を判定
    id: `external-word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'word',
    source: 'external-api'
  };
}

// 単語の難易度を判定
function determineDifficulty(word) {
  word = word.toLowerCase();
  
  if (WORD_LISTS.easy.includes(word)) return 'easy';
  if (WORD_LISTS.medium.includes(word)) return 'medium';
  if (WORD_LISTS.hard.includes(word)) return 'hard';
  
  // 単語の長さベースでの推定
  if (word.length <= 5) return 'easy';
  if (word.length <= 8) return 'medium';
  return 'hard';
}

// キャッシュ付きで単語を取得
async function getWordWithCache(word) {
  const cacheKey = word.toLowerCase();
  
  // キャッシュから確認
  const cached = wordCache.get(cacheKey);
  if (cached) {
    console.log(`キャッシュから取得: ${word}`);
    return { ...cached, id: `cached-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
  }
  
  // APIから取得してキャッシュに保存
  try {
    const wordData = await fetchWordFromAPI(word);
    wordCache.set(cacheKey, wordData);
    console.log(`APIから取得してキャッシュ: ${word}`);
    return wordData;
  } catch (error) {
    console.error(`単語 "${word}" の取得に失敗:`, error.message);
    throw error;
  }
}

// 指定難易度のランダム単語を取得
function getRandomWordsFromList(difficulty, count = 10) {
  const wordList = WORD_LISTS[difficulty] || WORD_LISTS.easy;
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, wordList.length));
}

// 難易度ミックスでランダム単語を取得
function getRandomMixedWords(count = 10) {
  const easyCount = Math.ceil(count * 0.4);
  const mediumCount = Math.ceil(count * 0.4);
  const hardCount = count - easyCount - mediumCount;
  
  const words = [
    ...getRandomWordsFromList('easy', easyCount),
    ...getRandomWordsFromList('medium', mediumCount),
    ...getRandomWordsFromList('hard', hardCount)
  ];
  
  return words.sort(() => Math.random() - 0.5); // シャッフル
}

// 複数の単語を並行して取得
async function fetchMultipleWords(wordList) {
  const promises = wordList.map(word => 
    getWordWithCache(word).catch(error => {
      console.error(`単語 "${word}" の取得失敗:`, error.message);
      return null; // エラーの場合はnullを返す
    })
  );
  
  const results = await Promise.all(promises);
  return results.filter(word => word !== null); // nullを除外
}

// 外部APIベースのランダム単語生成（メイン関数）
async function generateRandomWordsFromAPI(count = 10, difficulty = 'all') {
  try {
    let wordList;
    
    if (difficulty === 'all') {
      wordList = getRandomMixedWords(count);
    } else {
      wordList = getRandomWordsFromList(difficulty, count);
    }
    
    console.log(`外部APIから単語を取得中: ${wordList.join(', ')}`);
    const words = await fetchMultipleWords(wordList);
    
    console.log(`取得成功: ${words.length}/${wordList.length} 語`);
    return words;
  } catch (error) {
    console.error('外部API単語生成エラー:', error.message);
    throw error;
  }
}

// 統計情報
function getAPIStatistics() {
  return {
    cacheSize: wordCache.size(),
    maxCacheSize: wordCache.maxSize,
    availableWords: {
      easy: WORD_LISTS.easy.length,
      medium: WORD_LISTS.medium.length,
      hard: WORD_LISTS.hard.length,
      total: WORD_LISTS.easy.length + WORD_LISTS.medium.length + WORD_LISTS.hard.length
    }
  };
}

// キャッシュクリア
function clearCache() {
  wordCache.clear();
  console.log('単語キャッシュをクリアしました');
}

module.exports = {
  generateRandomWordsFromAPI,
  getWordWithCache,
  fetchWordFromAPI,
  getAPIStatistics,
  clearCache,
  WORD_LISTS
};