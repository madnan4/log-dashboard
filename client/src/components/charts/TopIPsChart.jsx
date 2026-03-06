import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

export default function TopIPsChart() {
  const result = useDashboardStore((s) => s.result);

  const data = useMemo(() => {
    if (!result) return [];
    const counts = {};
    for (const entry of result.entries) {
      if (entry.sourceIP) counts[entry.sourceIP] = (counts[entry.sourceIP] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
  }, [result]);

  if (!result || data.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white font-semibold mb-4">Top Source IPs</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <YAxis type="category" dataKey="ip" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={110} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#F9FAFB' }}
            itemStyle={{ color: '#34D399' }}
          />
          <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} name="Requests" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}