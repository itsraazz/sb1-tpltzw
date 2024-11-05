import React, { useState } from 'react';
import { Home, Calendar, Plus, Folder, GraduationCap, Library, ChevronLeft, CalendarCheck, MessageSquare, BookOpen } from 'lucide-react';
import { categoryColors } from '../types';
import AddCategoryModal from './AddCategoryModal';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onAddNotice: () => void;
  onCalendarClick: () => void;
  onFeedbackClick: () => void;
  eventCount: number;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  count: number;
}

interface Category {
  icon: React.ElementType;
  label: string;
  count: number;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'All', count: 0 },
  { icon: CalendarCheck, label: 'Events', count: 0 },
  { icon: Calendar, label: 'Calendar', count: 0 },
];

const defaultCategories: Category[] = [
  { icon: Folder, label: 'Clubs', count: 3 },
  { icon: GraduationCap, label: 'Academics', count: 5 },
  { icon: Library, label: 'Library', count: 1 },
  { icon: BookOpen, label: 'Examinations', count: 2 },
];

const iconMap: Record<string, React.ElementType> = {
  Folder,
  GraduationCap,
  Library,
  BookOpen,
  Home,
  Calendar,
  CalendarCheck,
  MessageSquare,
};

export default function Sidebar({ 
  activeCategory, 
  onCategoryChange, 
  isOpen, 
  onToggle, 
  onAddNotice, 
  onCalendarClick, 
  onFeedbackClick,
  eventCount 
}: SidebarProps) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      const parsedCategories = JSON.parse(saved);
      return parsedCategories.map((cat: any) => ({
        ...cat,
        icon: iconMap[cat.icon] || Folder
      }));
    }
    return defaultCategories;
  });
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  React.useEffect(() => {
    const categoriesToSave = categories.map(cat => ({
      ...cat,
      icon: cat.icon.name // Store only the icon name
    }));
    localStorage.setItem('categories', JSON.stringify(categoriesToSave));
  }, [categories]);

  const getMenuItemCount = (label: string) => {
    if (label === 'Events') return eventCount;
    return 0;
  };

  const handleAddCategory = (newCategory: { label: string; icon: string }) => {
    const category = {
      label: newCategory.label,
      icon: iconMap[newCategory.icon] || Folder,
      count: 0,
    };
    setCategories([...categories, category]);
    setIsAddCategoryOpen(false);
  };

  return (
    <div className={`
      ${isOpen ? 'w-64' : 'w-20'} 
      bg-white dark:bg-gray-800 
      border-r border-gray-200 dark:border-gray-700 
      flex flex-col
      transition-all duration-300 ease-in-out
      relative
      h-screen
    `}>
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
      >
        <ChevronLeft className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      <div className="p-6">
        <h1 className={`text-xl font-bold text-gray-900 dark:text-white ${!isOpen && 'hidden'} tracking-tight`}>
          PTU Notice Board
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => label === 'Calendar' ? onCalendarClick() : onCategoryChange(label)}
            className={`
              w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200
              ${activeCategory === label
                ? `${categoryColors[label]?.bg || 'bg-blue-50 dark:bg-blue-900/20'} 
                   ${categoryColors[label]?.text || 'text-blue-700 dark:text-blue-100'} 
                   shadow-sm`
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <Icon className="h-5 w-5" />
            {isOpen && (
              <>
                <span className="ml-3 flex-1 text-left font-medium">{label}</span>
                {getMenuItemCount(label) > 0 && (
                  <span className={`
                    px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${categoryColors[label]?.bg || 'bg-blue-100 dark:bg-blue-800'} 
                    ${categoryColors[label]?.text || 'text-blue-600 dark:text-blue-100'}
                  `}>
                    {getMenuItemCount(label)}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {isOpen && (
        <div className="px-3 py-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categories
            </h2>
            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          {categories.map(({ icon: Icon, label, count }) => (
            <button
              key={label}
              onClick={() => onCategoryChange(label)}
              className={`
                w-full flex items-center px-4 py-3 text-sm rounded-xl mb-1 transition-all duration-200
                ${activeCategory === label
                  ? `${categoryColors[label]?.bg || 'bg-blue-50 dark:bg-blue-900/20'} 
                     ${categoryColors[label]?.text || 'text-blue-700 dark:text-blue-100'} 
                     shadow-sm`
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3 flex-1 text-left font-medium">{label}</span>
              {count > 0 && (
                <span className={`
                  px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${categoryColors[label]?.bg || 'bg-gray-100 dark:bg-gray-800'} 
                  ${categoryColors[label]?.text || 'text-gray-600 dark:text-gray-300'}
                `}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={onAddNotice}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          {isOpen && <span className="ml-2">Add Notice</span>}
        </button>
        {isOpen && (
          <button 
            onClick={onFeedbackClick}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2">Feedback</span>
          </button>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}