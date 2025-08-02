// 学習コンテンツの基本インターフェース
export interface BaseLearningItem {
  id: string;
  type: 'idiom' | 'word';
  english: string;
  japanese: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 熟語専用の追加フィールド
export interface IdiomFields {
  example: string;
  explanation: string;
}

// 単語専用の追加フィールド
export interface WordFields {
  pronunciation?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection';
  synonyms?: string[];
  antonyms?: string[];
  exampleSentences: string[];
  definition: string;
}

// 具体的な学習アイテム型
export interface IdiomItem extends BaseLearningItem, IdiomFields {
  type: 'idiom';
}

export interface WordItem extends BaseLearningItem, WordFields {
  type: 'word';
}

// 統合型
export type LearningItem = IdiomItem | WordItem;

// 後方互換性のための型エイリアス
export type Idiom = IdiomItem;

// 型ガード
export const isIdiom = (item: LearningItem): item is IdiomItem => {
  return item.type === 'idiom';
};

export const isWord = (item: LearningItem): item is WordItem => {
  return item.type === 'word';
};

// フィルター用の型
export type ContentType = 'all' | 'idiom' | 'word';
export type DifficultyLevel = 'all' | 'easy' | 'medium' | 'hard';