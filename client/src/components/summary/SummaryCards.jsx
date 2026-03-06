import React from 'react';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

function Card({ label, value, sub, color }) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-l-4 ${color}`}>
      <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-white text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function SummaryCards() {
  const result = useDashboardStore((s) => s.result);
  if (!result) return null;

  const { totalEntries, anomalies, uniqueIPs, timeRange, logType } = result;
  const from = timeRange ? new Date(timeRange.from).toLocaleString() : '—';
  const to = timeRange ? new Date(timeRange.to).toLocaleString() : '—';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card
        label="Total Events"
        value={totalEntries.toLocaleString()}
        sub={`${logType} log`}
        color="border-blue-500"
      />
      <Card
        label="Anomalies"
        value={anomalies.length}
        sub={anomalies.length > 0 ? 'Requires review' : 'None detected'}
        color={anomalies.length > 0 ? 'border-red-500' : 'border-green-500'}
      />
      <Card
        label="Unique Source IPs"
        value={uniqueIPs.length}
        color="border-yellow-500"
      />
      <Card
        label="Time Range"
        value={timeRange ? `${new Date(timeRange.from).toLocaleDateString()}` : '—'}
        sub={timeRange ? `${from} → ${to}` : ''}
        color="border-purple-500"
      />
    </div>
  );
}