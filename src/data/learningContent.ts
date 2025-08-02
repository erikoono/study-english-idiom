import { LearningItem, WordItem } from '../types/learningItem';
import { sampleIdioms } from './idioms';

// 単語学習用のサンプルデータ
export const sampleWords: WordItem[] = [
  // Easy Level
  {
    id: 'w1',
    type: 'word',
    english: 'beautiful',
    japanese: '美しい',
    partOfSpeech: 'adjective',
    pronunciation: '/ˈbjuːtɪf(ə)l/',
    definition: 'Pleasing the senses or mind aesthetically',
    exampleSentences: [
      'The sunset was absolutely beautiful.',
      'She wore a beautiful dress to the party.'
    ],
    synonyms: ['gorgeous', 'lovely', 'attractive'],
    antonyms: ['ugly', 'hideous', 'unattractive'],
    difficulty: 'easy'
  },
  {
    id: 'w2',
    type: 'word',
    english: 'important',
    japanese: '重要な',
    partOfSpeech: 'adjective',
    pronunciation: '/ɪmˈpɔːt(ə)nt/',
    definition: 'Of great significance or value',
    exampleSentences: [
      'It is important to study hard.',
      'This is an important decision for our company.'
    ],
    synonyms: ['significant', 'crucial', 'essential'],
    antonyms: ['unimportant', 'trivial', 'insignificant'],
    difficulty: 'easy'
  },
  {
    id: 'w3',
    type: 'word',
    english: 'wonderful',
    japanese: '素晴らしい',
    partOfSpeech: 'adjective',
    pronunciation: '/ˈwʌndəf(ə)l/',
    definition: 'Inspiring delight, pleasure, or admiration',
    exampleSentences: [
      'We had a wonderful time at the beach.',
      'The concert was absolutely wonderful.'
    ],
    synonyms: ['amazing', 'fantastic', 'marvelous'],
    antonyms: ['terrible', 'awful', 'horrible'],
    difficulty: 'easy'
  },
  
  // Medium Level
  {
    id: 'w4',
    type: 'word',
    english: 'adequate',
    japanese: '適切な、十分な',
    partOfSpeech: 'adjective',
    pronunciation: '/ˈædɪkwət/',
    definition: 'Satisfactory or acceptable in quality or quantity',
    exampleSentences: [
      'The salary was adequate for my needs.',
      'We need adequate preparation for the exam.'
    ],
    synonyms: ['sufficient', 'satisfactory', 'acceptable'],
    antonyms: ['inadequate', 'insufficient', 'unsatisfactory'],
    difficulty: 'medium'
  },
  {
    id: 'w5',
    type: 'word',
    english: 'consequence',
    japanese: '結果、影響',
    partOfSpeech: 'noun',
    pronunciation: '/ˈkɒnsɪkw(ə)ns/',
    definition: 'A result or effect of an action or condition',
    exampleSentences: [
      'The consequence of not studying was failing the test.',
      'Every action has a consequence.'
    ],
    synonyms: ['result', 'outcome', 'effect'],
    difficulty: 'medium'
  },
  {
    id: 'w6',
    type: 'word',
    english: 'demonstrate',
    japanese: '実証する、示す',
    partOfSpeech: 'verb',
    pronunciation: '/ˈdemənstreɪt/',
    definition: 'Clearly show the existence or truth of something',
    exampleSentences: [
      'The teacher will demonstrate the experiment.',
      'This research demonstrates the importance of sleep.'
    ],
    synonyms: ['show', 'prove', 'illustrate'],
    difficulty: 'medium'
  },
  
  // Hard Level
  {
    id: 'w7',
    type: 'word',
    english: 'serendipity',
    japanese: '偶然の発見、思わぬ発見',
    partOfSpeech: 'noun',
    pronunciation: '/ˌserənˈdɪpɪti/',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    exampleSentences: [
      'It was pure serendipity that led me to find this amazing book.',
      'The discovery of penicillin was a famous case of serendipity in science.'
    ],
    synonyms: ['chance', 'luck', 'fortune'],
    difficulty: 'hard'
  },
  {
    id: 'w8',
    type: 'word',
    english: 'ephemeral',
    japanese: '短命な、つかの間の',
    partOfSpeech: 'adjective',
    pronunciation: '/ɪˈfemərəl/',
    definition: 'Lasting for a very short time',
    exampleSentences: [
      'The beauty of cherry blossoms is ephemeral.',
      'Social media trends are often ephemeral.'
    ],
    synonyms: ['temporary', 'fleeting', 'transient'],
    antonyms: ['permanent', 'lasting', 'enduring'],
    difficulty: 'hard'
  },
  {
    id: 'w9',
    type: 'word',
    english: 'ubiquitous',
    japanese: 'いたるところにある、遍在する',
    partOfSpeech: 'adjective',
    pronunciation: '/juːˈbɪkwɪtəs/',
    definition: 'Present, appearing, or found everywhere',
    exampleSentences: [
      'Smartphones have become ubiquitous in modern society.',
      'The ubiquitous presence of social media affects our daily lives.'
    ],
    synonyms: ['omnipresent', 'pervasive', 'widespread'],
    antonyms: ['rare', 'scarce', 'absent'],
    difficulty: 'hard'
  },
  {
    id: 'w10',
    type: 'word',
    english: 'resilience',
    japanese: '回復力、復元力',
    partOfSpeech: 'noun',
    pronunciation: '/rɪˈzɪlɪəns/',
    definition: 'The ability to recover quickly from difficult conditions',
    exampleSentences: [
      'Her resilience helped her overcome many challenges.',
      'The team showed great resilience after their defeat.'
    ],
    synonyms: ['toughness', 'strength', 'endurance'],
    antonyms: ['weakness', 'fragility', 'vulnerability'],
    difficulty: 'hard'
  }
];

// 全学習コンテンツ（熟語 + 単語）
export const allLearningContent: LearningItem[] = [
  ...sampleIdioms,
  ...sampleWords
];

// コンテンツタイプ別フィルタリング関数
export const getContentByType = (type: 'idiom' | 'word' | 'all'): LearningItem[] => {
  if (type === 'all') return allLearningContent;
  return allLearningContent.filter(item => item.type === type);
};

// 難易度別フィルタリング関数
export const getContentByDifficulty = (
  content: LearningItem[], 
  difficulty: 'easy' | 'medium' | 'hard' | 'all'
): LearningItem[] => {
  if (difficulty === 'all') return content;
  return content.filter(item => item.difficulty === difficulty);
};

// 統合フィルタリング関数
export const getFilteredContent = (
  contentType: 'idiom' | 'word' | 'all' = 'all',
  difficulty: 'easy' | 'medium' | 'hard' | 'all' = 'all'
): LearningItem[] => {
  const typeFiltered = getContentByType(contentType);
  return getContentByDifficulty(typeFiltered, difficulty);
};