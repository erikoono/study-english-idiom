const https = require('https');
const http = require('http');

// オリジナルの熟語データベース（著作権フリー）
const originalIdioms = [
  // 基本セット
  {
    english: 'A piece of cake',
    japanese: '朝飯前、簡単なこと',
    example: 'The exam was a piece of cake for her.',
    explanation: '非常に簡単で楽にできること',
    difficulty: 'easy'
  },
  {
    english: 'Break the ice',
    japanese: '場を和ませる、緊張をほぐす',
    example: 'He told a joke to break the ice at the meeting.',
    explanation: '初対面の人との緊張した雰囲気を和らげるために何かをすること',
    difficulty: 'easy'
  },
  {
    english: 'Hit the nail on the head',
    japanese: '核心を突く、的確に言い当てる',
    example: 'You hit the nail on the head with that analysis.',
    explanation: '問題の核心を正確に指摘すること',
    difficulty: 'medium'
  },
  {
    english: 'Bite the bullet',
    japanese: '苦しいことを耐え忍ぶ',
    example: 'I had to bite the bullet and tell him the truth.',
    explanation: '不快な状況を我慢して耐えること',
    difficulty: 'medium'
  },
  {
    english: 'Pull someone\'s leg',
    japanese: '冗談を言う、からかう',
    example: 'Don\'t worry, I was just pulling your leg.',
    explanation: '冗談を言って人をからかうこと',
    difficulty: 'medium'
  },
  {
    english: 'Cost an arm and a leg',
    japanese: '非常に高価である',
    example: 'That car costs an arm and a leg.',
    explanation: '非常に高価であること',
    difficulty: 'easy'
  },
  {
    english: 'Let the cat out of the bag',
    japanese: '秘密を漏らす',
    example: 'I accidentally let the cat out of the bag about the surprise party.',
    explanation: '秘密を意図せずに漏らしてしまうこと',
    difficulty: 'medium'
  },
  {
    english: 'Kill two birds with one stone',
    japanese: '一石二鳥',
    example: 'By taking the train, I can kill two birds with one stone - save money and help the environment.',
    explanation: '一つの行動で二つの目的を達成すること',
    difficulty: 'easy'
  },
  {
    english: 'The ball is in your court',
    japanese: '次はあなたの番です',
    example: 'I\'ve made my offer, now the ball is in your court.',
    explanation: '次に行動するのはあなたの番であること',
    difficulty: 'hard'
  },
  {
    english: 'Spill the beans',
    japanese: '秘密を漏らす',
    example: 'Don\'t spill the beans about the surprise!',
    explanation: '秘密を漏らしてしまうこと',
    difficulty: 'medium'
  },
  // 追加セット1
  {
    english: 'Break a leg',
    japanese: 'Good luck! (特に演劇やパフォーマンスで)',
    example: 'Break a leg in your performance tonight!',
    explanation: 'Good luck! (特に演劇やパフォーマンスで)',
    difficulty: 'easy'
  },
  {
    english: 'Call it a day',
    japanese: '今日はここまでにする、終わりにする',
    example: 'It\'s getting late, let\'s call it a day.',
    explanation: '今日はここまでにする、終わりにする',
    difficulty: 'easy'
  },
  {
    english: 'Get out of hand',
    japanese: '制御不能になる、手に負えなくなる',
    example: 'The party got out of hand when too many people showed up.',
    explanation: '制御不能になる、手に負えなくなる',
    difficulty: 'easy'
  },
  {
    english: 'Hit the sack',
    japanese: '寝る、ベッドに入る',
    example: 'I\'m tired, I\'m going to hit the sack.',
    explanation: '寝る、ベッドに入る',
    difficulty: 'medium'
  },
  {
    english: 'Miss the boat',
    japanese: '機会を逃す、遅れる',
    example: 'You missed the boat on that job opportunity.',
    explanation: '機会を逃す、遅れる',
    difficulty: 'medium'
  },
  // 追加セット2
  {
    english: 'On the ball',
    japanese: '機敏な、注意深い',
    example: 'She\'s really on the ball with her work.',
    explanation: '機敏な、注意深い',
    difficulty: 'medium'
  },
  {
    english: 'Pull yourself together',
    japanese: '落ち着く、冷静になる',
    example: 'Pull yourself together and focus on the task.',
    explanation: '落ち着く、冷静になる',
    difficulty: 'medium'
  },
  {
    english: 'So far so good',
    japanese: '今のところ順調だ',
    example: 'How\'s the project going? So far so good.',
    explanation: '今のところ順調だ',
    difficulty: 'hard'
  },
  {
    english: 'Speak of the devil',
    japanese: '噂をすれば影（その人が現れる）',
    example: 'Speak of the devil, here comes John now.',
    explanation: '噂をすれば影（その人が現れる）',
    difficulty: 'hard'
  },
  {
    english: 'That\'s the last straw',
    japanese: 'もう我慢の限界だ',
    example: 'That\'s the last straw! I\'m quitting this job.',
    explanation: 'もう我慢の限界だ',
    difficulty: 'hard'
  },
  // 追加セット3
  {
    english: 'Under the weather',
    japanese: '体調が悪い、気分が優れない',
    example: 'I\'m feeling a bit under the weather today.',
    explanation: '体調が悪い、気分が優れない',
    difficulty: 'easy'
  },
  {
    english: 'Get over it',
    japanese: '乗り越える、諦める',
    example: 'You need to get over it and move on.',
    explanation: '乗り越える、諦める',
    difficulty: 'medium'
  },
  {
    english: 'Look on the bright side',
    japanese: '良い面を見る、楽観的に考える',
    example: 'Look on the bright side, at least you tried.',
    explanation: '良い面を見る、楽観的に考える',
    difficulty: 'medium'
  },
  {
    english: 'Take it easy',
    japanese: '気楽にする、リラックスする',
    example: 'Take it easy, don\'t stress too much.',
    explanation: '気楽にする、リラックスする',
    difficulty: 'easy'
  },
  {
    english: 'Get the hang of it',
    japanese: 'コツを掴む、慣れる',
    example: 'It takes time to get the hang of driving.',
    explanation: 'コツを掴む、慣れる',
    difficulty: 'medium'
  },
  // 追加セット4（著作権フリー）
  {
    english: 'A dime a dozen',
    japanese: 'ありふれた、珍しくない',
    example: 'Those kinds of jobs are a dime a dozen.',
    explanation: '非常にありふれていて珍しくないこと',
    difficulty: 'medium'
  },
  {
    english: 'Beat around the bush',
    japanese: '遠回しに言う、要点を避ける',
    example: 'Stop beating around the bush and tell me the truth.',
    explanation: '直接的な言い方を避けて遠回しに言うこと',
    difficulty: 'medium'
  },
  {
    english: 'Cut corners',
    japanese: '手抜きをする、コストを削減する',
    example: 'They cut corners to finish the project on time.',
    explanation: '品質を落として時間やコストを節約すること',
    difficulty: 'medium'
  },
  {
    english: 'Get your act together',
    japanese: 'しっかりする、改善する',
    example: 'You need to get your act together if you want to succeed.',
    explanation: '行動を改善してより良い結果を得ること',
    difficulty: 'hard'
  },
  {
    english: 'Hit the road',
    japanese: '出発する、旅立つ',
    example: 'It\'s time to hit the road and go home.',
    explanation: '出発すること、旅立つこと',
    difficulty: 'easy'
  },
  // 追加セット5（著作権フリー）
  {
    english: 'It\'s not rocket science',
    japanese: '複雑ではない、簡単だ',
    example: 'Cooking pasta is not rocket science.',
    explanation: '非常に複雑ではない、理解しやすいこと',
    difficulty: 'medium'
  },
  {
    english: 'Jump on the bandwagon',
    japanese: '流行に乗る、追随する',
    example: 'Many companies are jumping on the AI bandwagon.',
    explanation: '流行やトレンドに追随すること',
    difficulty: 'hard'
  },
  {
    english: 'Keep your chin up',
    japanese: '元気を出す、希望を失わない',
    example: 'Keep your chin up, things will get better.',
    explanation: '困難な状況でも希望を失わずにいること',
    difficulty: 'medium'
  },
  {
    english: 'Make a long story short',
    japanese: '手短に言うと、要約すると',
    example: 'To make a long story short, we decided to move.',
    explanation: '長い話を短く要約すること',
    difficulty: 'medium'
  },
  {
    english: 'No pain, no gain',
    japanese: '努力なくして成功なし',
    example: 'No pain, no gain - you have to work hard to succeed.',
    explanation: '努力や苦労なくしては成功できないこと',
    difficulty: 'easy'
  },
  // 追加セット6（著作権フリー）
  {
    english: 'On the same page',
    japanese: '同じ考え、同じ理解',
    example: 'We need to make sure everyone is on the same page.',
    explanation: '全員が同じ理解や考えを持っていること',
    difficulty: 'medium'
  },
  {
    english: 'Pull yourself up by your bootstraps',
    japanese: '自力で立ち直る、自助努力する',
    example: 'You need to pull yourself up by your bootstraps.',
    explanation: '他人の助けを借りずに自力で立ち直ること',
    difficulty: 'hard'
  },
  {
    english: 'Put all your eggs in one basket',
    japanese: '一つのことに全てを賭ける',
    example: 'Don\'t put all your eggs in one basket.',
    explanation: '一つの選択肢に全てを賭けること',
    difficulty: 'medium'
  },
  {
    english: 'Read between the lines',
    japanese: '行間を読む、真意を理解する',
    example: 'You need to read between the lines to understand what he really means.',
    explanation: '表面的な言葉の裏にある真意を理解すること',
    difficulty: 'hard'
  },
  {
    english: 'See eye to eye',
    japanese: '意見が一致する、同じ見解を持つ',
    example: 'We don\'t always see eye to eye on politics.',
    explanation: '意見や見解が一致すること',
    difficulty: 'medium'
  },
  {
    english: 'Take it with a grain of salt',
    japanese: '話半分に聞く、疑ってかかる',
    example: 'Take what he says with a grain of salt.',
    explanation: '話を疑って聞くこと、話半分に受け取ること',
    difficulty: 'medium'
  },
  {
    english: 'The early bird catches the worm',
    japanese: '早起きは三文の徳',
    example: 'The early bird catches the worm - start early!',
    explanation: '早く始めることが成功の鍵であること',
    difficulty: 'easy'
  },
  {
    english: 'Throw in the towel',
    japanese: '諦める、降参する',
    example: 'I\'m ready to throw in the towel on this project.',
    explanation: '諦めること、降参すること',
    difficulty: 'medium'
  },
  {
    english: 'Turn a blind eye',
    japanese: '見て見ぬふりをする',
    example: 'The teacher turned a blind eye to the cheating.',
    explanation: '問題を見て見ぬふりをすること',
    difficulty: 'medium'
  },
  {
    english: 'When pigs fly',
    japanese: 'ありえない、絶対にない',
    example: 'I\'ll believe that when pigs fly.',
    explanation: '絶対にありえないこと',
    difficulty: 'easy'
  },
  {
    english: 'You can say that again',
    japanese: 'その通りだ、全く同感だ',
    example: 'You can say that again - this is terrible!',
    explanation: '完全に同意すること',
    difficulty: 'easy'
  },
  {
    english: 'Your guess is as good as mine',
    japanese: '私にも分からない、推測の域を出ない',
    example: 'Your guess is as good as mine about what will happen.',
    explanation: '私にも分からない、推測の域を出ないこと',
    difficulty: 'medium'
  },
  {
    english: 'Barking up the wrong tree',
    japanese: '間違った方向で努力する',
    example: 'You\'re barking up the wrong tree if you think I can help.',
    explanation: '間違った方向で努力すること',
    difficulty: 'medium'
  },
  {
    english: 'Burn the midnight oil',
    japanese: '夜遅くまで勉強・仕事する',
    example: 'I had to burn the midnight oil to finish the project.',
    explanation: '夜遅くまで勉強や仕事をすること',
    difficulty: 'medium'
  },
  {
    english: 'Catch someone red-handed',
    japanese: '現行犯で捕まえる',
    example: 'The police caught him red-handed.',
    explanation: '現行犯で捕まえること',
    difficulty: 'medium'
  },
  {
    english: 'Do someone a favor',
    japanese: '人に親切にする、恩を施す',
    example: 'Could you do me a favor and pick up some milk?',
    explanation: '人に親切にすること、恩を施すこと',
    difficulty: 'easy'
  },
  {
    english: 'Eat humble pie',
    japanese: '屈辱を味わう、謝罪する',
    example: 'I had to eat humble pie and admit I was wrong.',
    explanation: '屈辱を味わうこと、謝罪すること',
    difficulty: 'medium'
  },
  {
    english: 'Face the music',
    japanese: '結果を受け入れる、責任を取る',
    example: 'It\'s time to face the music and tell the truth.',
    explanation: '結果を受け入れること、責任を取ること',
    difficulty: 'medium'
  },
  {
    english: 'Get a taste of your own medicine',
    japanese: '仕返しをされる、同じ目に遭う',
    example: 'He got a taste of his own medicine when they ignored him.',
    explanation: '仕返しをされること、同じ目に遭うこと',
    difficulty: 'medium'
  },
  {
    english: 'Give someone the benefit of the doubt',
    japanese: '疑わしきは罰せず、信じる',
    example: 'I\'ll give you the benefit of the doubt this time.',
    explanation: '疑わしきは罰せずに信じること',
    difficulty: 'hard'
  },
  {
    english: 'Go the extra mile',
    japanese: '一層の努力をする、期待以上に頑張る',
    example: 'She always goes the extra mile for her customers.',
    explanation: '期待以上に努力すること',
    difficulty: 'medium'
  },
  {
    english: 'Hit the hay',
    japanese: '寝る、ベッドに入る',
    example: 'I\'m tired, time to hit the hay.',
    explanation: '寝ること、ベッドに入ること',
    difficulty: 'easy'
  },
  {
    english: 'In the heat of the moment',
    japanese: '興奮して、冷静さを失って',
    example: 'I said that in the heat of the moment.',
    explanation: '興奮して冷静さを失っていること',
    difficulty: 'medium'
  },
  {
    english: 'Keep an eye on',
    japanese: '注意して見る、監視する',
    example: 'Keep an eye on the children while I\'m gone.',
    explanation: '注意して見ること、監視すること',
    difficulty: 'easy'
  },
  {
    english: 'Let sleeping dogs lie',
    japanese: '触らぬ神に祟りなし',
    example: 'Let sleeping dogs lie - don\'t bring up old problems.',
    explanation: '問題を起こさないように静かにしておくこと',
    difficulty: 'medium'
  }
];

// 動的スクレイピング用の熟語データベース（フォールバック用）
const dynamicIdioms = originalIdioms;

// HTTPリクエスト関数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// 著作権フリーの動的データ生成
async function generateDynamicIdioms() {
  try {
    console.log('著作権フリーの動的データを生成中...');
    
    // オリジナルデータからランダムに選択（常に10個を確保）
    const shuffled = [...originalIdioms].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, originalIdioms.length));
    
    // 各熟語に少し変化を加える（例文や説明を変更）
    const dynamicIdioms = selected.map((idiom, index) => {
      const variations = [
        { example: `Here's an example: ${idiom.english}` },
        { example: `For instance: ${idiom.english}` },
        { example: `As an example: ${idiom.english}` },
        { explanation: `This means: ${idiom.explanation}` },
        { explanation: `In other words: ${idiom.explanation}` },
        { explanation: `Simply put: ${idiom.explanation}` }
      ];
      
      const variation = variations[Math.floor(Math.random() * variations.length)];
      
      return {
        id: `dynamic-${Date.now()}-${index}`,
        english: idiom.english,
        japanese: idiom.japanese,
        example: variation.example || idiom.example,
        explanation: variation.explanation || idiom.explanation,
        difficulty: idiom.difficulty
      };
    });
    
    console.log(`${dynamicIdioms.length}個の動的熟語を生成しました`);
    return dynamicIdioms;
    
  } catch (error) {
    console.error('動的データ生成エラー:', error);
    return getRandomIdioms(10);
  }
}

// 英語熟語APIからデータを取得（著作権フリー版）
async function fetchIdiomsFromAPI() {
  try {
    console.log('著作権フリーのAPIからデータを取得中...');
    
    // 実際の英語熟語を検索（大幅に拡張）
    const idiomPhrases = [
      'break the ice',
      'hit the nail on the head',
      'pull yourself together',
      'get over it',
      'take it easy',
      'look on the bright side',
      'miss the boat',
      'cost an arm and a leg',
      'let the cat out of the bag',
      'kill two birds with one stone',
      'break a leg',
      'call it a day',
      'get out of hand',
      'hit the sack',
      'on the ball',
      'so far so good',
      'speak of the devil',
      "that's the last straw",
      'it is not rocket science',
      'hit the road',
      'get the hang of it',
      'jump on the bandwagon',
      'a dime a dozen',
      'beat around the bush',
      'a piece of cake',
      'pull someone leg',
      'under the weather',
      'spill the beans',
      'the ball is in your court',
      'get up on the wrong side of the bed',
      'barking up the wrong tree',
      'bite the bullet',
      'burn the midnight oil',
      'catch someone red-handed',
      'cut corners',
      'do someone a favor',
      'eat humble pie',
      'face the music',
      'get a taste of your own medicine',
      'give someone the benefit of the doubt',
      'go the extra mile',
      'hit the hay',
      'in the heat of the moment',
      'keep an eye on',
      'let sleeping dogs lie',
      'make a long story short',
      'no pain no gain',
      'on the same page',
      'pull yourself up by your bootstraps',
      'put all your eggs in one basket',
      'read between the lines',
      'see eye to eye',
      'take it with a grain of salt',
      'the early bird catches the worm',
      'throw in the towel',
      'turn a blind eye',
      'when pigs fly',
      'you can say that again',
      'your guess is as good as mine'
    ];
    
    let allIdioms = [];
    
    // ランダムに5個の熟語を選択（より確実なランダム化）
    const shuffledPhrases = [...idiomPhrases].sort(() => Math.random() - 0.5);
    const selectedPhrases = shuffledPhrases.slice(0, 5);
    console.log('選択された熟語:', selectedPhrases);
    
    for (const phrase of selectedPhrases) { // ランダムに5個の熟語を試行
      try {
        // 熟語の各単語を個別に検索して情報を取得
        const words = phrase.split(' ');
        const firstWord = words[0];
        
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${firstWord}`;
        const response = await makeRequest(apiUrl);
        const data = JSON.parse(response);
        
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          if (item.word && item.meanings && item.meanings.length > 0) {
            const meaning = item.meanings[0];
            const definition = meaning.definitions?.[0]?.definition || `Definition for ${phrase}`;
            const example = meaning.definitions?.[0]?.example || `Example: ${phrase}`;
            
            // 実際の熟語として使用
            allIdioms.push({
              english: phrase,
              japanese: `APIから取得: ${phrase}`,
              example: example,
              explanation: definition,
              difficulty: 'medium'
            });
          }
        }
        
        // 少し待機してAPIレート制限を避ける
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.log(`API取得失敗 (${phrase}):`, error.message);
        continue;
      }
    }
    
    if (allIdioms.length > 0) {
      console.log(`${allIdioms.length}個の熟語をAPIから取得しました`);
      // 常に10個返すように調整
      if (allIdioms.length >= 10) {
        return allIdioms.slice(0, 10);
      } else {
        // API取得が10個未満の場合、動的生成で補完
        const dynamicIdioms = await generateDynamicIdioms();
        const combined = [...allIdioms, ...dynamicIdioms];
        return combined.slice(0, 10);
      }
    }
    
    // API取得が完全に失敗した場合、動的生成で10個確保
    const dynamicIdioms = await generateDynamicIdioms();
    return dynamicIdioms.slice(0, 10);
  } catch (error) {
    console.log('API取得失敗:', error.message);
    return [];
  }
}

// 実際のスクレイピング関数（著作権フリー版）
async function scrapeIdiomsFromWeb() {
  try {
    console.log('著作権フリーの動的データを生成中...');
    
    // ランダムにAPIまたは動的データ生成を選択
    const useApi = Math.random() > 0.5; // 50%の確率でAPIを使用（より多様性を確保）
    
    if (useApi) {
      // まずAPIから取得を試行
      const apiIdioms = await fetchIdiomsFromAPI();
      if (apiIdioms.length > 0) {
        return apiIdioms;
      }
    }
    
    // APIが失敗した場合または30%の確率で動的データ生成
    return await generateDynamicIdioms();
    
  } catch (error) {
    console.error('動的データ生成エラー:', error);
    return getRandomIdioms(10);
  }
}

// 重複を除去する関数
function removeDuplicates(idioms) {
  const seen = new Set();
  return idioms.filter(idiom => {
    const key = idiom.english.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// HTMLから熟語を抽出する関数（著作権フリー版）
function parseIdiomsFromHTML(html) {
  // 著作権問題を避けるため、実際のスクレイピングは行わない
  return [];
}

// ランダムに熟語を選択する関数（フォールバック用）
function getRandomIdioms(count = 10) {
  const shuffled = [...originalIdioms].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((idiom, index) => ({
    id: `dynamic-${Date.now()}-${index}`,
    ...idiom
  }));
}

// 特定の難易度の熟語を取得する関数
function getRandomIdiomsByDifficulty(difficulty, count = 10) {
  const filtered = originalIdioms.filter(idiom => idiom.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((idiom, index) => ({
    id: `dynamic-${difficulty}-${Date.now()}-${index}`,
    ...idiom
  }));
}

// 外部APIから新しい熟語を取得する関数（著作権フリー版）
async function fetchNewIdiomsFromAPI() {
  try {
    console.log('新しい熟語を取得中...');
    console.log('取得開始時刻:', new Date().toISOString());
    
    // 著作権フリーの動的データ生成を実行
    const dynamicIdioms = await scrapeIdiomsFromWeb();
    
    // 結果にIDを付与し、ランダムに並び替え、常に10個を確保
    const shuffledIdioms = dynamicIdioms
      .map((idiom, index) => ({
        id: `scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
        ...idiom
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // 常に10個に制限
    
    console.log('取得された熟語:', shuffledIdioms.map(i => i.english));
    console.log('取得完了時刻:', new Date().toISOString());
    console.log(`取得数: ${shuffledIdioms.length}個`);
    return shuffledIdioms;
    
  } catch (error) {
    console.error('動的データ生成エラー:', error);
    // エラー時はローカルデータを使用
    return getRandomIdioms(10);
  }
}

// モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getRandomIdioms,
    getRandomIdiomsByDifficulty,
    fetchNewIdiomsFromAPI,
    scrapeIdiomsFromWeb,
    fetchIdiomsFromAPI,
    generateDynamicIdioms,
    originalIdioms,
    dynamicIdioms
  };
} 