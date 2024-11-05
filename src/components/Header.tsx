import React from 'react';
import { Search, LayoutGrid, List, Sun, Moon, UserCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  viewMode: 'board' | 'list';
  onViewModeChange: (mode: 'board' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoginClick: () => void;
}

export default function Header({ viewMode, onViewModeChange, searchQuery, onSearchChange, onLoginClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="max-w-lg w-full relative">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-700 
                text-gray-900 dark:text-gray-100"
            />
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            
            {showSearchResults && searchQuery && (
              <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search results for "{searchQuery}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <div className="flex items-center space-x-2 border dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('board')}
              className={`p-1.5 rounded ${
                viewMode === 'board' 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list' 
                  ? 'bg-gray-100 dark:bg-gray-700' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <List className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <button 
            onClick={onLoginClick}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <UserCircle2 className="h-5 w-5" />
            <span className="font-medium">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
}