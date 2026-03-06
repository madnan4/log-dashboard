import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parseLog } from '../parsers/index.js';
import { detect } from '../analyzers/anomalyDetector.js';
import { sessionStore } from '../store/sessionStore.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), (req, res) => {
  const logType = req.body.logType;
  if (!logType || !['apache', 'ssh', 'windows'].includes(logType)) {
    return res.status(400).json({ error: 'logType must be apache, ssh, or windows' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const content = req.file.buffer.toString('utf-8');
  let parsed;
  try {
    parsed = parseLog(content, logType);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }

  const { entries, parseErrors } = parsed;
  if (entries.length === 0) {
    return res.status(422).json({ error: 'No valid log entries could be parsed from this file' });
  }

  const anomalies = detect(entries);

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const uniqueIPs = [...new Set(entries.map((e) => e.sourceIP).filter(Boolean))];
  const timeRange = sorted.length > 0
    ? { from: sorted[0].timestamp.toISOString(), to: sorted[sorted.length - 1].timestamp.toISOString() }
    : null;

  const sessionId = uuidv4();
  /** @type {import('../types.js').AnalysisResult} */
  const result = {
    sessionId,
    logType,
    parsedAt: new Date().toISOString(),
    totalEntries: entries.length,
    parseErrors,
    timeRange,
    uniqueIPs,
    anomalies,
    entries,
  };

  sessionStore.set(sessionId, result);
  res.json(result);
});

export default router;