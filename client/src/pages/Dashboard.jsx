import React from 'react';
import { useDashboardStore } from '../store/dashboardStore.jsx';
import SummaryCards from '../components/summary/SummaryCards.jsx';
import AnomalyPanel from '../components/anomalies/AnomalyPanel.jsx';
import EventsTimeline from '../components/charts/EventsTimeline.jsx';
import TopIPsChart from '../components/charts/TopIPsChart.jsx';
import StatusCodePie from '../components/charts/StatusCodePie.jsx';
import AuthTimeline from '../components/charts/AuthTimeline.jsx';
import LogTable from '../components/table/LogTable.jsx';
import ExportButtons from '../components/export/ExportButtons.jsx';

export default function Dashboard() {
  const result = useDashboardStore((s) => s.result);
  if (!result) return null;

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <SummaryCards />
      <AnomalyPanel />
      <ExportButtons />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EventsTimeline />
        <AuthTimeline />
        <TopIPsChart />
        <StatusCodePie />
      </div>

      <LogTable />
    </main>
  );
}