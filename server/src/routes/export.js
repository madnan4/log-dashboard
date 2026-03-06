import express from 'express';
import { sessionStore } from '../store/sessionStore.js';
import { entriesToCSV, anomaliesToCSV } from '../exporters/csvExporter.js';

const router = express.Router();

router.get('/csv', (req, res) => {
  const { sessionId, type } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const result = sessionStore.get(sessionId);
  if (!result) return res.status(404).json({ error: 'Session not found or expired' });

  let csv;
  if (type === 'anomalies') {
    csv = anomaliesToCSV(result.anomalies);
  } else {
    csv = entriesToCSV(result.entries);
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${type ?? 'logs'}_${sessionId.slice(0, 8)}.csv"`);
  res.send(csv);
});

router.get('/json', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const result = sessionStore.get(sessionId);
  if (!result) return res.status(404).json({ error: 'Session not found or expired' });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="analysis_${sessionId.slice(0, 8)}.json"`);
  res.send(JSON.stringify(result, null, 2));
});

export default router;