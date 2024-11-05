import React from 'react';

const categories = ['All', 'General', 'Event', 'Alert'];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeCategory === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {category}
          </button>
        ))}
      </nav>
    </div>
  );
}