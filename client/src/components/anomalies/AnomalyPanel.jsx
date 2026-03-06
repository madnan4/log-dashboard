import React from 'react';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

const SEVERITY_STYLES = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/50',
  medium:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low:      'bg-blue-500/20 text-blue-400 border-blue-500/50',
};

const TYPE_LABELS = {
  brute_force:      'Brute Force',
  '404_spike':      '404 Spike',
  off_hours_login:  'Off-hours Login',
};

export default function AnomalyPanel() {
  const result = useDashboardStore((s) => s.result);
  if (!result) return null;

  const { anomalies } = result;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${anomalies.length > 0 ? 'bg-red-400' : 'bg-green-400'}`} />
        Anomaly Detection
        <span className="ml-auto text-gray-400 text-sm font-normal">
          {anomalies.length} alert{anomalies.length !== 1 ? 's' : ''}
        </span>
      </h2>

      {anomalies.length === 0 ? (
        <p className="text-gray-500 text-sm py-4 text-center">No anomalies detected in this log file.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {anomalies.map((a) => (
            <div key={a.id} className={`rounded-lg border p-3 ${SEVERITY_STYLES[a.severity]}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wide">{a.severity}</span>
                <span className="text-xs opacity-60">—</span>
                <span className="text-xs font-medium">{TYPE_LABELS[a.type] ?? a.type}</span>
                <span className="ml-auto text-xs opacity-60">{a.eventCount} events</span>
              </div>
              <p className="text-sm opacity-90">{a.description}</p>
              {a.affectedIPs.length > 0 && (
                <p className="text-xs opacity-60 mt-1">
                  IPs: {a.affectedIPs.slice(0, 5).join(', ')}{a.affectedIPs.length > 5 ? ` +${a.affectedIPs.length - 5} more` : ''}
                </p>
              )}
              <p className="text-xs opacity-50 mt-1">
                {new Date(a.firstSeen).toLocaleString()} — {new Date(a.lastSeen).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}