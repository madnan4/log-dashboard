import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

export default function AuthTimeline() {
  const result = useDashboardStore((s) => s.result);

  const data = useMemo(() => {
    if (!result) return [];
    const authEntries = result.entries.filter((e) => e.isAuthSuccess !== null);
    if (!authEntries.length) return [];

    const times = authEntries.map((e) => new Date(e.timestamp).getTime());
    const min = Math.min(...times);
    const max = Math.max(...times);
    const bucketMs = Math.max((max - min) / 20, 60 * 1000);

    const buckets = new Map();
    for (const entry of authEntries) {
      const t = new Date(entry.timestamp).getTime();
      const key = Math.floor((t - min) / bucketMs) * bucketMs + min;
      if (!buckets.has(key)) buckets.set(key, { failed: 0, success: 0 });
      if (entry.isAuthSuccess) buckets.get(key).success++;
      else buckets.get(key).failed++;
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a - b)
      .map(([ts, v]) => ({
        time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...v,
      }));
  }, [result]);

  if (!data.length) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white font-semibold mb-4">Auth Events Timeline</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
          <Line type="monotone" dataKey="failed" stroke="#EF4444" strokeWidth={2} dot={false} name="Failed" />
          <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} dot={false} name="Success" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}