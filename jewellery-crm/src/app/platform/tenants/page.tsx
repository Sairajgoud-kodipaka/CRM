'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';
import { apiService } from '@/lib/api-service';
import { useAuth } from '@/hooks/useAuth';

interface Tenant {
  id: number;
  name: string;
  business_type: string;
  subscription_status: string;
  created_at: string;
  users: Array<{
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  }>;
}

export default function TenantsListPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token, isAuthenticated } = useAuth();

  const testAPI = async () => {
    try {
      console.log('Testing API endpoint...');
      console.log('Current auth state:', { user, token, isAuthenticated });
      
      // Test with authentication
      const response = await fetch('http://localhost:8000/api/tenants/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      const data = await response.json();
      console.log('Test API Response:', data);
      console.log('Test API Status:', response.status);
      console.log('Test API Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok && data) {
        console.log('Test API - Tenants found:', data.length);
        console.log('Test API - Tenants data:', data);
        setTenants(data);
        setError(null);
      } else {
        console.log('Test API failed:', data);
        setError(`Test API failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Test API error:', err);
      setError(`Test API error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching tenants...');
        console.log('Auth state before API call:', { user, token, isAuthenticated });
        
        const response = await apiService.getTenants();
        console.log('API Response:', response);
        console.log('Response success:', response.success);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));
        
        if (response.success && response.data) {
          const tenantsData = Array.isArray(response.data) ? response.data : [];
          console.log('Tenants data:', tenantsData);
          console.log('Tenants count:', tenantsData.length);
          setTenants(tenantsData);
        } else {
          console.log('API response failed:', response);
          console.log('Response message:', response.message);
          setError(`Failed to fetch tenants: ${response.message || 'Unknown error'}`);
          setTenants([]);
        }
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError(`Failed to load tenants data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [user, token, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-text-primary">All Businesses (Tenants)</h1>
          <Link href="/platform/tenants/new">
            <Button className="btn-primary">+ New Tenant</Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading tenants...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-text-primary">All Businesses (Tenants)</h1>
          <Link href="/platform/tenants/new">
            <Button className="btn-primary">+ New Tenant</Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error loading tenants</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-left">
              <p><strong>Debug Info:</strong></p>
              <p>• User: {user?.username || 'None'}</p>
              <p>• Role: {user?.role || 'None'}</p>
              <p>• Token: {token ? 'Present' : 'Missing'}</p>
              <p>• Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Retry
              </Button>
              <Button 
                onClick={testAPI} 
                variant="outline"
              >
                Test API
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tenantsArray = Array.isArray(tenants) ? tenants : [];
  console.log('Final tenants array:', tenantsArray);
  console.log('Final tenants count:', tenantsArray.length);

  if (tenantsArray.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-text-primary">All Businesses (Tenants)</h1>
          <Link href="/platform/tenants/new">
            <Button className="btn-primary">+ New Tenant</Button>
          </Link>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Tenants Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No tenant businesses are currently registered in the system. 
              You can create a new tenant to get started.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>Debug Info:</p>
              <p>• User: {user?.username || 'None'}</p>
              <p>• Role: {user?.role || 'None'}</p>
              <p>• Token: {token ? 'Present' : 'Missing'}</p>
              <p>• Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              <p>• Check browser console for API response details</p>
              <p>• Ensure you are logged in as platform admin</p>
              <p>• Verify backend server is running on port 8000</p>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <Link href="/platform/tenants/new">
                <Button className="btn-primary">
                  Create First Tenant
                </Button>
              </Link>
              <Button 
                onClick={testAPI} 
                variant="outline"
              >
                Test API
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold text-text-primary">All Businesses (Tenants)</h1>
        <Link href="/platform/tenants/new">
          <Button className="btn-primary">+ New Tenant</Button>
        </Link>
      </div>
      <Card className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Business Type</th>
              <th>Users</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tenantsArray.map((tenant) => (
              <tr key={tenant.id}>
                <td className="font-medium text-text-primary">{tenant.name}</td>
                <td>{tenant.business_type || 'Jewelry Business'}</td>
                <td>{tenant.users?.length || 0}</td>
                <td>
                  <Badge variant={tenant.subscription_status === 'active' ? 'default' : 'outline'}>
                    {tenant.subscription_status.charAt(0).toUpperCase() + tenant.subscription_status.slice(1)}
                  </Badge>
                </td>
                <td>{new Date(tenant.created_at).toLocaleDateString()}</td>
                <td>
                  <Link href={`/platform/tenants/${tenant.id}`} className="btn-tertiary">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

 