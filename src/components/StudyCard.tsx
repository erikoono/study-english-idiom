import React, { useState, useCallback } from 'react';
import { LearningItem, isIdiom, isWord } from '../types/learningItem';

interface StudyCardProps {
  item: LearningItem;
  onNext: () => void;
}

const StudyCard: React.FC<StudyCardProps> = ({ item, onNext }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const handleShowDetails = useCallback(() => {
    setShowDetails(true);
  }, []);

  const handleNext = useCallback(() => {
    setShowAnswer(false);
    setShowDetails(false);
    onNext();
  }, [onNext]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // 熟語用のレンダリング
  const renderIdiomContent = () => {
    if (!isIdiom(item)) return null;

    return (
      <>
        {showAnswer && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-lg font-semibold">答え: {item.japanese}</p>
          </div>
        )}

        {showDetails && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">例文:</h4>
              <p className="text-gray-600 italic">"{item.example}"</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">説明:</h4>
              <p className="text-purple-600">{item.explanation}</p>
            </div>
          </div>
        )}
      </>
    );
  };

  // 単語用のレンダリング
  const renderWordContent = () => {
    if (!isWord(item)) return null;

    return (
      <>
        {showAnswer && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-lg font-semibold">意味: {item.japanese}</p>
            {item.pronunciation && (
              <p className="text-blue-600 mt-2">発音: {item.pronunciation}</p>
            )}
            <p className="text-blue-600 mt-2">品詞: {item.partOfSpeech}</p>
          </div>
        )}

        {showDetails && (
          <div className="mt-6 space-y-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">定義:</h4>
              <p className="text-gray-600 text-sm sm:text-base">{item.definition}</p>
            </div>
            
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2 text-sm sm:text-base">例文:</h4>
              <div className="space-y-2">
                {item.exampleSentences.map((sentence, index) => (
                  <p key={index} className="text-green-600 italic text-sm sm:text-base break-words">
                    "{sentence}"
                  </p>
                ))}
              </div>
            </div>

            {item.synonyms && item.synonyms.length > 0 && (
              <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2 text-sm sm:text-base">同義語:</h4>
                <p className="text-orange-600 text-sm sm:text-base break-words">{item.synonyms.join(', ')}</p>
              </div>
            )}

            {item.antonyms && item.antonyms.length > 0 && (
              <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2 text-sm sm:text-base">反意語:</h4>
                <p className="text-red-600 text-sm sm:text-base break-words">{item.antonyms.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // モード別のカードスタイル
  const getCardClasses = () => {
    const baseClasses = "max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8";
    if (isWord(item)) {
      return `${baseClasses} border-l-4 border-purple-500`;
    }
    return `${baseClasses} border-l-4 border-blue-500`;
  };

  // ボタンの色テーマ
  const getButtonTheme = () => {
    if (isWord(item)) {
      return {
        answer: 'bg-purple-500 hover:bg-purple-600',
        details: 'bg-indigo-500 hover:bg-indigo-600',
        next: 'bg-green-500 hover:bg-green-600'
      };
    }
    return {
      answer: 'bg-blue-500 hover:bg-blue-600',
      details: 'bg-purple-500 hover:bg-purple-600',
      next: 'bg-green-500 hover:bg-green-600'
    };
  };

  const buttonTheme = getButtonTheme();

  return (
    <div className={getCardClasses()}>
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
          {item.difficulty}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.type === 'idiom' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {item.type === 'idiom' ? '熟語' : '単語'}
        </span>
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 break-words">
          {item.english}
        </h2>
        {isWord(item) && item.pronunciation && (
          <p className="text-gray-500 text-sm sm:text-base mb-2 font-mono">
            {item.pronunciation}
          </p>
        )}
        <p className="text-gray-600 text-base sm:text-lg">
          この{item.type === 'idiom' ? '熟語' : '単語'}の意味は何でしょうか？
        </p>
      </div>

      {/* コンテンツタイプ別のレンダリング */}
      {isIdiom(item) && renderIdiomContent()}
      {isWord(item) && renderWordContent()}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        {!showAnswer && (
          <button
            onClick={handleShowAnswer}
            className={`flex-1 ${buttonTheme.answer} text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base`}
          >
            答えを表示
          </button>
        )}
        
        {showAnswer && !showDetails && (
          <button
            onClick={handleShowDetails}
            className={`flex-1 ${buttonTheme.details} text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base`}
          >
            詳細を表示
          </button>
        )}
        
        {showAnswer && (
          <button
            onClick={handleNext}
            className={`flex-1 ${buttonTheme.next} text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base`}
          >
            次の問題
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyCard;