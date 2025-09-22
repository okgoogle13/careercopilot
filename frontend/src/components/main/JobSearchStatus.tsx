import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { StatCard } from '../ui/StatCard';
import { Send, Calendar, Award, Target, Clock, Eye } from 'lucide-react';

interface JobSearchStatusProps {
  stats?: {
    applicationsSent: number;
    interviews: number;
    offers: number;
    responseRate?: number;
    avgResponseTime?: number;
    profileViews?: number;
  };
  trends?: {
    applicationsTrend?: { value: number; isPositive: boolean };
    interviewsTrend?: { value: number; isPositive: boolean };
    offersTrend?: { value: number; isPositive: boolean };
  };
}

export function JobSearchStatus({
  stats = {
    applicationsSent: 24,
    interviews: 6,
    offers: 2,
    responseRate: 25,
    avgResponseTime: 5,
    profileViews: 145
  },
  trends = {
    applicationsTrend: { value: 15, isPositive: true },
    interviewsTrend: { value: 50, isPositive: true },
    offersTrend: { value: 100, isPositive: true }
  }
}: JobSearchStatusProps) {
  return (
    <Box className="w-full">
      <Box className="mb-6">
        <Typography variant="h4" className="text-2xl font-bold mb-2">
          Job Search Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your progress and monitor your job search performance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Applications Sent */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Applications Sent"
            value={stats.applicationsSent}
            subtitle="This month"
            icon={<Send size={20} className="text-blue-600" />}
            trend={trends.applicationsTrend}
            variant="primary"
          />
        </Grid>

        {/* Interviews */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Interviews"
            value={stats.interviews}
            subtitle="Scheduled & completed"
            icon={<Calendar size={20} className="text-green-600" />}
            trend={trends.interviewsTrend}
            variant="success"
          />
        </Grid>

        {/* Offers */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Offers Received"
            value={stats.offers}
            subtitle="Active offers"
            icon={<Award size={20} className="text-orange-600" />}
            trend={trends.offersTrend}
            variant="warning"
          />
        </Grid>

        {/* Response Rate */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Response Rate"
            value={`${stats.responseRate}%`}
            subtitle="Interview invitations"
            icon={<Target size={20} className="text-purple-600" />}
          />
        </Grid>

        {/* Average Response Time */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Avg Response Time"
            value={`${stats.avgResponseTime} days`}
            subtitle="From application"
            icon={<Clock size={20} className="text-indigo-600" />}
          />
        </Grid>

        {/* Profile Views */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Profile Views"
            value={stats.profileViews}
            subtitle="Last 30 days"
            icon={<Eye size={20} className="text-gray-600" />}
            trend={{ value: 12, isPositive: true, label: 'vs last month' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}