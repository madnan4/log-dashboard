import React from 'react';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useDashboardStore();

  return (
    <div className="relative mb-3">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by IP, user, action, or message..."
        className="w-full bg-gray-700 text-gray-200 text-sm pl-9 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-500"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          ✕
        </button>
      )}
    </div>
  );
}
