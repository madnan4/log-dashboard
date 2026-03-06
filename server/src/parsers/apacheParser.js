import { v4 as uuidv4 } from 'uuid';

const APACHE_REGEX = /^(?<ip>\S+)\s+\S+\s+(?<user>\S+)\s+\[(?<time>[^\]]+)\]\s+"(?<method>\S+)\s+(?<path>\S+)\s+\S+"\s+(?<status>\d{3})\s+(?<bytes>\S+)(?:\s+"(?<referer>[^"]*)"\s+"(?<agent>[^"]*)")?$/;

const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseApacheDate(raw) {
  // Format: "06/Mar/2026:08:12:01 -0500"
  const [datePart, tzPart] = raw.split(' ');
  const [day, mon, rest] = datePart.split('/');
  const [year, hh, mm, ss] = rest.split(':');
  const tzSign = tzPart[0];
  const tzH = tzPart.slice(1, 3);
  const tzM = tzPart.slice(3, 5);
  const monthNum = String(MONTHS[mon] + 1).padStart(2, '0');
  return new Date(`${year}-${monthNum}-${day.padStart(2, '0')}T${hh}:${mm}:${ss}${tzSign}${tzH}:${tzM}`);
}

/**
 * @param {string} content
 * @returns {{ entries: import('../types.js').LogEntry[], parseErrors: number }}
 */
export function parseApache(content) {
  const lines = content.split('\n').filter((l) => l.trim());
  const entries = [];
  let parseErrors = 0;

  for (const line of lines) {
    const match = APACHE_REGEX.exec(line);
    if (!match || !match.groups) {
      parseErrors++;
      continue;
    }

    const { ip, user, time, method, path, status } = match.groups;
    const statusCode = parseInt(status, 10);
    const timestamp = parseApacheDate(time);

    if (isNaN(timestamp.getTime())) {
      parseErrors++;
      continue;
    }

    // 401/403 treated as failed auth; 200 on /login path as success
    let isAuthSuccess = null;
    if (statusCode === 401 || statusCode === 403) isAuthSuccess = false;
    else if (statusCode === 200 && (path.includes('login') || path.includes('auth'))) isAuthSuccess = true;

    entries.push({
      id: uuidv4(),
      logType: 'apache',
      timestamp,
      sourceIP: ip === '-' ? null : ip,
      action: method,
      status: statusCode,
      user: user === '-' ? null : user,
      message: line.trim(),
      isAuthSuccess,
    });
  }

  return { entries, parseErrors };
}