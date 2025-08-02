'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart2, PieChart, TrendingUp, Users, Percent } from 'lucide-react';

const stats = [
  { label: 'Revenue', value: '₹1,20,000', icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
  { label: 'Orders', value: 60, icon: <BarChart2 className="w-6 h-6 text-blue-600" /> },
  { label: 'Customers', value: 40, icon: <Users className="w-6 h-6 text-purple-600" /> },
  { label: 'Conversion Rate', value: '10.2%', icon: <Percent className="w-6 h-6 text-orange-600" /> },
];

const recentActivity = [
  { label: 'New order placed', date: '7/30/2025' },
  { label: 'Customer registered', date: '7/29/2025' },
  { label: 'Revenue milestone reached', date: '7/28/2025' },
  { label: 'Top product updated', date: '7/27/2025' },
];

export default function ManagerAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
        <p className="text-text-secondary mt-1">Track your store's performance and key metrics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="flex flex-row items-center gap-4 p-5">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mr-2">{s.icon}</div>
            <div>
              <div className="text-xl font-bold text-text-primary">{s.value}</div>
              <div className="text-sm text-text-secondary font-medium">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-2 p-6 items-center justify-center min-h-[220px]">
          <BarChart2 className="w-12 h-12 text-blue-400 mb-2" />
          <div className="font-semibold text-text-primary">Sales Over Time</div>
          <div className="text-xs text-text-muted">(Chart Placeholder)</div>
        </Card>
        <Card className="flex flex-col gap-2 p-6 items-center justify-center min-h-[220px]">
          <PieChart className="w-12 h-12 text-purple-400 mb-2" />
          <div className="font-semibold text-text-primary">Top Products</div>
          <div className="text-xs text-text-muted">(Chart Placeholder)</div>
        </Card>
      </div>
      <Card className="p-6">
        <div className="font-semibold text-text-primary mb-2">Recent Activity</div>
        <ul className="divide-y divide-border">
          {recentActivity.map((a, i) => (
            <li key={i} className="py-2 flex items-center justify-between">
              <span className="text-text-secondary">{a.label}</span>
              <span className="text-xs text-text-muted">{a.date}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
