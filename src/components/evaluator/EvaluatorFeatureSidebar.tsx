import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, AlertCircle, Box, ChevronLeft } from 'lucide-react';

interface EvaluatorItem {
  id: string;
  label: string;
  hasError?: boolean;
}

interface EvaluatorCategory {
  id: string;
  label: string;
  iconColor: string;
  iconSymbol: string;
  items: EvaluatorItem[];
}

const evaluatorCategories: EvaluatorCategory[] = [
  {
    id: 'ai',
    label: 'AI evaluators',
    iconColor: 'bg-green-100 text-green-600',
    iconSymbol: '🤖',
    items: [
      { id: 'AIEvaluator-14741', label: 'AIEvaluator-14741' },
      { id: 'faithfulness', label: 'Faithfulness' }
    ]
  },
  {
    id: 'programmatic',
    label: 'Programmatic evaluators',
    iconColor: 'bg-red-100 text-red-600',
    iconSymbol: '{ }',
    items: [
      { id: 'special-chars', label: 'containsSpecialCharacters', hasError: true }
    ]
  },
  {
    id: 'statistical',
    label: 'Statistical evaluators',
    iconColor: 'bg-blue-100 text-blue-600',
    iconSymbol: '#',
    items: [
      { id: 'semantic-similarity', label: 'Semantic Similarity' }
    ]
  },
  {
    id: 'human',
    label: 'Human evaluators',
    iconColor: 'bg-gray-100 text-gray-600',
    iconSymbol: '👤',
    items: [
      { id: 'correctness', label: 'Correctness' }
    ]
  }
];

interface EvaluatorFeatureSidebarProps {
  onSelectEvaluator: (evaluatorId: string) => void;
}

export default function EvaluatorFeatureSidebar({ onSelectEvaluator }: EvaluatorFeatureSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['ai']);
  const [selectedEvaluator, setSelectedEvaluator] = useState<string>('AIEvaluator-14741');
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEvaluatorSelect = (evaluatorId: string) => {
    setSelectedEvaluator(evaluatorId);
    onSelectEvaluator(evaluatorId);
  };

  return (
    <div 
      className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Header with collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isExpanded && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded ml-2 flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-2">
        {evaluatorCategories.map(category => (
          <div key={category.id} className="mb-1">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <span className={`w-6 h-6 flex items-center justify-center rounded-md ${category.iconColor} text-xs font-medium`}>
                {category.iconSymbol}
              </span>
              {isExpanded && <span className="font-medium">{category.label}</span>}
            </button>

            {isExpanded && expandedCategories.includes(category.id) && (
              <div className="ml-9 mt-1 space-y-1">
                {category.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleEvaluatorSelect(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedEvaluator === item.id
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {item.hasError && (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Button */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <Box className="w-4 h-4" />
            Browse evaluator store
          </button>
        </div>
      )}
    </div>
  );
}