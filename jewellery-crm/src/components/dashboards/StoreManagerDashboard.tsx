/**
 * Store Manager Dashboard Component
 * 
 * Store-specific overview for jewellery store managers.
 * Features store analytics, team performance, local operations, and customer management.
 * 
 * Key Features:
 * - Store-specific revenue and sales metrics
 * - Sales team performance tracking
 * - Local customer management
 * - Appointment scheduling overview
 * - Store inventory management
 * - Daily operations tracking
 */

'use client';

import React from 'react';
import { 
  DashboardLayout, 
  CardContainer,
} from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Store,
  Users, 
  ShoppingBag,
  Calendar,
  Package,
  Target,
  TrendingUp,
  Clock,
  Plus,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Award,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

/**
 * Mock data for store metrics
 */
const storeMetrics = {
  store: {
    name: 'Mumbai Central Store',
    revenue: {
      today: 45000,
      thisMonth: 985000,
      target: 1000000,
      growth: 18.2,
    },
    customers: {
      total: 456,
      newToday: 3,
      appointments: 8,
    },
    team: {
      total: 8,
      present: 7,
      topPerformer: 'Anjali Gupta',
    },
    inventory: {
      totalProducts: 245,
      lowStock: 5,
      newArrivals: 12,
    },
  },
};

/**
 * Sales team performance data
 */
const teamPerformance = [
  {
    id: 1,
    name: 'Anjali Gupta',
    role: 'Senior Sales Executive',
    sales: 285000,
    customers: 42,
    target: 300000,
    avatar: null,
    status: 'present',
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    role: 'Sales Executive',
    sales: 195000,
    customers: 28,
    target: 200000,
    avatar: null,
    status: 'present',
  },
  {
    id: 3,
    name: 'Priya Singh',
    role: 'Sales Executive',
    sales: 175000,
    customers: 31,
    target: 180000,
    avatar: null,
    status: 'present',
  },
  {
    id: 4,
    name: 'Vikram Sharma',
    role: 'Junior Sales Executive',
    sales: 125000,
    customers: 19,
    target: 150000,
    avatar: null,
    status: 'absent',
  },
];

/**
 * Today's appointments
 */
const todaysAppointments = [
  {
    id: 1,
    customer: 'Mrs. Sunita Agarwal',
    time: '10:00 AM',
    type: 'Wedding Consultation',
    assignedTo: 'Anjali Gupta',
    status: 'confirmed',
  },
  {
    id: 2,
    customer: 'Mr. Rajesh Kumar',
    time: '11:30 AM',
    type: 'Ring Resizing',
    assignedTo: 'Rahul Mehta',
    status: 'completed',
  },
  {
    id: 3,
    customer: 'Ms. Kavya Nair',
    time: '2:00 PM',
    type: 'Earring Selection',
    assignedTo: 'Priya Singh',
    status: 'confirmed',
  },
  {
    id: 4,
    customer: 'Mrs. Deepika Shah',
    time: '4:30 PM',
    type: 'Custom Design',
    assignedTo: 'Anjali Gupta',
    status: 'pending',
  },
];

/**
 * Recent store activities
 */
const storeActivities = [
  {
    id: 1,
    type: 'sale',
    description: 'Gold necklace set sold to Mrs. Sharma',
    amount: 85000,
    employee: 'Anjali Gupta',
    time: '1 hour ago',
  },
  {
    id: 2,
    type: 'customer',
    description: 'New customer registration completed',
    customer: 'Mr. Arjun Patel',
    employee: 'Priya Singh',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'inventory',
    description: 'Diamond rings restocked',
    quantity: 15,
    employee: 'Store Manager',
    time: '3 hours ago',
  },
];

/**
 * Store Manager Dashboard Component
 */
export function StoreManagerDashboard() {
  return (
    <DashboardLayout
      title="Store Dashboard"
      subtitle={`${storeMetrics.store.name} - Daily operations and team performance`}
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      }
    >
      {/* Store Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Sales */}
        <CardContainer className="border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
              <p className="text-3xl font-bold text-foreground flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {(storeMetrics.store.revenue.today / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
                Target: ₹50K
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </CardContainer>

        {/* Monthly Revenue */}
        <CardContainer className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
              <p className="text-3xl font-bold text-foreground flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {(storeMetrics.store.revenue.thisMonth / 100000).toFixed(1)}L
              </p>
              <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +{storeMetrics.store.revenue.growth}% growth
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContainer>

        {/* Store Customers */}
        <CardContainer className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Store Customers</p>
              <p className="text-3xl font-bold text-foreground">{storeMetrics.store.customers.total}</p>
              <p className="text-sm text-green-600 font-medium mt-1">
                +{storeMetrics.store.customers.newToday} new today
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContainer>

        {/* Team Present */}
        <CardContainer className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Present</p>
              <p className="text-3xl font-bold text-foreground">
                {storeMetrics.store.team.present}/{storeMetrics.store.team.total}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {storeMetrics.store.customers.appointments} appointments today
              </p>
            </div>
            <Store className="h-8 w-8 text-purple-500" />
          </div>
        </CardContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Team Performance */}
        <CardContainer>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Team Performance</h3>
              <p className="text-sm text-muted-foreground">Monthly sales progress by team member</p>
            </div>
            <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
          
          <div className="space-y-4">
            {teamPerformance.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {(member.sales / 100000).toFixed(1)}L
                    </p>
                    <Badge variant={member.status === 'present' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Progress</span>
                    <span className="font-medium">{((member.sales / member.target) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(member.sales / member.target) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">{member.customers} customers this month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContainer>

        {/* Today's Appointments */}
        <CardContainer>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Today's Appointments</h3>
              <p className="text-sm text-muted-foreground">{todaysAppointments.length} appointments scheduled</p>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </div>

          <div className="space-y-4">
            {todaysAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{appointment.customer}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    <p className="text-xs text-muted-foreground">Assigned to: {appointment.assignedTo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{appointment.time}</p>
                  <Badge 
                    variant={
                      appointment.status === 'completed' ? 'default' :
                      appointment.status === 'confirmed' ? 'secondary' : 'outline'
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContainer>
      </div>

      {/* Store Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Monthly Target Progress */}
        <CardContainer>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Monthly Target</h3>
              <p className="text-sm text-muted-foreground">Revenue goal progress</p>
            </div>
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {((storeMetrics.store.revenue.thisMonth / storeMetrics.store.revenue.target) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">of monthly target</p>
            </div>
            <Progress 
              value={(storeMetrics.store.revenue.thisMonth / storeMetrics.store.revenue.target) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{(storeMetrics.store.revenue.thisMonth / 100000).toFixed(1)}L</span>
              <span>₹{(storeMetrics.store.revenue.target / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </CardContainer>

        {/* Inventory Status */}
        <CardContainer>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Inventory Status</h3>
              <p className="text-sm text-muted-foreground">Store stock overview</p>
            </div>
            <Package className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Products</span>
              <span className="font-semibold">{storeMetrics.store.inventory.totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">New Arrivals</span>
              <Badge variant="secondary">{storeMetrics.store.inventory.newArrivals}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Low Stock</span>
              <Badge variant="destructive">{storeMetrics.store.inventory.lowStock}</Badge>
            </div>
          </div>
        </CardContainer>

        {/* Recent Activity */}
        <CardContainer>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest store updates</p>
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-3">
            {storeActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContainer>
      </div>

      {/* Quick Actions */}
      <CardContainer>
        <h3 className="text-xl font-semibold text-foreground mb-6">Quick Store Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <UserPlus className="w-5 h-5" />
            <span className="text-xs">Add Customer</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Book Appointment</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Package className="w-5 h-5" />
            <span className="text-xs">Check Inventory</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Users className="w-5 h-5" />
            <span className="text-xs">Team Reports</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Sales Analytics</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">Process Order</span>
          </Button>
        </div>
      </CardContainer>
    </DashboardLayout>
  );
}