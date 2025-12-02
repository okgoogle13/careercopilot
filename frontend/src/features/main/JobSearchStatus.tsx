/**
 * ELECTRIC ALCHEMIST: JOB SEARCH STATUS COMPONENT
 *
 * Job search dashboard with statistics using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import {
  Clock,
  Calendar,
  Award,
  Target,
  Send,
  Eye,
} from 'lucide-react';
import { Grid, Card, Badge } from '@/components/ui';

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
    profileViews: 145,
  },
  trends = {
    applicationsTrend: { value: 15, isPositive: true },
    interviewsTrend: { value: 50, isPositive: true },
    offersTrend: { value: 100, isPositive: true },
  },
}: JobSearchStatusProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-hero text-2xl font-bold mb-2">Job Search Dashboard</h1>
        <p className="text-human text-base text-on-surface-variant">
          Track your progress and monitor your job search performance
        </p>
      </div>

      <Grid cols={3} gap="md">
        {/* Applications Sent */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-primary-container/20">
              <Send className="h-5 w-5 text-primary" />
            </div>
            {trends.applicationsTrend && (
              <Badge
                variant={trends.applicationsTrend.isPositive ? 'default' : 'outline'}
                className="text-xs"
              >
                {trends.applicationsTrend.isPositive ? '+' : '-'}
                {trends.applicationsTrend.value}%
              </Badge>
            )}
          </div>
          <h3 className="text-hero text-3xl font-bold mb-1">{stats.applicationsSent}</h3>
          <p className="text-data text-xs text-on-surface-variant mb-1">
            Applications Sent
          </p>
          <p className="text-data text-xs text-on-surface-variant">This month</p>
        </Card>

        {/* Interviews */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-tertiary-container/20">
              <Calendar className="h-5 w-5 text-tertiary" />
            </div>
            {trends.interviewsTrend && (
              <Badge
                variant={trends.interviewsTrend.isPositive ? 'default' : 'outline'}
                className="text-xs"
              >
                {trends.interviewsTrend.isPositive ? '+' : '-'}
                {trends.interviewsTrend.value}%
              </Badge>
            )}
          </div>
          <h3 className="text-hero text-3xl font-bold mb-1">{stats.interviews}</h3>
          <p className="text-data text-xs text-on-surface-variant mb-1">Interviews</p>
          <p className="text-data text-xs text-on-surface-variant">
            Scheduled & completed
          </p>
        </Card>

        {/* Offers */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-secondary-container/20">
              <Award className="h-5 w-5 text-secondary" />
            </div>
            {trends.offersTrend && (
              <Badge
                variant={trends.offersTrend.isPositive ? 'default' : 'outline'}
                className="text-xs"
              >
                {trends.offersTrend.isPositive ? '+' : '-'}
                {trends.offersTrend.value}%
              </Badge>
            )}
          </div>
          <h3 className="text-hero text-3xl font-bold mb-1">{stats.offers}</h3>
          <p className="text-data text-xs text-on-surface-variant mb-1">
            Offers Received
          </p>
          <p className="text-data text-xs text-on-surface-variant">Active offers</p>
        </Card>

        {/* Response Rate */}
        <Card variant="default" className="p-6">
          <div className="p-2 rounded-lg bg-primary-container/20 mb-4 w-fit">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-hero text-3xl font-bold mb-1">{stats.responseRate}%</h3>
          <p className="text-data text-xs text-on-surface-variant mb-1">
            Response Rate
          </p>
          <p className="text-data text-xs text-on-surface-variant">
            Interview invitations
          </p>
        </Card>

        {/* Average Response Time */}
        <Card variant="default" className="p-6">
          <div className="p-2 rounded-lg bg-secondary-container/20 mb-4 w-fit">
            <Clock className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="text-hero text-3xl font-bold mb-1">
            {stats.avgResponseTime} days
          </h3>
          <p className="text-data text-xs text-on-surface-variant mb-1">
            Avg Response Time
          </p>
          <p className="text-data text-xs text-on-surface-variant">From application</p>
        </Card>

        {/* Profile Views */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-surface-container-high">
              <Eye className="h-5 w-5 text-on-surface-variant" />
            </div>
            <Badge variant="default" className="text-xs">
              +12%
            </Badge>
          </div>
          <h3 className="text-hero text-3xl font-bold mb-1">
            {stats.profileViews || 0}
          </h3>
          <p className="text-data text-xs text-on-surface-variant mb-1">
            Profile Views
          </p>
          <p className="text-data text-xs text-on-surface-variant">Last 30 days</p>
        </Card>
      </Grid>
    </div>
  );
}

export default JobSearchStatus;

