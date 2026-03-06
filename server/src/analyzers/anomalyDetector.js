import { v4 as uuidv4 } from 'uuid';

const TEN_MIN = 10 * 60 * 1000;
const FIVE_MIN = 5 * 60 * 1000;

/**
 * @param {import('../types.js').LogEntry[]} entries
 * @returns {import('../types.js').Anomaly[]}
 */
export function detect(entries) {
  return [
    ...detectBruteForce(entries),
    ...detect404Spike(entries),
    ...detectOffHoursLogin(entries),
  ];
}

function detectBruteForce(entries) {
  const failed = entries
    .filter((e) => e.isAuthSuccess === false && e.sourceIP)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Group by sourceIP
  const byIP = new Map();
  for (const entry of failed) {
    if (!byIP.has(entry.sourceIP)) byIP.set(entry.sourceIP, []);
    byIP.get(entry.sourceIP).push(entry);
  }

  const anomalies = [];
  for (const [ip, events] of byIP) {
    let i = 0;
    while (i < events.length) {
      const window = [];
      const start = events[i].timestamp.getTime();
      let j = i;
      while (j < events.length && events[j].timestamp.getTime() - start <= TEN_MIN) {
        window.push(events[j]);
        j++;
      }
      if (window.length >= 5) {
        const count = window.length;
        anomalies.push({
          id: uuidv4(),
          type: 'brute_force',
          severity: count >= 20 ? 'critical' : 'high',
          description: `${count} failed auth attempts from ${ip} within 10 minutes`,
          affectedIPs: [ip],
          affectedUser: window[0].user,
          firstSeen: window[0].timestamp,
          lastSeen: window[window.length - 1].timestamp,
          eventCount: count,
          relatedEntryIds: window.map((e) => e.id),
        });
        i = j; // skip past this burst
      } else {
        i++;
      }
    }
  }
  return anomalies;
}

function detect404Spike(entries) {
  const notFound = entries
    .filter((e) => e.status === 404)
    .sort((a, b) => a.timestamp - b.timestamp);

  const anomalies = [];
  let i = 0;
  while (i < notFound.length) {
    const window = [];
    const start = notFound[i].timestamp.getTime();
    let j = i;
    while (j < notFound.length && notFound[j].timestamp.getTime() - start <= FIVE_MIN) {
      window.push(notFound[j]);
      j++;
    }
    if (window.length >= 10) {
      const count = window.length;
      const uniqueIPs = [...new Set(window.map((e) => e.sourceIP).filter(Boolean))];
      anomalies.push({
        id: uuidv4(),
        type: '404_spike',
        severity: count >= 50 ? 'critical' : count >= 20 ? 'high' : 'medium',
        description: `${count} HTTP 404 responses within 5 minutes`,
        affectedIPs: uniqueIPs,
        affectedUser: null,
        firstSeen: window[0].timestamp,
        lastSeen: window[window.length - 1].timestamp,
        eventCount: count,
        relatedEntryIds: window.map((e) => e.id),
      });
      i = j;
    } else {
      i++;
    }
  }
  return anomalies;
}

function detectOffHoursLogin(entries) {
  const offHours = entries
    .filter((e) => {
      if (e.isAuthSuccess !== true) return false;
      const hour = new Date(e.timestamp).getHours();
      return hour < 6 || hour >= 22;
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  if (offHours.length === 0) return [];

  // Group consecutive events within 30 min into one anomaly
  const groups = [];
  let group = [offHours[0]];
  for (let i = 1; i < offHours.length; i++) {
    const gap = offHours[i].timestamp - offHours[i - 1].timestamp;
    if (gap <= 30 * 60 * 1000) {
      group.push(offHours[i]);
    } else {
      groups.push(group);
      group = [offHours[i]];
    }
  }
  groups.push(group);

  return groups.map((grp) => {
    const hour = new Date(grp[0].timestamp).getHours();
    const uniqueIPs = [...new Set(grp.map((e) => e.sourceIP).filter(Boolean))];
    return {
      id: uuidv4(),
      type: 'off_hours_login',
      severity: hour < 6 && hour >= 0 ? 'high' : 'medium',
      description: `Successful login outside business hours (${grp[0].timestamp.toLocaleTimeString()}) by ${grp[0].user}`,
      affectedIPs: uniqueIPs,
      affectedUser: grp[0].user,
      firstSeen: grp[0].timestamp,
      lastSeen: grp[grp.length - 1].timestamp,
      eventCount: grp.length,
      relatedEntryIds: grp.map((e) => e.id),
    };
  });
}