import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Target, BarChart3, PieChart, Activity } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalLeads: number;
  conversionRate: number;
  averageDealSize: number;
  monthlyRevenue: number;
  qualifiedLeads: number;
  meetingsBooked: number;
  revenueGrowth: number;
}

interface LeadSource {
  source: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  leads: number;
  conversionRate: number;
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalLeads: 0,
    conversionRate: 0,
    averageDealSize: 0,
    monthlyRevenue: 0,
    qualifiedLeads: 0,
    meetingsBooked: 0,
    revenueGrowth: 0
  });

  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data - in production, this would come from your API
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockData: AnalyticsData = {
          totalRevenue: 125000,
          totalLeads: 45,
          conversionRate: 42.5,
          averageDealSize: 2778,
          monthlyRevenue: 18750,
          qualifiedLeads: 38,
          meetingsBooked: 19,
          revenueGrowth: 28.5
        };

        const mockLeadSources: LeadSource[] = [
          { source: 'Website Form', count: 25, revenue: 75000, percentage: 60 },
          { source: 'Social Media', count: 12, revenue: 35000, percentage: 28 },
          { source: 'Design Automation', count: 8, revenue: 15000, percentage: 12 }
        ];

        const mockMonthlyData: MonthlyData[] = [
          { month: 'Jan', revenue: 12000, leads: 15, conversionRate: 40 },
          { month: 'Feb', revenue: 15000, leads: 18, conversionRate: 44 },
          { month: 'Mar', revenue: 18750, leads: 45, conversionRate: 42.5 }
        ];

        setAnalyticsData(mockData);
        setLeadSources(mockLeadSources);
        setMonthlyData(mockMonthlyData);
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">9LMNTS Analytics Dashboard</h1>
          <p className="text-gray-400">Real-time revenue and lead performance metrics</p>
          
          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-[#FF7A00] text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {range === '7d' && '7 Days'}
                {range === '30d' && '30 Days'}
                {range === '90d' && '90 Days'}
                {range === '1y' && '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-[#FF7A00]" />
              <span className="text-green-400 text-sm font-bold">+{analyticsData.revenueGrowth}%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalRevenue)}</p>
          </div>

          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-[#FF7A00]" />
              <span className="text-green-400 text-sm font-bold">+12%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Leads</h3>
            <p className="text-2xl font-bold text-white">{analyticsData.totalLeads}</p>
          </div>

          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-[#FF7A00]" />
              <span className="text-green-400 text-sm font-bold">+5.2%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Conversion Rate</h3>
            <p className="text-2xl font-bold text-white">{formatPercentage(analyticsData.conversionRate)}</p>
          </div>

          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-[#FF7A00]" />
              <span className="text-green-400 text-sm font-bold">+8.7%</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Avg Deal Size</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.averageDealSize)}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#FF7A00] rounded-t"
                    style={{ 
                      height: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%`,
                      minHeight: '20px'
                    }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Lead Sources</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {leadSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: index === 0 ? '#FF7A00' : index === 1 ? '#2196F3' : '#4CAF50'
                      }}
                    />
                    <span className="text-white text-sm">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{source.count}</p>
                    <p className="text-gray-400 text-xs">{formatPercentage(source.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-[#FF7A00]" />
              <h3 className="text-lg font-bold text-white">Meetings Booked</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{analyticsData.meetingsBooked}</p>
            <p className="text-gray-400 text-sm">This month</p>
          </div>

          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#FF7A00]" />
              <h3 className="text-lg font-bold text-white">Qualified Leads</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{analyticsData.qualifiedLeads}</p>
            <p className="text-gray-400 text-sm">{formatPercentage((analyticsData.qualifiedLeads / analyticsData.totalLeads) * 100)} qualification rate</p>
          </div>

          <div className="bg-[#222222] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-[#FF7A00]" />
              <h3 className="text-lg font-bold text-white">Monthly Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{formatCurrency(analyticsData.monthlyRevenue)}</p>
            <p className="text-green-400 text-sm">On track for {formatCurrency(analyticsData.monthlyRevenue * 12)}</p>
          </div>
        </div>

        {/* Revenue Projection */}
        <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF5500] border border-white/10 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Revenue Projection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/80 text-sm mb-1">Current Monthly</p>
              <p className="text-2xl font-bold">{formatCurrency(analyticsData.monthlyRevenue)}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">With Optimization</p>
              <p className="text-2xl font-bold">{formatCurrency(analyticsData.monthlyRevenue * 2.5)}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Annual Potential</p>
              <p className="text-2xl font-bold">{formatCurrency(analyticsData.monthlyRevenue * 12)}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              🚀 With current optimizations, you're on track to 2.5x your revenue within 30 days!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
