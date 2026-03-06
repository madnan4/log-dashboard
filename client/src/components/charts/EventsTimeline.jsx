import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

function bucketEntries(entries) {
  if (!entries.length) return [];

  const times = entries.map((e) => new Date(e.timestamp).getTime());
  const min = Math.min(...times);
  const max = Math.max(...times);
  const range = max - min;

  // Pick bucket size: aim for ~20 buckets
  const bucketMs = Math.max(range / 20, 60 * 1000); // min 1 minute
  const buckets = new Map();

  for (const entry of entries) {
    const t = new Date(entry.timestamp).getTime();
    const key = Math.floor((t - min) / bucketMs) * bucketMs + min;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([ts, count]) => ({
      time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count,
    }));
}

export default function EventsTimeline() {
  const result = useDashboardStore((s) => s.result);
  const data = useMemo(() => bucketEntries(result?.entries ?? []), [result]);

  if (!result || data.length < 2) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white font-semibold mb-4">Events Over Time</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#F9FAFB' }}
            itemStyle={{ color: '#60A5FA' }}
          />
          <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} name="Events" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}