import React from 'react';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

export default function Header() {
  const reset = useDashboardStore((s) => s.reset);

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">SOC Log Dashboard</h1>
          <p className="text-gray-400 text-xs">Security Operations Center — Log Analysis</p>
        </div>
      </div>
      <button
        onClick={reset}
        className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded border border-gray-600 hover:border-gray-400 transition-colors"
      >
        New Analysis
      </button>
    </header>
  );
}