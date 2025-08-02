'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, MoreVertical } from 'lucide-react';

const stats = [
  { label: 'Total Orders', value: 12 },
  { label: 'Pending', value: 2 },
  { label: 'Completed', value: 8 },
  { label: 'Cancelled', value: 2 },
];

const orders = [
  { id: 'ORD-001', customer: 'Varun T.', status: 'completed', amount: '₹12,000', date: '7/30/2025' },
  { id: 'ORD-002', customer: 'Padma I.', status: 'pending', amount: '₹8,500', date: '7/29/2025' },
  { id: 'ORD-003', customer: 'Hanuman', status: 'cancelled', amount: '₹0', date: '7/28/2025' },
];

export default function ManagerOrdersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Orders</h1>
          <p className="text-text-secondary mt-1">View and manage all orders for your store</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="flex flex-col gap-1 p-5">
            <div className="text-xl font-bold text-text-primary">{s.value}</div>
            <div className="text-sm text-text-secondary font-medium">{s.label}</div>
          </Card>
        ))}
      </div>
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input placeholder="Search by order ID or customer..." className="w-full md:w-80" />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-white mt-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Order ID</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Customer</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Amount</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Date</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-border hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-text-primary">{o.id}</td>
                  <td className="px-4 py-2 text-text-primary">{o.customer}</td>
                  <td className="px-4 py-2"><Badge variant="outline" className="capitalize text-xs">{o.status}</Badge></td>
                  <td className="px-4 py-2 text-text-primary">{o.amount}</td>
                  <td className="px-4 py-2 text-text-secondary">{o.date}</td>
                  <td className="px-4 py-2"><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
