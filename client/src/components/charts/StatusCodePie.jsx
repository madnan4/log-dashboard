import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

function codeColor(code) {
  if (code < 300) return '#10B981'; // green
  if (code < 400) return '#3B82F6'; // blue
  if (code < 500) return '#F59E0B'; // amber
  return '#EF4444';                 // red
}

export default function StatusCodePie() {
  const result = useDashboardStore((s) => s.result);

  const data = useMemo(() => {
    if (!result || result.logType !== 'apache') return [];
    const counts = {};
    for (const entry of result.entries) {
      if (entry.status != null) {
        const key = String(entry.status);
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([code, value]) => ({ name: `HTTP ${code}`, value, code: Number(code) }));
  }, [result]);

  if (!data.length) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white font-semibold mb-4">HTTP Status Codes</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={codeColor(entry.code)} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: 8 }}
            itemStyle={{ color: '#F9FAFB' }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}