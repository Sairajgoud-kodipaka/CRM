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
 * Store metrics interface
 */
interface StoreMetrics {
  store: {
    name: string;
    revenue: {
      today: number;
      thisMonth: number;
      target: number;
      growth: number;
    };
    customers: {
      total: number;
      newToday: number;
      appointments: number;
    };
    team: {
      total: number;
      present: number;
      topPerformer: string;
    };
    inventory: {
      totalProducts: number;
      lowStock: number;
      newArrivals: number;
    };
  };
}

/**
 * Team member interface
 */
interface TeamMember {
  id: number;
  name: string;
  role: string;
  sales: number;
  customers: number;
  target: number;
  avatar: string | null;
  status: 'present' | 'absent';
}

/**
 * Appointment interface
 */
interface Appointment {
  id: number;
  customer: string;
  time: string;
  type: string;
  assignedTo: string;
  status: 'confirmed' | 'completed' | 'pending' | 'cancelled';
}

/**
 * Store activity interface
 */
interface StoreActivity {
  id: number;
  type: 'sale' | 'customer' | 'inventory';
  description: string;
  amount?: number;
  customer?: string;
  quantity?: number;
  employee: string;
  time: string;
}

/**
 * Store Manager Dashboard Component
 */
export function StoreManagerDashboard() {
  const [storeMetrics, setStoreMetrics] = React.useState<StoreMetrics>({
    store: {
      name: 'Loading...',
      revenue: { today: 0, thisMonth: 0, target: 1000000, growth: 0 },
      customers: { total: 0, newToday: 0, appointments: 0 },
      team: { total: 0, present: 0, topPerformer: '' },
      inventory: { totalProducts: 0, lowStock: 0, newArrivals: 0 },
    },
  });
  const [teamPerformance, setTeamPerformance] = React.useState<TeamMember[]>([]);
  const [todaysAppointments, setTodaysAppointments] = React.useState<Appointment[]>([]);
  const [storeActivities, setStoreActivities] = React.useState<StoreActivity[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/manager/dashboard-stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStoreMetrics(statsData);
      }

      // Fetch team performance
      const teamResponse = await fetch('/api/manager/team-performance');
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamPerformance(teamData);
      }

      // Fetch today's appointments
      const appointmentsResponse = await fetch('/api/manager/today-appointments');
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setTodaysAppointments(appointmentsData);
      }

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/manager/recent-activities');
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setStoreActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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