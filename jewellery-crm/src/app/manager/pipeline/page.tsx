'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Total Pipeline Value', value: '₹0.00', sub: '0 active deals' },
  { label: 'Active Deals', value: '0', sub: 'Total active pipelines' },
  { label: 'Conversion Rate', value: '0.0%', sub: 'Win rate' },
  { label: 'Avg Deal Size', value: '₹0.00', sub: 'Average deal value' },
];

const stages = [
  { label: 'Lead', value: '₹0.00', count: 0 },
  { label: 'Contacted', value: '₹0.00', count: 0 },
  { label: 'Qualified', value: '₹0.00', count: 0 },
  { label: 'Proposal', value: '₹0.00', count: 0 },
  { label: 'Negotiation', value: '₹0.00', count: 0 },
  { label: 'Closed Won', value: '₹0.00', count: 0 },
  { label: 'Closed Lost', value: '₹0.00', count: 0 },
];

export default function ManagerPipelinePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Sales Pipeline</h1>
          <p className="text-text-secondary mt-1">Manage your sales pipeline and track deal progress.</p>
        </div>
        <Button className="btn-primary">+ Create Pipeline</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="flex flex-col gap-1 p-5">
            <div className="text-xl font-bold text-text-primary">{s.value}</div>
            <div className="text-sm text-text-secondary font-medium">{s.label}</div>
            <div className="text-xs text-text-muted mt-1">{s.sub}</div>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-2 mt-4">Pipeline Stages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {stages.map((stage) => (
            <Card key={stage.label} className="flex flex-col gap-1 p-4 items-start">
              <div className="font-semibold text-text-primary">{stage.label}</div>
              <div className="text-lg font-bold text-text-primary">{stage.value}</div>
              <div className="text-xs text-text-muted">{stage.count} deals</div>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card className="p-6">
          <h3 className="text-base font-semibold mb-2 text-text-primary">Recent Pipelines</h3>
          <div className="text-text-muted text-sm">No recent pipelines.</div>
        </Card>
        <Card className="p-6">
          <h3 className="text-base font-semibold mb-2 text-text-primary">Upcoming Actions</h3>
          <div className="text-text-muted text-sm">No upcoming actions.</div>
        </Card>
      </div>
    </div>
  );
}