import React from 'react';
import { useDashboardStore } from '../../store/dashboardStore.jsx';
import { getCSVExportUrl, getJSONExportUrl } from '../../api/client.jsx';

export default function ExportButtons() {
  const result = useDashboardStore((s) => s.result);
  if (!result) return null;

  const { sessionId } = result;

  return (
    <div className="flex gap-2 mb-6">
      <a
        href={getCSVExportUrl(sessionId, 'logs')}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-colors border border-gray-600"
        download
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        Export Logs CSV
      </a>
      <a
        href={getCSVExportUrl(sessionId, 'anomalies')}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-colors border border-gray-600"
        download
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        Export Anomalies CSV
      </a>
      <a
        href={getJSONExportUrl(sessionId)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors"
        download
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        Export Full JSON
      </a>
    </div>
  );
}