import React, { useState, useEffect, useCallback } from 'react';
import { LearningItem } from '../types/learningItem';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface DynamicWordLoaderProps {
  selectedDifficulty: string;
  onWordsLoaded: (words: LearningItem[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const DynamicWordLoader: React.FC<DynamicWordLoaderProps> = ({
  selectedDifficulty,
  onWordsLoaded,
  onLoadingChange
}) => {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { handleApiError } = useErrorHandler();

  // APIサーバーの可用性をチェック
  useEffect(() => {
    const checkApi = async () => {
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'production' 
          ? 'https://study-english-idiom-api.onrender.com/api'
          : 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();
        setIsApiAvailable(result.success);
      } catch (error) {
        setIsApiAvailable(false);
      }
    };
    checkApi();
  }, []);

  // 難易度が変更されたときに新しい単語を取得
  useEffect(() => {
    if (isApiAvailable) {
      loadWords();
    }
  }, [selectedDifficulty, isApiAvailable]);

  // ページ読み込み時に単語を取得
  useEffect(() => {
    if (isApiAvailable) {
      loadWords();
    }
  }, [isApiAvailable]);

  const loadWords = useCallback(async () => {
    if (!isApiAvailable) return;
    
    onLoadingChange(true);
    try {
      const params = new URLSearchParams();
      params.append('count', '10');
      params.append('external', 'true'); // 外部API使用を明示
      if (selectedDifficulty && selectedDifficulty !== 'all') {
        params.append('difficulty', selectedDifficulty);
      }
      
      const timestamp = new Date().getTime();
      params.append('t', timestamp.toString());

      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://study-english-idiom-api.onrender.com/api'
        : 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/words?${params}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('新しい単語を取得しました:', result.data.map((w: any) => w.english));
        console.log('データソース:', result.source || 'unknown');
        if (result.warning) {
          console.warn('警告:', result.warning);
        }
        console.log('取得時刻:', new Date().toISOString());
        
        onWordsLoaded(result.data);
        setLastRefresh(new Date());
      } else {
        throw new Error('単語データの取得に失敗しました');
      }
    } catch (error) {
      handleApiError(error as Error, '新しい単語の取得に失敗しました。外部辞書APIまたは内部データベースからの取得を試しています。');
    } finally {
      onLoadingChange(false);
    }
  }, [selectedDifficulty, isApiAvailable, onWordsLoaded, onLoadingChange, handleApiError]);

  const handleRefresh = useCallback(async () => {
    if (!isApiAvailable) return;
    
    onLoadingChange(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const params = new URLSearchParams();
      params.append('external', 'true'); // 外部API使用を明示
      
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://study-english-idiom-api.onrender.com/api'
        : 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/words/refresh?${params}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('新しい単語セットを取得しました:', result.data.map((w: any) => w.english));
        console.log('データソース:', result.source || 'unknown');
        if (result.warning) {
          console.warn('警告:', result.warning);
        }
        console.log('取得時刻:', new Date().toISOString());
        
        onWordsLoaded(result.data);
        setLastRefresh(new Date());
      } else {
        throw new Error('単語データの更新に失敗しました');
      }
    } catch (error) {
      handleApiError(error as Error, '新しい単語の取得に失敗しました。外部辞書APIまたは内部データベースからの取得を試しています。');
    } finally {
      onLoadingChange(false);
    }
  }, [isApiAvailable, onWordsLoaded, onLoadingChange, handleApiError]);

  if (isApiAvailable === null) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-600 mt-2">APIサーバーを確認中...</p>
      </div>
    );
  }

  if (isApiAvailable === false) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              APIサーバーが利用できません
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>動的単語取得機能を使用するには、APIサーバーを起動してください：</p>
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">npm run api</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              外部辞書API統合機能が有効です
            </h3>
            <p className="text-sm text-purple-700">
              Free Dictionary APIから豊富な単語データを取得して学習できます
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          新しい単語を取得
        </button>
      </div>
      {lastRefresh && (
        <div className="mt-2 text-xs text-purple-600">
          最終更新: {lastRefresh.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default DynamicWordLoader;