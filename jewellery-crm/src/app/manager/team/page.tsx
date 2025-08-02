'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

const team = [
  { name: 'Varun T.', role: 'Sales', email: 'varun@example.com', status: 'active' },
  { name: 'Padma I.', role: 'Support', email: 'padma@example.com', status: 'active' },
  { name: 'Hanuman', role: 'Sales', email: 'hanuman@example.com', status: 'inactive' },
];

export default function ManagerTeamPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Team</h1>
          <p className="text-text-secondary mt-1">View and manage your team members</p>
        </div>
        <Button className="btn-primary text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Invite Member</Button>
      </div>
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input placeholder="Search by name or email..." className="w-full md:w-80" />
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-white mt-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Name</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Role</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Email</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => (
                <tr key={i} className="border-t border-border hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-text-primary">{member.name}</td>
                  <td className="px-4 py-2 text-text-primary">{member.role}</td>
                  <td className="px-4 py-2 text-text-primary">{member.email}</td>
                  <td className="px-4 py-2"><Badge variant="outline" className="capitalize text-xs">{member.status}</Badge></td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}