# SOC Log Analysis Dashboard

A security operations dashboard for analyzing Apache, SSH, and Windows Event logs with anomaly detection and visualizations.

## Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts (all client files use `.jsx`)
- **Backend:** Express (Node 22, plain JavaScript, `.js` files)
- **No database** — in-memory processing per session

## Features
- Upload Apache access logs, SSH auth.log, or Windows Event CSV exports
- Anomaly detection: brute force, 404 spikes, off-hours logins
- 4 interactive charts (event timeline, top IPs, status code distribution, auth timeline)
- Paginated raw log table with search
- Export results as CSV or JSON

## Project Structure
```
log-dashboard/
├── client/          # React + Vite frontend (port 5173)
├── server/          # Express backend (port 3001)
├── samples/         # Demo log files
└── PLAN.md
```

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:3001
```

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

Open http://localhost:5173 in your browser. Upload one of the files from `samples/` to see the dashboard in action.

## Anomaly Detection Rules

| Rule | Trigger | Severity |
|------|---------|----------|
| Brute Force | ≥5 failed auth from same IP within 10 min | High / Critical |
| 404 Spike | ≥10 HTTP 404s within 5 min | Medium / High |
| Off-hours Login | Successful login outside 06:00–22:00 | Medium / High |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/logs/upload` | Upload + analyze a log file |
| GET | `/api/export/csv?sessionId=&type=logs\|anomalies` | Download CSV |
| GET | `/api/export/json?sessionId=` | Download JSON |

## Sample Files

- `samples/apache_access.log` — triggers 404 spike + off-hours anomaly
- `samples/auth.log` — triggers SSH brute force + off-hours anomaly
- `samples/windows_events.csv` — triggers Windows brute force + off-hours anomaly