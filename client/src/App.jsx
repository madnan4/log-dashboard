import React from 'react';
import { useDashboardStore } from './store/dashboardStore.jsx';
import Header from './components/layout/Header.jsx';
import LogUploader from './components/uploader/LogUploader.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const { result, error } = useDashboardStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!result ? <LogUploader /> : <Dashboard />}
    </div>
  );
}