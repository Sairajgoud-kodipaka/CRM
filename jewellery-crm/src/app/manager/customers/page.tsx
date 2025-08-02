'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';
import { useState } from 'react';

const customers = [
  { name: 'varun tharkanpet', type: 'individual', email: 'john.doe@example.com', phone: '9390661956', status: 'lead', location: 'hyd, ts', created: '7/30/2025' },
  { name: 'padma indi', type: 'individual', email: 'padma@gmail.com', phone: '6301692936', status: 'lead', location: 'hyderabad, telangana', created: '7/30/2025' },
  { name: 'hanuman', type: 'individual', email: 'hanuman@gmail.com', phone: '1080108108', status: 'lead', location: 'HAMPI, KA', created: '7/30/2025' },
];

export default function ManagerCustomersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      <AddCustomerModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Customers</h1>
          <p className="text-text-secondary mt-1">View and segment your customer base</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button className="btn-primary" size="sm" onClick={() => setModalOpen(true)}>+ Add Customer</Button>
          <Button variant="outline" size="sm">Export CSV</Button>
          <Button variant="outline" size="sm">Export JSON</Button>
        </div>
      </div>
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input placeholder="Search by name, email, or phone..." className="w-full md:w-80" />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-white mt-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Customer</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Contact</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Location</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-t border-border hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="font-medium text-text-primary">{c.name}</div>
                    <div className="text-xs text-text-muted">{c.type}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-text-primary">{c.email}</div>
                    <div className="text-xs text-text-muted">{c.phone}</div>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="outline" className="text-xs capitalize">{c.status}</Badge>
                  </td>
                  <td className="px-4 py-2 text-text-primary">{c.location}</td>
                  <td className="px-4 py-2 text-text-secondary">{c.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}