import { useState, useMemo, useCallback } from 'react';
import { sampleIdioms } from '../data/idioms';
import { Idiom } from '../types/idiom';

interface UseIdiomsReturn {
  idioms: Idiom[];
  currentIndex: number;
  selectedDifficulty: string;
  filteredIdioms: Idiom[];
  currentIdiom: Idiom | undefined;
  isLoading: boolean;
  handleNext: () => void;
  handleDifficultyChange: (difficulty: string) => void;
  handleIdiomsLoaded: (newIdioms: Idiom[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useIdioms = (): UseIdiomsReturn => {
  // スクレイピングで取得したデータを動的にインポート
  const getInitialIdioms = (): Idiom[] => {
    try {
      // 動的インポートを試行
      const scrapedModule = require('../data/scraped-idioms');
      const scrapedIdioms: Idiom[] = scrapedModule.scrapedIdioms || [];
      return [...sampleIdioms, ...scrapedIdioms];
    } catch (error) {
      console.log('スクレイピングデータが見つかりません。サンプルデータを使用します。');
      return sampleIdioms;
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [idioms, setIdioms] = useState<Idiom[]>(getInitialIdioms());
  const [isLoading, setIsLoading] = useState(false);

  // 難易度でフィルタリング（パフォーマンス最適化のためuseMemo使用）
  const filteredIdioms = useMemo(() => 
    idioms.filter(idiom => 
      selectedDifficulty === 'all' || idiom.difficulty === selectedDifficulty
    ), 
    [idioms, selectedDifficulty]
  );

  const currentIdiom = filteredIdioms[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredIdioms.length);
  }, [filteredIdioms.length]);

  const handleDifficultyChange = useCallback((difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentIndex(0); // フィルター変更時に最初の問題に戻る
  }, []);

  const handleIdiomsLoaded = useCallback((newIdioms: Idiom[]) => {
    console.log('useIdioms: 新しい熟語セットを受信:', newIdioms.map(i => i.english));
    console.log('useIdioms: 受信時刻:', new Date().toISOString());
    
    // 強制的に新しい状態を設定
    setIdioms([...newIdioms]);
    setCurrentIndex(0);
  }, []);

  return {
    idioms,
    currentIndex,
    selectedDifficulty,
    filteredIdioms,
    currentIdiom,
    isLoading,
    handleNext,
    handleDifficultyChange,
    handleIdiomsLoaded,
    setIsLoading,
  };
};