import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { 
  FileText, 
  Briefcase, 
  Star, 
  Edit, 
  Upload, 
  Download, 
  Eye, 
  Settings, 
  User, 
  Clock, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  RefreshCw,
  Filter,
  MoreVertical
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'document_created' | 'document_updated' | 'job_saved' | 'application_submitted' | 'profile_updated' | 'resume_downloaded' | 'ats_score_updated' | 'interview_scheduled' | 'system_update';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  metadata?: {
    documentName?: string;
    jobTitle?: string;
    companyName?: string;
    score?: number;
    oldScore?: number;
    fileName?: string;
    interviewDate?: string;
  };
  priority: 'low' | 'medium' | 'high';
  isUnread?: boolean;
}

const mockActivityItems: ActivityItem[] = [
  {
    id: '1',
    type: 'ats_score_updated',
    title: 'ATS Score Improved',
    description: 'Your resume score increased after recent updates',
    timestamp: '2024-01-25T10:30:00Z',
    icon: TrendingUp,
    iconColor: 'text-brand-tertiary',
    metadata: {
      score: 87,
      oldScore: 82,
      documentName: 'Resume_v4.pdf'
    },
    priority: 'high',
    isUnread: true
  },
  {
    id: '2',
    type: 'document_created',
    title: 'New Resume Created',
    description: 'You created a new resume using the Modern Minimal template',
    timestamp: '2024-01-25T09:15:00Z',
    icon: FileText,
    iconColor: 'text-brand-primary',
    metadata: {
      documentName: 'Senior_Developer_Resume.pdf'
    },
    priority: 'medium'
  },
  {
    id: '3',
    type: 'job_saved',
    title: 'Job Saved',
    description: 'You saved a new job opportunity to your watchlist',
    timestamp: '2024-01-24T16:45:00Z',
    icon: Star,
    iconColor: 'text-brand-secondary',
    metadata: {
      jobTitle: 'Senior Frontend Developer',
      companyName: 'TechCorp'
    },
    priority: 'low'
  },
  {
    id: '4',
    type: 'application_submitted',
    title: 'Application Submitted',
    description: 'Successfully applied to StartupXYZ via LinkedIn',
    timestamp: '2024-01-24T14:20:00Z',
    icon: Briefcase,
    iconColor: 'text-brand-primary',
    metadata: {
      jobTitle: 'Full Stack Engineer',
      companyName: 'StartupXYZ'
    },
    priority: 'high'
  },
  {
    id: '5',
    type: 'resume_downloaded',
    title: 'Resume Downloaded',
    description: 'Your resume was downloaded 3 times today',
    timestamp: '2024-01-24T11:00:00Z',
    icon: Download,
    iconColor: 'text-brand-secondary',
    metadata: {
      fileName: 'Resume_v3.pdf'
    },
    priority: 'medium'
  },
  {
    id: '6',
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    description: 'Phone screening confirmed for next week',
    timestamp: '2024-01-23T17:30:00Z',
    icon: Calendar,
    iconColor: 'text-brand-tertiary',
    metadata: {
      jobTitle: 'UI/UX Developer',
      companyName: 'DesignCo',
      interviewDate: '2024-01-29T10:00:00Z'
    },
    priority: 'high'
  },
  {
    id: '7',
    type: 'profile_updated',
    title: 'Profile Updated',
    description: 'Added new skills and work experience to your profile',
    timestamp: '2024-01-23T13:15:00Z',
    icon: User,
    iconColor: 'text-brand-primary',
    priority: 'low'
  },
  {
    id: '8',
    type: 'document_updated',
    title: 'Cover Letter Updated',
    description: 'Modified cover letter with AI suggestions',
    timestamp: '2024-01-22T19:45:00Z',
    icon: Edit,
    iconColor: 'text-brand-secondary',
    metadata: {
      documentName: 'Cover_Letter_Tech.pdf'
    },
    priority: 'medium'
  }
];

const ActivityItemComponent: React.FC<{
  item: ActivityItem;
  isCompact?: boolean;
}> = ({ item, isCompact = false }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-brand-tertiary/10 border-brand-tertiary/20';
      case 'medium': return 'bg-brand-primary/10 border-brand-primary/20';
      case 'low': return 'bg-surface-container border-outline-variant';
      default: return 'bg-surface-container border-outline-variant';
    }
  };

  const IconComponent = item.icon;

  const renderMetadata = () => {
    if (!item.metadata) return null;

    const { documentName, jobTitle, companyName, score, oldScore, fileName, interviewDate } = item.metadata;

    return (
      <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
        {documentName && (
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{documentName}</span>
          </div>
        )}
        {jobTitle && companyName && (
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>{jobTitle} at {companyName}</span>
          </div>
        )}
        {score && oldScore && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Score: {oldScore}% → {score}%</span>
          </div>
        )}
        {fileName && (
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{fileName}</span>
          </div>
        )}
        {interviewDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Scheduled for {new Date(interviewDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      flex gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-surface-container-low
      ${item.isUnread ? getPriorityColor(item.priority) : 'border border-transparent'}
      ${isCompact ? 'py-2' : ''}
    `}>
      {/* Icon */}
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-high shrink-0
        ${isCompact ? 'w-6 h-6' : ''}
      `}>
        <IconComponent className={`w-4 h-4 ${item.iconColor} ${isCompact ? 'w-3 h-3' : ''}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium text-on-surface truncate ${isCompact ? 'text-sm' : ''}`}>
                {item.title}
              </h4>
              {item.isUnread && (
                <div className="w-2 h-2 rounded-full bg-brand-tertiary shrink-0"></div>
              )}
            </div>
            <p className={`text-on-surface-variant ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {item.description}
            </p>
            {!isCompact && renderMetadata()}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className={`text-on-surface-variant ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {formatTimestamp(item.timestamp)}
            </span>
            {!isCompact && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActivityFeedProps {
  isCompact?: boolean;
  maxItems?: number;
  showHeader?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  isCompact = false,
  maxItems,
  showHeader = true,
  onViewAll,
  className = ''
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivityItems);
  const [filter, setFilter] = useState<'all' | 'documents' | 'applications' | 'profile'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'documents') return ['document_created', 'document_updated', 'resume_downloaded'].includes(activity.type);
    if (filter === 'applications') return ['job_saved', 'application_submitted', 'interview_scheduled', 'ats_score_updated'].includes(activity.type);
    if (filter === 'profile') return ['profile_updated', 'system_update'].includes(activity.type);
    return true;
  });

  const displayedActivities = maxItems 
    ? filteredActivities.slice(0, maxItems)
    : filteredActivities;

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const markAllAsRead = () => {
    setActivities(prev => prev.map(item => ({ ...item, isUnread: false })));
  };

  const unreadCount = activities.filter(item => item.isUnread).length;

  if (isCompact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-sm text-on-surface-variant">No recent activity</p>
          </div>
        ) : (
          displayedActivities.map(activity => (
            <ActivityItemComponent 
              key={activity.id} 
              item={activity} 
              isCompact={true}
            />
          ))
        )}
        {onViewAll && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="w-full justify-center mt-3 text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10"
          >
            View All Activity
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-on-surface mb-1">
              Recent Activity
            </h2>
            <p className="text-sm text-on-surface-variant">
              Track your career progress and document updates
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read ({unreadCount})
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6">
        {[
          { key: 'all', label: 'All Activity', count: activities.length },
          { key: 'documents', label: 'Documents', count: activities.filter(a => ['document_created', 'document_updated', 'resume_downloaded'].includes(a.type)).length },
          { key: 'applications', label: 'Applications', count: activities.filter(a => ['job_saved', 'application_submitted', 'interview_scheduled', 'ats_score_updated'].includes(a.type)).length },
          { key: 'profile', label: 'Profile', count: activities.filter(a => ['profile_updated', 'system_update'].includes(a.type)).length }
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className={`${filter === key ? "btn-gradient" : ""} transition-all duration-200`}
          >
            {label}
            {count > 0 && (
              <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                {count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Activity List */}
      <Card className="bg-surface-container border border-outline-variant">
        <div className="divide-y divide-outline-variant">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 text-on-surface-variant/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-on-surface mb-2">No Activity Found</h3>
              <p className="text-on-surface-variant">
                {filter === 'all' 
                  ? "No recent activity to display." 
                  : `No ${filter} activity found.`}
              </p>
            </div>
          ) : (
            displayedActivities.map((activity, index) => (
              <ActivityItemComponent 
                key={activity.id} 
                item={activity}
              />
            ))
          )}
        </div>
      </Card>

      {/* Load More */}
      {maxItems && filteredActivities.length > maxItems && (
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            onClick={onViewAll}
            className="btn-gradient"
          >
            View All {filteredActivities.length} Activities
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;