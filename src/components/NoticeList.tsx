import React from 'react';
import NoticeCard from './NoticeCard';
import type { Notice } from '../types';

interface NoticeListProps {
  notices: Notice[];
  viewMode: 'board' | 'list';
}

export default function NoticeList({ notices, viewMode }: NoticeListProps) {
  return (
    <div className={`
      grid gap-6
      ${viewMode === 'board' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1'
      }
    `}>
      {notices.map((notice) => (
        <NoticeCard 
          key={notice.id} 
          notice={notice} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}