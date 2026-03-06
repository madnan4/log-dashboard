import { v4 as uuidv4 } from 'uuid';

const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const FAILED_RE = /^(\w{3})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+\S+\s+sshd\[\d+\]:\s+Failed password for(?: invalid user)?\s+(\S+)\s+from\s+(\S+)/;
const ACCEPTED_RE = /^(\w{3})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+\S+\s+sshd\[\d+\]:\s+Accepted \S+ for\s+(\S+)\s+from\s+(\S+)/;

function parseSSHDate(month, day, time) {
  const year = new Date().getFullYear();
  const [hh, mm, ss] = time.split(':');
  return new Date(year, MONTHS[month], parseInt(day, 10), parseInt(hh, 10), parseInt(mm, 10), parseInt(ss, 10));
}

/**
 * @param {string} content
 * @returns {{ entries: import('../types.js').LogEntry[], parseErrors: number }}
 */
export function parseSSH(content) {
  const lines = content.split('\n').filter((l) => l.trim());
  const entries = [];
  let parseErrors = 0;

  for (const line of lines) {
    const failed = FAILED_RE.exec(line);
    if (failed) {
      const [, month, day, time, user, ip] = failed;
      entries.push({
        id: uuidv4(),
        logType: 'ssh',
        timestamp: parseSSHDate(month, day, time),
        sourceIP: ip,
        action: 'Failed password',
        status: null,
        user,
        message: line.trim(),
        isAuthSuccess: false,
      });
      continue;
    }

    const accepted = ACCEPTED_RE.exec(line);
    if (accepted) {
      const [, month, day, time, user, ip] = accepted;
      entries.push({
        id: uuidv4(),
        logType: 'ssh',
        timestamp: parseSSHDate(month, day, time),
        sourceIP: ip,
        action: 'Accepted password',
        status: null,
        user,
        message: line.trim(),
        isAuthSuccess: true,
      });
      continue;
    }

    parseErrors++;
  }

  return { entries, parseErrors };
}