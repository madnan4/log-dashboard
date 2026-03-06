/**
 * @typedef {'apache'|'ssh'|'windows'} LogType
 * @typedef {'low'|'medium'|'high'|'critical'} AnomalySeverity
 * @typedef {'brute_force'|'404_spike'|'off_hours_login'} AnomalyType
 *
 * @typedef {Object} LogEntry
 * @property {string} id
 * @property {LogType} logType
 * @property {Date} timestamp
 * @property {string|null} sourceIP
 * @property {string} action
 * @property {number|null} status
 * @property {string|null} user
 * @property {string} message
 * @property {boolean|null} isAuthSuccess
 *
 * @typedef {Object} Anomaly
 * @property {string} id
 * @property {AnomalyType} type
 * @property {AnomalySeverity} severity
 * @property {string} description
 * @property {string[]} affectedIPs
 * @property {string|null} affectedUser
 * @property {Date} firstSeen
 * @property {Date} lastSeen
 * @property {number} eventCount
 * @property {string[]} relatedEntryIds
 *
 * @typedef {Object} AnalysisResult
 * @property {string} sessionId
 * @property {LogType} logType
 * @property {string} parsedAt
 * @property {number} totalEntries
 * @property {number} parseErrors
 * @property {{from:string,to:string}|null} timeRange
 * @property {string[]} uniqueIPs
 * @property {Anomaly[]} anomalies
 * @property {LogEntry[]} entries
 */

export {};