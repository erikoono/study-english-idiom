import StudyCard from './components/StudyCard';
import DifficultyFilter from './components/DifficultyFilter';
import ContentTypeTab from './components/ContentTypeTab';
import DynamicIdiomLoader from './components/DynamicIdiomLoader';
import DynamicWordLoader from './components/DynamicWordLoader';
import { useStudyContent } from './hooks/useStudyContent';
import { useErrorHandler } from './hooks/useErrorHandler';

function App() {
  const {
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
  } = useStudyContent();

  const { error, hasError, clearError } = useErrorHandler();

  // モード別の背景色とグラデーション
  const getBackgroundClasses = () => {
    if (selectedContentType === 'word') {
      return 'min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 py-4 sm:py-8';
    }
    return 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-4 sm:py-8';
  };

  return (
    <div className={getBackgroundClasses()}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            英語学習アプリ
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            {selectedContentType === 'word' ? '英単語を楽しく学習しましょう！' : '英語の熟語を楽しく学習しましょう！'}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            問題 {currentIndex + 1} / {filteredItems.length}
          </div>
        </header>

        <ContentTypeTab 
          selectedType={selectedContentType}
          onTypeChange={handleContentTypeChange}
        />

        <DifficultyFilter 
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyChange}
        />

        {hasError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
            <span 
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={clearError}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>閉じる</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
              selectedContentType === 'word' ? 'border-purple-500' : 'border-blue-500'
            }`}></div>
            <p className="text-gray-600 mt-4">新しい問題を読み込み中...</p>
          </div>
        ) : currentItem ? (
          <StudyCard item={currentItem} onNext={handleNext} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">選択された条件の問題がありません。</p>
          </div>
        )}

        {selectedContentType === 'idiom' && (
          <div className="mt-8">
            <DynamicIdiomLoader
              selectedDifficulty={selectedDifficulty}
              onIdiomsLoaded={handleItemsLoaded}
              onLoadingChange={setIsLoading}
            />
          </div>
        )}

        {selectedContentType === 'word' && (
          <div className="mt-8">
            <DynamicWordLoader
              selectedDifficulty={selectedDifficulty}
              onWordsLoaded={handleItemsLoaded}
              onLoadingChange={setIsLoading}
            />
          </div>
        )}

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>英語学習アプリ © 2024</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 