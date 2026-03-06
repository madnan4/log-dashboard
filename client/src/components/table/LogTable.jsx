import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '../../store/dashboardStore.jsx';
import SearchBar from './SearchBar.jsx';

const PAGE_SIZE = 50;

const STATUS_COLOR = (status) => {
  if (!status) return 'text-gray-500';
  if (status < 300) return 'text-green-400';
  if (status < 400) return 'text-blue-400';
  if (status < 500) return 'text-yellow-400';
  return 'text-red-400';
};

export default function LogTable() {
  const result = useDashboardStore((s) => s.result);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!result) return [];
    const q = searchQuery.toLowerCase();
    if (!q) return result.entries;
    return result.entries.filter((e) =>
      (e.sourceIP ?? '').includes(q) ||
      (e.user ?? '').toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q)
    );
  }, [result, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageEntries = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset to page 0 when search changes
  React.useEffect(() => { setPage(0); }, [searchQuery]);

  if (!result) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold">Raw Log Entries</h2>
        <span className="text-gray-500 text-sm">{filtered.length.toLocaleString()} entries</span>
      </div>

      <SearchBar />

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700/50 text-gray-400 text-xs uppercase tracking-wide">
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">Source IP</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Auth</th>
              <th className="px-3 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {pageEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-3 py-2 text-gray-400 whitespace-nowrap font-mono text-xs">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-gray-300 font-mono text-xs whitespace-nowrap">
                  {entry.sourceIP ?? <span className="text-gray-600">—</span>}
                </td>
                <td className="px-3 py-2 text-gray-300 text-xs whitespace-nowrap">
                  {entry.user ?? <span className="text-gray-600">—</span>}
                </td>
                <td className="px-3 py-2 text-gray-300 text-xs whitespace-nowrap">{entry.action}</td>
                <td className={`px-3 py-2 font-mono text-xs whitespace-nowrap ${STATUS_COLOR(entry.status)}`}>
                  {entry.status ?? '—'}
                </td>
                <td className="px-3 py-2 text-xs whitespace-nowrap">
                  {entry.isAuthSuccess === true && <span className="text-green-400">✓ OK</span>}
                  {entry.isAuthSuccess === false && <span className="text-red-400">✗ Fail</span>}
                  {entry.isAuthSuccess === null && <span className="text-gray-600">—</span>}
                </td>
                <td className="px-3 py-2 text-gray-500 text-xs max-w-xs truncate" title={entry.message}>
                  {entry.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <span className="text-gray-500 text-xs">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-xs rounded border border-gray-600 text-gray-400 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 text-xs rounded border border-gray-600 text-gray-400 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}