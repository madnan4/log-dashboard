import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload.js';
import exportRouter from './routes/export.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/api/logs/upload', uploadRouter);
app.use('/api/export', exportRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});