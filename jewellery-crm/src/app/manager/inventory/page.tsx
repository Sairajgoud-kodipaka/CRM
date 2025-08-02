'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: 'Total Items', value: 24 },
  { label: 'Low Stock', value: 3 },
  { label: 'Out of Stock', value: 1 },
  { label: 'Inventory Value', value: '₹2,50,000' },
];

const inventory = [
  { product: 'Gold Necklace', sku: 'SKU-001', stock: 10, status: 'in stock', updated: '7/30/2025' },
  { product: 'Diamond Ring', sku: 'SKU-002', stock: 2, status: 'low stock', updated: '7/29/2025' },
  { product: 'Silver Anklet', sku: 'SKU-003', stock: 0, status: 'out of stock', updated: '7/28/2025' },
  { product: 'Platinum Bracelet', sku: 'SKU-004', stock: 12, status: 'in stock', updated: '7/27/2025' },
];

export default function ManagerInventoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-text-primary">Inventory</h1>
        <p className="text-text-secondary mt-1">Track and manage your store's inventory</p>
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
          <Input placeholder="Search by product or SKU..." className="w-full md:w-80" />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in stock">In Stock</SelectItem>
              <SelectItem value="low stock">Low Stock</SelectItem>
              <SelectItem value="out of stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-white mt-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Product</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">SKU</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Stock</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={i} className="border-t border-border hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-text-primary">{item.product}</td>
                  <td className="px-4 py-2 text-text-primary">{item.sku}</td>
                  <td className="px-4 py-2 text-text-primary">{item.stock}</td>
                  <td className="px-4 py-2"><Badge variant="outline" className="capitalize text-xs">{item.status}</Badge></td>
                  <td className="px-4 py-2 text-text-secondary">{item.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
