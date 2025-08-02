import React, { useState, useEffect, useCallback } from 'react';
import { fetchRandomIdioms, refreshIdioms, checkApiHealth } from '../services/api';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { Idiom } from '../types/idiom';

interface DynamicIdiomLoaderProps {
  selectedDifficulty: string;
  onIdiomsLoaded: (idioms: Idiom[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const DynamicIdiomLoader: React.FC<DynamicIdiomLoaderProps> = ({
  selectedDifficulty,
  onIdiomsLoaded,
  onLoadingChange
}) => {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { handleApiError } = useErrorHandler();

  // APIサーバーの可用性をチェック
  useEffect(() => {
    const checkApi = async () => {
      const available = await checkApiHealth();
      setIsApiAvailable(available);
    };
    checkApi();
  }, []);

  const loadIdioms = useCallback(async () => {
    onLoadingChange(true);
    try {
      const idioms = await fetchRandomIdioms(10, selectedDifficulty);
      if (idioms.length > 0) {
        console.log('初期熟語を読み込みました:', idioms.map(i => i.english));
        console.log('読み込み時刻:', new Date().toISOString());
        
        // 強制的に新しい状態を設定
        onIdiomsLoaded([...idioms]);
        setLastRefresh(new Date());
      }
    } catch (error) {
      handleApiError(error as Error, '熟語の読み込みに失敗しました。');
    } finally {
      onLoadingChange(false);
    }
  }, [selectedDifficulty, onIdiomsLoaded, onLoadingChange, handleApiError]);

  // 難易度が変更されたときに新しい熟語を取得
  useEffect(() => {
    loadIdioms();
  }, [loadIdioms]);

  // ページ読み込み時に熟語を取得
  useEffect(() => {
    loadIdioms();
  }, []);

  const handleRefresh = useCallback(async () => {
    onLoadingChange(true);
    try {
      // 強制的に新しいデータを取得するために少し待機
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newIdioms = await refreshIdioms();
      
      if (newIdioms.length > 0) {
        console.log('新しい熟語を取得しました:', newIdioms.map(i => i.english));
        console.log('取得時刻:', new Date().toISOString());
        
        // 強制的に新しい状態を設定
        onIdiomsLoaded([...newIdioms]);
        setLastRefresh(new Date());
      }
    } catch (error) {
      handleApiError(error as Error, '新しい問題の取得に失敗しました。');
    } finally {
      onLoadingChange(false);
    }
  }, [onIdiomsLoaded, onLoadingChange, handleApiError]);

  if (isApiAvailable === null) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
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
              <p>動的スクレイピング機能を使用するには、APIサーバーを起動してください：</p>
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">npm run api</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              動的スクレイピング機能が有効です
            </h3>
            <p className="text-sm text-blue-700">
              新しい熟語を取得して学習を続けましょう
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          新しい問題を取得
        </button>
      </div>
      {lastRefresh && (
        <div className="mt-2 text-xs text-blue-600">
          最終更新: {lastRefresh.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default DynamicIdiomLoader; 