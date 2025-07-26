export interface Idiom {
  id: string;
  english: string;
  japanese: string;
  example: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
} 