import React, { useEffect, useState } from 'react';
import Board from './Board';

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  // New: global UI controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [view, setView] = useState('board'); // 'board' | 'list'

  // Theme: light | dark, persisted
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('jt-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('jt-theme', theme);
  }, [theme]);

  // Mobile-first: default to list view on small screens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSmall = window.matchMedia('(max-width: 768px)').matches;
      if (isSmall) setView('list');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white shadow-lg sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">JobTrackr</h1>
                <p className="text-blue-100 text-xs">Your Personal Job Application Manager</p>
              </div>
            </div>

            {/* Add Job Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-white/20 text-white px-3 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M17.293 13.293a8 8 0 11-10.586-10.586 8 8 0 0010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-3 7a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 10a1 1 0 011-1H6a1 1 0 110 2H5a1 1 0 01-1-1zm9.657-6.657a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3.222 15.364a1 1 0 011.414 0l.707.707A1 1 0 114.93 17.485l-.707-.707a1 1 0 010-1.414zM15.364 16.778a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM5.636 3.222a1 1 0 010 1.414l-.707.707A1 1 0 113.515 3.93l.707-.707a1 1 0 011.414 0z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Job
              </button>
            </div>
          </div>

          {/* Toolbar: search, filters, view toggle */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company, role, notes, tags..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/15 placeholder-blue-100 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <option value="all">All Statuses</option>
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Phone Screen">Phone Screen</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Final Round">Final Round</option>
                <option value="Offer">Offer</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="md:col-span-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex items-stretch">
              <div className="grid grid-cols-2 gap-1 bg-white/15 rounded-lg p-1 w-full">
                <button
                  onClick={() => setView('board')}
                  className={`px-2 py-2 rounded-md text-sm font-semibold ${view==='board' ? 'bg-white text-blue-700' : 'text-white'}`}
                  title="Board view"
                >
                  🗂️
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-2 py-2 rounded-md text-sm font-semibold ${view==='list' ? 'bg-white text-blue-700' : 'text-white'}`}
                  title="List view"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-8">
        <Board
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          view={view}
        />
      </main>

      {/* Floating Add Button for mobile */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 md:hidden z-40 hover:scale-110 group"
        aria-label="Add new job"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
