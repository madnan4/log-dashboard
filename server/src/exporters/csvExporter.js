/**
 * @param {import('../types.js').LogEntry[]} entries
 * @returns {string}
 */
export function entriesToCSV(entries) {
  const header = ['id', 'logType', 'timestamp', 'sourceIP', 'action', 'status', 'user', 'message', 'isAuthSuccess'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = entries.map((e) => [
    e.id,
    e.logType,
    e.timestamp instanceof Date ? e.timestamp.toISOString() : e.timestamp,
    e.sourceIP ?? '',
    e.action,
    e.status ?? '',
    e.user ?? '',
    escape(e.message),
    e.isAuthSuccess === null ? '' : String(e.isAuthSuccess),
  ].join(','));
  return [header.join(','), ...rows].join('\n');
}

/**
 * @param {import('../types.js').Anomaly[]} anomalies
 * @returns {string}
 */
export function anomaliesToCSV(anomalies) {
  const header = ['id', 'type', 'severity', 'description', 'affectedIPs', 'affectedUser', 'firstSeen', 'lastSeen', 'eventCount'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = anomalies.map((a) => [
    a.id,
    a.type,
    a.severity,
    escape(a.description),
    escape(a.affectedIPs.join(';')),
    a.affectedUser ?? '',
    a.firstSeen instanceof Date ? a.firstSeen.toISOString() : a.firstSeen,
    a.lastSeen instanceof Date ? a.lastSeen.toISOString() : a.lastSeen,
    a.eventCount,
  ].join(','));
  return [header.join(','), ...rows].join('\n');
}