'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';

const customer = {
  name: 'Varun Tharkanpet',
  type: 'individual',
  email: 'john.doe@example.com',
  phone: '9390661956',
  status: 'lead',
  location: 'Hyderabad, TS',
  joined: '2024-01-15',
};

export default function ManagerCustomerDetailPage() {
  const { customerId } = useParams();
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-text-primary">Customer Details</h1>
        <p className="text-text-secondary mt-1">View and manage customer interactions</p>
      </div>
      <Card className="p-6 flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-text-primary">{customer.name}</div>
            <div className="text-sm text-text-muted">{customer.type}</div>
            <div className="text-sm text-text-muted">{customer.email} | {customer.phone}</div>
            <div className="text-sm text-text-muted">{customer.location}</div>
            <div className="text-xs text-text-muted">Joined: {customer.joined}</div>
          </div>
          <Badge variant="outline" className="capitalize text-xs h-fit">{customer.status}</Badge>
        </div>
      </Card>
      <Tabs defaultValue="interactions" className="w-full">
        <TabsList>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="interactions">
          <Card className="p-4">No recent interactions.</Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card className="p-4">No orders found.</Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card className="p-4">No notes yet.</Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card className="p-4">No activity yet.</Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';

const customer = {
  name: 'Varun Tharkanpet',
  type: 'individual',
  email: 'john.doe@example.com',
  phone: '9390661956',
  status: 'lead',
  location: 'Hyderabad, TS',
  joined: '2024-01-15',
};

export default function ManagerCustomerDetailPage() {
  const { customerId } = useParams();
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-text-primary">Customer Details</h1>
        <p className="text-text-secondary mt-1">View and manage customer interactions</p>
      </div>
      <Card className="p-6 flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-text-primary">{customer.name}</div>
            <div className="text-sm text-text-muted">{customer.type}</div>
            <div className="text-sm text-text-muted">{customer.email} | {customer.phone}</div>
            <div className="text-sm text-text-muted">{customer.location}</div>
            <div className="text-xs text-text-muted">Joined: {customer.joined}</div>
          </div>
          <Badge variant="outline" className="capitalize text-xs h-fit">{customer.status}</Badge>
        </div>
      </Card>
      <Tabs defaultValue="interactions" className="w-full">
        <TabsList>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="interactions">
          <Card className="p-4">No recent interactions.</Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card className="p-4">No orders found.</Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card className="p-4">No notes yet.</Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card className="p-4">No activity yet.</Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}