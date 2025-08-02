'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Eye, Edit, Trash2, IndianRupee, AlertTriangle } from 'lucide-react';
import { apiService, Product } from '@/lib/api-service';

export default function ManagerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      if (response.success && response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.warn('Products response is not an array:', response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_name === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { status: 'out of stock', variant: 'destructive' as const };
    if (product.quantity <= product.min_quantity) return { status: 'low stock', variant: 'secondary' as const };
    return { status: 'in stock', variant: 'default' as const };
  };

  const getStockIcon = (product: Product) => {
    if (product.quantity === 0) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (product.quantity <= product.min_quantity) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <Package className="w-4 h-4 text-green-500" />;
  };

  const stats = [
    { 
      label: 'Total Products', 
      value: Array.isArray(products) ? products.length : 0,
      sub: 'All products in inventory'
    },
    { 
      label: 'Low Stock', 
      value: Array.isArray(products) ? products.filter(p => p.quantity > 0 && p.quantity <= p.min_quantity).length : 0,
      sub: 'Products below minimum stock'
    },
    { 
      label: 'Out of Stock', 
      value: Array.isArray(products) ? products.filter(p => p.quantity === 0).length : 0,
      sub: 'Products with zero stock'
    },
    { 
      label: 'Inventory Value', 
      value: `₹${(Array.isArray(products) ? (products.reduce((sum, p) => sum + (p.selling_price * p.quantity), 0) / 100000).toFixed(1) : '0.0')}L`,
      sub: 'Total inventory value'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
          <p className="text-text-secondary mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button className="btn-primary text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
          <Button variant="outline" size="sm">Import CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1 p-5">
            <div className="text-xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
            <div className="text-xs text-text-muted mt-1">{stat.sub}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input 
            placeholder="Search by name, SKU, or description..." 
            className="w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Gold">Gold</SelectItem>
                <SelectItem value="Diamond">Diamond</SelectItem>
                <SelectItem value="Silver">Silver</SelectItem>
                <SelectItem value="Platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-white mt-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Product</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">SKU</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Category</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Price</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Stock</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="border-t border-border hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div className="font-medium text-text-primary">{product.name}</div>
                        <div className="text-xs text-text-muted">{product.description}</div>
                      </td>
                      <td className="px-4 py-2 text-text-primary">{product.sku}</td>
                      <td className="px-4 py-2 text-text-primary">{product.category_name}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center text-text-primary">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {product.selling_price.toLocaleString()}
                        </div>
                        {product.discount_price && (
                          <div className="text-xs text-text-muted line-through">
                            ₹{product.discount_price.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {getStockIcon(product)}
                          <span className="text-text-primary">{product.quantity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={stockStatus.variant} className="capitalize text-xs">
                          {stockStatus.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 