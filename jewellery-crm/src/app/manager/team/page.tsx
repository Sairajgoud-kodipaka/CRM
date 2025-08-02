'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { apiService, User } from '@/lib/api-service';

export default function ManagerTeamPage() {
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTeamMembers();
      if (response.success && response.data && Array.isArray(response.data)) {
        setTeam(response.data);
      } else {
        console.warn('Team members response is not an array:', response.data);
        setTeam([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = Array.isArray(team) ? team.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
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
          <Input 
            placeholder="Search by name or email..." 
            className="w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              {filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                    No team members found.
                  </td>
                </tr>
              ) : (
                filteredTeam.map((member, i) => (
                  <tr key={i} className="border-t border-border hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-text-primary">
                      {`${member.first_name} ${member.last_name}`}
                    </td>
                    <td className="px-4 py-2 text-text-primary">{member.role}</td>
                    <td className="px-4 py-2 text-text-primary">{member.email}</td>
                    <td className="px-4 py-2">
                      <Badge variant={member.is_active ? "default" : "secondary"} className="capitalize text-xs">
                        {member.is_active ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}