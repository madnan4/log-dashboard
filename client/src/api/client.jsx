import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '';

/**
 * @param {File} file
 * @param {'apache'|'ssh'|'windows'} logType
 */
export async function uploadLogs(file, logType) {
  const form = new FormData();
  form.append('file', file);
  form.append('logType', logType);
  const res = await axios.post(`${BASE}/api/logs/upload`, form);
  return res.data;
}

export function getCSVExportUrl(sessionId, type) {
  return `${BASE}/api/export/csv?sessionId=${sessionId}&type=${type}`;
}

export function getJSONExportUrl(sessionId) {
  return `${BASE}/api/export/json?sessionId=${sessionId}`;
}