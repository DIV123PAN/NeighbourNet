import React, { useState, useEffect } from 'react';
import { BarChart, Users, MapPin, Clock, TrendingUp, Activity } from 'lucide-react';
import { ServiceRequest, User } from '../types';

interface DashboardProps {
  serviceRequests: ServiceRequest[];
  users: User[];
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  serviceRequests, 
  users, 
  currentUser 
}) => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    completedRequests: 0,
    averageResponseTime: 0,
    neighborhoodActivity: {} as Record<string, number>,
    categoryBreakdown: {} as Record<string, number>,
    urgencyDistribution: {} as Record<string, number>
  });

  useEffect(() => {
    calculateStats();
  }, [serviceRequests, users]);

  const calculateStats = () => {
    const totalRequests = serviceRequests.length;
    const openRequests = serviceRequests.filter(r => r.status === 'open').length;
    const completedRequests = serviceRequests.filter(r => r.status === 'completed').length;
    
    // Calculate neighborhood activity
    const neighborhoodActivity: Record<string, number> = {};
    serviceRequests.forEach(request => {
      const neighborhood = request.location.neighborhood;
      neighborhoodActivity[neighborhood] = (neighborhoodActivity[neighborhood] || 0) + 1;
    });

    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {};
    serviceRequests.forEach(request => {
      const category = request.category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    // Calculate urgency distribution
    const urgencyDistribution: Record<string, number> = {};
    serviceRequests.forEach(request => {
      const urgency = request.urgency;
      urgencyDistribution[urgency] = (urgencyDistribution[urgency] || 0) + 1;
    });

    setStats({
      totalRequests,
      openRequests,
      completedRequests,
      averageResponseTime: 24, // Mock data
      neighborhoodActivity,
      categoryBreakdown,
      urgencyDistribution
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, data, color }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 capitalize">{key}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${((value as number) / Math.max(...Object.values(data))) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-600">
          Welcome back, {currentUser.name}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={BarChart}
          color="text-blue-600"
          subtitle="All time"
        />
        <StatCard
          title="Open Requests"
          value={stats.openRequests}
          icon={Activity}
          color="text-green-600"
          subtitle="Currently active"
        />
        <StatCard
          title="Completed"
          value={stats.completedRequests}
          icon={TrendingUp}
          color="text-purple-600"
          subtitle="Successfully finished"
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.averageResponseTime}h`}
          icon={Clock}
          color="text-orange-600"
          subtitle="Community average"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Neighborhood Activity"
          data={stats.neighborhoodActivity}
          color="bg-blue-500"
        />
        <ChartCard
          title="Service Categories"
          data={stats.categoryBreakdown}
          color="bg-green-500"
        />
        <ChartCard
          title="Urgency Levels"
          data={stats.urgencyDistribution}
          color="bg-red-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {serviceRequests.slice(0, 5).map(request => (
            <div key={request.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.title}</p>
                  <p className="text-xs text-gray-500">{request.location.neighborhood}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'open' ? 'bg-green-100 text-green-800' :
                  request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;