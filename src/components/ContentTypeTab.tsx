import React from 'react';
import { ContentType } from '../types/learningItem';

interface ContentTypeTabProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const ContentTypeTab: React.FC<ContentTypeTabProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  const tabs = [
    { 
      value: 'idiom' as ContentType, 
      label: '熟語学習', 
      icon: '💭',
      description: '英語熟語を学習',
      activeColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      value: 'word' as ContentType, 
      label: '単語学習', 
      icon: '📝',
      description: '英単語を学習',
      activeColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTypeChange(tab.value)}
            className={`
              flex-1 p-4 sm:p-6 rounded-xl font-medium transition-all duration-300 
              border-2 relative overflow-hidden group
              ${selectedType === tab.value
                ? `${tab.activeColor} text-white shadow-lg border-transparent transform scale-105`
                : `bg-white ${tab.textColor} border-gray-200 ${tab.hoverColor} hover:text-white hover:border-transparent hover:shadow-md hover:scale-102`
              }
            `}
          >
            {/* Background gradient effect */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-br ${selectedType === tab.value ? 'from-white/20 to-white/10' : `from-${tab.value === 'idiom' ? 'blue' : 'purple'}-500 to-${tab.value === 'idiom' ? 'blue' : 'purple'}-600`}
            `}></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-2xl sm:text-3xl">{tab.icon}</span>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-bold">{tab.label}</div>
                <div className={`text-sm mt-1 ${
                  selectedType === tab.value 
                    ? 'text-white/90' 
                    : 'text-gray-500 group-hover:text-white/90'
                }`}>
                  {tab.description}
                </div>
              </div>
            </div>

            {/* Active indicator */}
            {selectedType === tab.value && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Current mode indicator for mobile */}
      <div className="mt-4 sm:hidden text-center">
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${selectedType === 'idiom' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}
        `}>
          現在のモード: {selectedType === 'idiom' ? '熟語学習' : '単語学習'}
        </span>
      </div>
    </div>
  );
};

export default ContentTypeTab;