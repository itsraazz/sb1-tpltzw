import React, { useState } from 'react';
import { Calendar, MessageSquare, Download, MoreVertical, Trash2, Send } from 'lucide-react';
import type { Notice } from '../types';
import { categoryColors } from '../types';

interface NoticeCardProps {
  notice: Notice;
  viewMode: 'board' | 'list';
}

interface Comment {
  id: string;
  text: string;
  author: string;
  date: Date;
}

export default function NoticeCard({ notice, viewMode }: NoticeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleDownload = () => {
    if (notice.imageUrl) {
      const link = document.createElement('a');
      link.href = notice.imageUrl;
      link.download = `notice-${notice.id}-attachment`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/notices/${notice.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notice');
      }
      setShowMenu(false);
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment,
        author: 'Current User',
        date: new Date(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const colorClasses = categoryColors[notice.category] || {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-800 dark:text-gray-100',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-900/30'
  };

  if (viewMode === 'list') {
    return (
      <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${colorClasses.bg} ${colorClasses.hover}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {notice.imageUrl ? (
                  <img
                    src={notice.imageUrl}
                    alt={notice.title}
                    className="h-12 w-12 rounded-xl object-cover cursor-pointer"
                    onClick={handleDownload}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className={`text-lg font-medium ${colorClasses.text}`}>{notice.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{notice.content}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowComments(!showComments)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              {notice.imageUrl && (
                <button 
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <Download className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={handleDelete}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Notice
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${colorClasses.bg} ${colorClasses.hover}`}>
      {notice.imageUrl && (
        <div className="relative group">
          <img
            src={notice.imageUrl}
            alt={notice.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button 
              onClick={handleDownload}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Download className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
            {notice.category}
          </span>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Notice
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className={`text-lg font-medium ${colorClasses.text} mb-2`}>{notice.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{notice.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(notice.date).toLocaleDateString()}</span>
            </div>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{comment.author}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {comment.date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{comment.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              />
              <button
                type="submit"
                className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}