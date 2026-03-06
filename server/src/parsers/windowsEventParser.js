import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param {string} content
 * @returns {{ entries: import('../types.js').LogEntry[], parseErrors: number }}
 */
export function parseWindowsEvents(content) {
  let records;
  try {
    records = parse(content, { columns: true, skip_empty_lines: true, trim: true });
  } catch {
    return { entries: [], parseErrors: 1 };
  }

  const entries = [];
  let parseErrors = 0;

  for (const row of records) {
    const timestamp = new Date(row['TimeCreated']);
    if (isNaN(timestamp.getTime())) {
      parseErrors++;
      continue;
    }

    const eventId = parseInt(row['EventID'], 10);
    const user = row['SubjectUserName'] || null;
    const ip = row['IpAddress'];
    const sourceIP = (!ip || ip === '-') ? null : ip;

    let isAuthSuccess = null;
    if (eventId === 4624) isAuthSuccess = true;
    else if (eventId === 4625) isAuthSuccess = false;

    entries.push({
      id: uuidv4(),
      logType: 'windows',
      timestamp,
      sourceIP,
      action: `EventID ${eventId}`,
      status: eventId,
      user,
      message: row['Message'] || `EventID ${eventId}`,
      isAuthSuccess,
    });
  }

  return { entries, parseErrors };
}