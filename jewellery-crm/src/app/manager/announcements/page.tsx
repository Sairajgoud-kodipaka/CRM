'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Eye, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiService } from '@/lib/api-service';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  type: string;
  status: string;
  created_at: string;
  created_by: string;
  is_read: boolean;
  is_acknowledged: boolean;
}

export default function ManagerAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAnnouncements();
      if (response.success && response.data && Array.isArray(response.data)) {
        setAnnouncements(response.data);
      } else {
        console.warn('Announcements response is not an array:', response.data);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId: number) => {
    try {
      await apiService.markAnnouncementAsRead(announcementId);
      // Update local state
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === announcementId 
            ? { ...announcement, is_read: true }
            : announcement
        )
      );
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const acknowledgeAnnouncement = async (announcementId: number) => {
    try {
      await apiService.acknowledgeAnnouncement(announcementId);
      // Update local state
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === announcementId 
            ? { ...announcement, is_acknowledged: true }
            : announcement
        )
      );
    } catch (error) {
      console.error('Error acknowledging announcement:', error);
    }
  };

  const filteredAnnouncements = Array.isArray(announcements) ? announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || announcement.type === typeFilter;
    
    return matchesSearch && matchesPriority && matchesType;
  }) : [];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Announcements</h1>
          <p className="text-text-secondary mt-1">View and manage team announcements</p>
        </div>
        <Button className="btn-primary text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col gap-1 p-5">
          <div className="text-xl font-bold text-text-primary">{Array.isArray(announcements) ? announcements.length : 0}</div>
          <div className="text-sm text-text-secondary font-medium">Total Announcements</div>
        </Card>
        <Card className="flex flex-col gap-1 p-5">
          <div className="text-xl font-bold text-text-primary">
            {Array.isArray(announcements) ? announcements.filter(a => !a.is_read).length : 0}
          </div>
          <div className="text-sm text-text-secondary font-medium">Unread</div>
        </Card>
        <Card className="flex flex-col gap-1 p-5">
          <div className="text-xl font-bold text-text-primary">
            {Array.isArray(announcements) ? announcements.filter(a => a.priority === 'high').length : 0}
          </div>
          <div className="text-sm text-text-secondary font-medium">High Priority</div>
        </Card>
        <Card className="flex flex-col gap-1 p-5">
          <div className="text-xl font-bold text-text-primary">
            {Array.isArray(announcements) ? announcements.filter(a => !a.is_acknowledged).length : 0}
          </div>
          <div className="text-sm text-text-secondary font-medium">Pending Acknowledgment</div>
        </Card>
      </div>

      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input 
            placeholder="Search announcements..." 
            className="w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="update">Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              No announcements found.
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className={`p-4 ${!announcement.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(announcement.priority)}
                      <h3 className="font-semibold text-text-primary">{announcement.title}</h3>
                      <Badge variant={getPriorityBadgeVariant(announcement.priority)} className="text-xs">
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {announcement.type}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>By: {announcement.created_by}</span>
                      <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                      {!announcement.is_read && (
                        <Badge variant="secondary" className="text-xs">Unread</Badge>
                      )}
                      {!announcement.is_acknowledged && (
                        <Badge variant="outline" className="text-xs">Pending Acknowledgment</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!announcement.is_read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(announcement.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    {!announcement.is_acknowledged && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => acknowledgeAnnouncement(announcement.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
} 