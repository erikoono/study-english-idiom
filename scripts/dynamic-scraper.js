const https = require('https');
const http = require('http');

// 動的スクレイピング用の熟語データベース
const dynamicIdioms = [
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
  }
];

// ランダムに熟語を選択する関数
function getRandomIdioms(count = 10) {
  const shuffled = [...dynamicIdioms].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((idiom, index) => ({
    id: `dynamic-${Date.now()}-${index}`,
    ...idiom
  }));
}

// 特定の難易度の熟語を取得する関数
function getRandomIdiomsByDifficulty(difficulty, count = 10) {
  const filtered = dynamicIdioms.filter(idiom => idiom.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((idiom, index) => ({
    id: `dynamic-${difficulty}-${Date.now()}-${index}`,
    ...idiom
  }));
}

// 外部APIから新しい熟語を取得する関数（模擬）
async function fetchNewIdiomsFromAPI() {
  return new Promise((resolve) => {
    // 実際のAPIコールの代わりに、ランダムな遅延をシミュレート
    setTimeout(() => {
      const newIdioms = getRandomIdioms(10);
      resolve(newIdioms);
    }, Math.random() * 1000 + 500); // 0.5-1.5秒のランダムな遅延
  });
}

// モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getRandomIdioms,
    getRandomIdiomsByDifficulty,
    fetchNewIdiomsFromAPI,
    dynamicIdioms
  };
} 