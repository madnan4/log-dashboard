import { parseApache } from './apacheParser.js';
import { parseSSH } from './sshParser.js';
import { parseWindowsEvents } from './windowsEventParser.js';

/**
 * @param {string} content
 * @param {import('../types.js').LogType} logType
 * @returns {{ entries: import('../types.js').LogEntry[], parseErrors: number }}
 */
export function parseLog(content, logType) {
  switch (logType) {
    case 'apache':  return parseApache(content);
    case 'ssh':     return parseSSH(content);
    case 'windows': return parseWindowsEvents(content);
    default:        throw new Error(`Unknown log type: ${logType}`);
  }
}