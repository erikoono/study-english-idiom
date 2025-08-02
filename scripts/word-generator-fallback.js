// フォールバック用の軽量単語データベース
// 外部API が利用できない場合のみ使用される

// 最小限のフォールバック単語データベース
const fallbackWordDatabase = [
  // Easy Level (基本的な単語のみ)
  {
    english: 'happy',
    japanese: '幸せな、嬉しい',
    partOfSpeech: 'adjective',
    pronunciation: '/ˈhæpi/',
    definition: 'Feeling or showing pleasure or contentment',
    exampleSentences: [
      'She felt happy when she received the good news.',
      'The children were happy to see their grandparents.'
    ],
    synonyms: ['joyful', 'cheerful', 'glad'],
    antonyms: ['sad', 'unhappy', 'miserable'],
    difficulty: 'easy'
  },
  {
    english: 'quick',
    japanese: '速い、急速な',
    partOfSpeech: 'adjective',
    pronunciation: '/kwɪk/',
    definition: 'Moving fast or doing something in a short time',
    exampleSentences: [
      'She gave a quick answer to the question.',
      'We need a quick solution to this problem.'
    ],
    synonyms: ['fast', 'rapid', 'swift'],
    antonyms: ['slow', 'sluggish', 'delayed'],
    difficulty: 'easy'
  },
  {
    english: 'good',
    japanese: '良い',
    partOfSpeech: 'adjective',
    pronunciation: '/ɡʊd/',
    definition: 'Having positive qualities; satisfactory',
    exampleSentences: [
      'That was a good movie.',
      'She is a good student.'
    ],
    synonyms: ['excellent', 'great', 'fine'],
    antonyms: ['bad', 'poor', 'terrible'],
    difficulty: 'easy'
  },
  
  // Medium Level (基本的な学習語彙)
  {
    english: 'important',
    japanese: '重要な',
    partOfSpeech: 'adjective',
    pronunciation: '/ɪmˈpɔrtənt/',
    definition: 'Having great significance or value',
    exampleSentences: [
      'It is important to study hard.',
      'This is an important meeting.'
    ],
    synonyms: ['significant', 'crucial', 'vital'],
    antonyms: ['unimportant', 'trivial', 'minor'],
    difficulty: 'medium'
  },
  {
    english: 'understand',
    japanese: '理解する',
    partOfSpeech: 'verb',
    pronunciation: '/ˌʌndərˈstænd/',
    definition: 'To comprehend the meaning or importance of something',
    exampleSentences: [
      'I understand the lesson now.',
      'Do you understand what I mean?'
    ],
    synonyms: ['comprehend', 'grasp', 'realize'],
    antonyms: ['misunderstand', 'confuse'],
    difficulty: 'medium'
  },
  {
    english: 'develop',
    japanese: '発展する、開発する',
    partOfSpeech: 'verb',
    pronunciation: '/dɪˈveləp/',
    definition: 'To grow or cause to grow gradually',
    exampleSentences: [
      'The company will develop new products.',
      'Children develop quickly.'
    ],
    synonyms: ['create', 'build', 'improve'],
    antonyms: ['destroy', 'decline'],
    difficulty: 'medium'
  },
  
  // Hard Level (高度な語彙)
  {
    english: 'sophisticated',
    japanese: '洗練された、高度な',
    partOfSpeech: 'adjective',
    pronunciation: '/səˈfɪstɪkeɪtɪd/',
    definition: 'Having advanced knowledge, experience, or understanding',
    exampleSentences: [
      'The software uses sophisticated algorithms.',
      'She has very sophisticated taste in art.'
    ],
    synonyms: ['refined', 'advanced', 'complex'],
    antonyms: ['simple', 'naive', 'unsophisticated'],
    difficulty: 'hard'
  },
  {
    english: 'inevitable',
    japanese: '避けられない、必然的な',
    partOfSpeech: 'adjective',
    pronunciation: '/ɪnˈevɪtəbəl/',
    definition: 'Certain to happen; unavoidable',
    exampleSentences: [
      'Change is inevitable in any organization.',
      'The inevitable conclusion was that he was guilty.'
    ],
    synonyms: ['unavoidable', 'certain', 'inescapable'],
    antonyms: ['avoidable', 'preventable', 'optional'],
    difficulty: 'hard'
  },
  {
    english: 'comprehensive',
    japanese: '包括的な、総合的な',
    partOfSpeech: 'adjective',
    pronunciation: '/ˌkɒmprɪˈhensɪv/',
    definition: 'Complete and including everything that is necessary',
    exampleSentences: [
      'We need a comprehensive plan.',
      'The report provides comprehensive information.'
    ],
    synonyms: ['complete', 'thorough', 'extensive'],
    antonyms: ['incomplete', 'partial', 'limited'],
    difficulty: 'hard'
  }
];

// シンプルなランダム選択機能（フォールバック用）
function generateFallbackWords(count = 10, difficulty = 'all') {
  let filtered = fallbackWordDatabase;
  
  if (difficulty !== 'all') {
    filtered = fallbackWordDatabase.filter(word => word.difficulty === difficulty);
  }
  
  if (filtered.length === 0) {
    // 指定難易度に単語がない場合は全単語から選択
    filtered = fallbackWordDatabase;
  }
  
  // シンプルなシャッフル
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, filtered.length));
  
  return selected.map((word, index) => ({
    ...word,
    id: `fallback-word-${Date.now()}-${index}`,
    type: 'word',
    source: 'fallback-database'
  }));
}

// 統計情報
function getFallbackStatistics() {
  return {
    totalWords: fallbackWordDatabase.length,
    byDifficulty: {
      easy: fallbackWordDatabase.filter(w => w.difficulty === 'easy').length,
      medium: fallbackWordDatabase.filter(w => w.difficulty === 'medium').length,
      hard: fallbackWordDatabase.filter(w => w.difficulty === 'hard').length
    },
    source: 'fallback-database'
  };
}

module.exports = {
  generateFallbackWords,
  getFallbackStatistics,
  fallbackWordDatabase
};