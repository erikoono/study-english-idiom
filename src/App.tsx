import { useState } from 'react';
import IdiomCard from './components/IdiomCard';
import DifficultyFilter from './components/DifficultyFilter';
import DynamicIdiomLoader from './components/DynamicIdiomLoader';
import { sampleIdioms } from './data/idioms';
import { Idiom } from './types/idiom';

// スクレイピングで取得したデータを動的にインポート
let scrapedIdioms: Idiom[] = [];
try {
  const scrapedModule = require('./data/scraped-idioms');
  scrapedIdioms = scrapedModule.scrapedIdioms || [];
} catch (error) {
  console.log('スクレイピングデータが見つかりません。サンプルデータを使用します。');
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [idioms, setIdioms] = useState<Idiom[]>([...sampleIdioms, ...scrapedIdioms]);
  const [isLoading, setIsLoading] = useState(false);

  // 難易度でフィルタリング
  const filteredIdioms = idioms.filter(idiom => 
    selectedDifficulty === 'all' || idiom.difficulty === selectedDifficulty
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredIdioms.length);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentIndex(0); // フィルター変更時に最初の問題に戻る
  };

  const handleIdiomsLoaded = (newIdioms: Idiom[]) => {
    setIdioms(newIdioms);
    setCurrentIndex(0);
  };

  const currentIdiom = filteredIdioms[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            英語熟語学習アプリ
          </h1>
          <p className="text-gray-600 text-lg">
            英語の熟語を楽しく学びましょう！
          </p>
          <div className="mt-4 text-sm text-gray-500">
            問題 {currentIndex + 1} / {filteredIdioms.length}
          </div>
        </header>

        <DynamicIdiomLoader
          selectedDifficulty={selectedDifficulty}
          onIdiomsLoaded={handleIdiomsLoaded}
          onLoadingChange={setIsLoading}
        />

        <DifficultyFilter 
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
        />

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">新しい問題を読み込み中...</p>
          </div>
        ) : currentIdiom ? (
          <IdiomCard idiom={currentIdiom} onNext={handleNext} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">選択された難易度の問題がありません。</p>
          </div>
        )}

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>英語熟語学習アプリ © 2024</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 