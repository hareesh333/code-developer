import React, { useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';

interface FeatureSidebarProps {
  title: string;
  items: { label: string; count?: number }[];
}

export default function FeatureSidebar({ title, items }: FeatureSidebarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div
      className={`border-r border-gray-200 transition-all duration-300 ${
        isVisible ? 'w-64' : 'w-0 overflow-hidden'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="space-y-1">
          {items.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center justify-between px-3 py-2 text-sm text-textPrimary hover:bg-hoverBg rounded-md"
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="bg-gray-100 text-textSecondary px-2 py-1 rounded-full text-xs">
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}