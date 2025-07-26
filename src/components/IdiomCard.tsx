import React, { useState } from 'react';
import { Idiom } from '../types/idiom';

interface IdiomCardProps {
  idiom: Idiom;
  onNext: () => void;
}

const IdiomCard: React.FC<IdiomCardProps> = ({ idiom, onNext }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setShowExplanation(false);
    onNext();
  };

  const getDifficultyColor = (difficulty: string) => {
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
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">英語熟語クイズ</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(idiom.difficulty)}`}>
            {idiom.difficulty === 'easy' ? '初級' : idiom.difficulty === 'medium' ? '中級' : '上級'}
          </span>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-primary-600 mb-2">
            {idiom.english}
          </h3>
          <p className="text-gray-600 text-lg">この熟語の意味を考えてみましょう</p>
        </div>
      </div>

      {!showAnswer && (
        <div className="text-center mb-6">
          <button
            onClick={handleShowAnswer}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
          >
            答えを見る
          </button>
        </div>
      )}

      {showAnswer && (
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">日本語の意味</h4>
            <p className="text-blue-700 text-lg">{idiom.japanese}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">例文</h4>
            <p className="text-green-700 italic">"{idiom.example}"</p>
          </div>

          {!showExplanation && (
            <div className="text-center">
              <button
                onClick={handleShowExplanation}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                詳しい説明を見る
              </button>
            </div>
          )}

          {showExplanation && (
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">詳しい説明</h4>
              <p className="text-purple-700">{idiom.explanation}</p>
            </div>
          )}
        </div>
      )}

      {showAnswer && (
        <div className="text-center">
          <button
            onClick={handleNext}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
          >
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
};

export default IdiomCard; 