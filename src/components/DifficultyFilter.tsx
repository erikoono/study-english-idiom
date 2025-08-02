import React from 'react';
import { DifficultyLevel } from '../types/learningItem';

interface DifficultyFilterProps {
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ 
  selectedDifficulty, 
  onDifficultyChange 
}) => {
  const difficulties: Array<{ value: DifficultyLevel; label: string; color: string }> = [
    { value: 'all', label: 'すべて', color: 'bg-gray-500' },
    { value: 'easy', label: '初級', color: 'bg-green-500' },
    { value: 'medium', label: '中級', color: 'bg-yellow-500' },
    { value: 'hard', label: '上級', color: 'bg-red-500' }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">難易度を選択</h3>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.value}
            onClick={() => onDifficultyChange(difficulty.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedDifficulty === difficulty.value
                ? `${difficulty.color} text-white shadow-md`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {difficulty.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultyFilter; 