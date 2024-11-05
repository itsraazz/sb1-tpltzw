import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import NoticeList from './components/NoticeList';
import Header from './components/Header';
import AddNoticeModal from './components/AddNoticeModal';
import AuthModal from './components/AuthModal';
import CalendarModal from './components/CalendarModal';
import FeedbackModal from './components/FeedbackModal';
import type { Notice } from './types';

const SAMPLE_NOTICES: Notice[] = [
  {
    id: '1',
    title: 'Mobile App Design',
    content: 'Review the latest mobile app design mockups and provide feedback.',
    category: 'Clubs',
    priority: 'Low',
    date: '2024-03-15',
    author: 'Design Team',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '2',
    title: 'Brainstorming Session',
    content: 'Join us for a creative brainstorming session to discuss new features.',
    category: 'Academics',
    priority: 'Medium',
    date: '2024-03-20',
    author: 'Product Team',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: '3',
    title: 'System Maintenance',
    content: 'Scheduled maintenance window for system updates.',
    category: 'Library',
    priority: 'High',
    date: '2024-03-18',
    author: 'IT Department',
  },
];

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'task' | 'event';
}

function App() {
  const [notices, setNotices] = useState<Notice[]>(SAMPLE_NOTICES);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const filteredItems = activeCategory === 'Events' 
    ? events.map(event => ({
        id: event.id,
        title: event.title,
        content: event.description,
        category: 'Events',
        priority: 'Medium',
        date: event.date.toString(),
        author: 'Calendar',
      }))
    : notices.filter(notice => {
        const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
        const matchesSearch = searchQuery === '' || 
          notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

  const handleAddNotice = (newNotice: Omit<Notice, 'id' | 'date'>, files: File[]) => {
    const notice: Notice = {
      ...newNotice,
      id: (notices.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setNotices([notice, ...notices]);
    setIsAddNoticeOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddNotice={() => setIsAddNoticeOpen(true)}
        onCalendarClick={() => setIsCalendarOpen(true)}
        onFeedbackClick={() => setIsFeedbackOpen(true)}
        eventCount={events.length}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLoginClick={() => setIsAuthModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <NoticeList notices={filteredItems} viewMode={viewMode} />
        </main>
      </div>

      <AddNoticeModal
        isOpen={isAddNoticeOpen}
        onClose={() => setIsAddNoticeOpen(false)}
        onSubmit={handleAddNotice}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onAddEvent={handleAddEvent}
        events={events}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}

export default App;