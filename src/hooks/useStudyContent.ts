import { useState, useMemo, useCallback } from 'react';
import { LearningItem, ContentType, DifficultyLevel } from '../types/learningItem';
import { allLearningContent } from '../data/learningContent';

interface UseStudyContentReturn {
  items: LearningItem[];
  currentIndex: number;
  selectedContentType: ContentType;
  selectedDifficulty: DifficultyLevel;
  filteredItems: LearningItem[];
  currentItem: LearningItem | undefined;
  isLoading: boolean;
  handleNext: () => void;
  handleContentTypeChange: (contentType: ContentType) => void;
  handleDifficultyChange: (difficulty: DifficultyLevel) => void;
  handleItemsLoaded: (newItems: LearningItem[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStudyContent = (): UseStudyContentReturn => {
  // 初期データの取得
  const getInitialItems = (): LearningItem[] => {
    try {
      // スクレイピングで取得したデータを動的にインポート
      const scrapedModule = require('../data/scraped-idioms');
      const scrapedIdioms: LearningItem[] = scrapedModule.scrapedIdioms || [];
      
      // typeフィールドを追加（スクレイピングデータには型情報が不足している可能性）
      const typedScrapedIdioms = scrapedIdioms.map((item: any) => ({
        ...item,
        type: 'idiom' as const
      }));
      
      // 初期状態では静的な熟語データと単語データの両方を含める
      return [...allLearningContent, ...typedScrapedIdioms];
    } catch (error) {
      console.log('スクレイピングデータが見つかりません。サンプルデータを使用します。');
      // 全ての静的データを返す
      return allLearningContent;
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('idiom'); // デフォルトは熟語
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all');
  const [items, setItems] = useState<LearningItem[]>(getInitialItems());
  const [isLoading, setIsLoading] = useState(false);

  // フィルタリング（パフォーマンス最適化のためuseMemo使用）
  const filteredItems = useMemo(() => {
    let filteredByType: LearningItem[];
    
    if (selectedContentType === 'idiom') {
      // 熟語のみの場合（API経由データも含む）
      filteredByType = items.filter(item => item.type === 'idiom');
    } else if (selectedContentType === 'word') {
      // 単語のみの場合（APIから取得したデータを優先、無ければ静的データ）
      filteredByType = items.filter(item => item.type === 'word');
    } else {
      // 全タイプの場合
      filteredByType = items;
    }
    
    // 難易度フィルタリング
    if (selectedDifficulty === 'all') {
      return filteredByType;
    }
    
    return filteredByType.filter(item => item.difficulty === selectedDifficulty);
  }, [items, selectedContentType, selectedDifficulty]);

  const currentItem = filteredItems[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const handleContentTypeChange = useCallback((contentType: ContentType) => {
    setSelectedContentType(contentType);
    setCurrentIndex(0); // フィルター変更時に最初の問題に戻る
    
    // 単語モードに切り替えた場合、単語データが存在しない場合は初期化
    if (contentType === 'word') {
      const hasWordData = items.some(item => item.type === 'word');
      if (!hasWordData) {
        // 静的な単語データで初期化
        const wordData = allLearningContent.filter(item => item.type === 'word');
        setItems(prevItems => [
          ...prevItems.filter(item => item.type === 'idiom'), // 既存の熟語データは保持
          ...wordData
        ]);
      }
    }
  }, [items]);

  const handleDifficultyChange = useCallback((difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    setCurrentIndex(0); // フィルター変更時に最初の問題に戻る
  }, []);

  const handleItemsLoaded = useCallback((newItems: LearningItem[]) => {
    console.log('useStudyContent: 新しい学習コンテンツを受信:', newItems.map(i => i.english));
    console.log('useStudyContent: 受信時刻:', new Date().toISOString());
    
    // typeフィールドが不足している場合は現在のコンテンツタイプに合わせる
    const typedItems = newItems.map((item: any) => ({
      ...item,
      type: item.type || selectedContentType === 'word' ? 'word' : 'idiom'
    }));
    
    if (selectedContentType === 'word') {
      // 単語モードの場合、既存の熟語データを保持し、単語データのみを置き換え
      setItems(prevItems => [
        ...prevItems.filter(item => item.type === 'idiom'),
        ...typedItems.filter(item => item.type === 'word')
      ]);
    } else {
      // 熟語モードの場合、既存の単語データを保持し、熟語データのみを置き換え
      setItems(prevItems => [
        ...prevItems.filter(item => item.type === 'word'),
        ...typedItems.filter(item => item.type === 'idiom')
      ]);
    }
    
    setCurrentIndex(0);
  }, [selectedContentType]);

  return {
    items,
    currentIndex,
    selectedContentType,
    selectedDifficulty,
    filteredItems,
    currentItem,
    isLoading,
    handleNext,
    handleContentTypeChange,
    handleDifficultyChange,
    handleItemsLoaded,
    setIsLoading,
  };
};