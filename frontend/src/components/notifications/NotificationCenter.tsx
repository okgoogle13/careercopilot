import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../ui';
import { 
  Bell, X, Check, AlertTriangle, Info, CheckCircle, 
  Clock, FileText, User, Briefcase, Settings,
  Archive, Trash2, Filter, Search
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'application' | 'document' | 'profile' | 'system' | 'reminder';
  data?: Record<string, any>;
}

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'today'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: 'Application Deadline Approaching',
        message: 'Your application to TechCorp for Senior Software Engineer is due in 2 days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        priority: 'high',
        category: 'application',
        actionUrl: '/applications/1',
        actionText: 'View Application'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Profile Completion Milestone',
        message: 'Congratulations! Your profile is now 90% complete.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        priority: 'medium',
        category: 'profile',
        actionUrl: '/profile',
        actionText: 'View Profile'
      },
      {
        id: '3',
        type: 'info',
        title: 'New Resume Template Available',
        message: 'Check out our new Modern Tech template perfect for software engineers.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        priority: 'low',
        category: 'document',
        actionUrl: '/documents',
        actionText: 'Browse Templates'
      },
      {
        id: '4',
        type: 'warning',
        title: 'Resume Analysis Complete',
        message: 'Your resume has some areas for improvement. ATS score: 72/100',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        priority: 'medium',
        category: 'document',
        actionUrl: '/documents/resume/analyze',
        actionText: 'View Analysis'
      },
      {
        id: '5',
        type: 'system',
        title: 'Weekly Summary Ready',
        message: 'Your weekly job search activity summary is now available.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: false,
        priority: 'low',
        category: 'system',
        actionUrl: '/insights',
        actionText: 'View Summary'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'today' && !isToday(notification.timestamp)) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    
    // Filter by search term
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const archiveNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification archived');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'error': return X;
      case 'reminder': return Clock;
      case 'achievement': return CheckCircle;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], _priority: Notification['priority']) => {
    const baseColors = {
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      success: 'bg-green-50 text-green-700 border-green-200',
      error: 'bg-red-50 text-red-700 border-red-200',
      reminder: 'bg-orange-50 text-orange-700 border-orange-200',
      achievement: 'bg-purple-50 text-purple-700 border-purple-200',
      system: 'bg-gray-50 text-gray-700 border-gray-200'
    };

    return baseColors[type];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'application': return Briefcase;
      case 'document': return FileText;
      case 'profile': return User;
      case 'system': return Settings;
      case 'reminder': return Clock;
      default: return Bell;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'h:mm a');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d');
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Center Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg" title="Notifications">
        <div className="space-y-4">
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="today">Today</option>
              </select>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Categories</option>
              <option value="application">Applications</option>
              <option value="document">Documents</option>
              <option value="profile">Profile</option>
              <option value="system">System</option>
              <option value="reminder">Reminders</option>
            </select>

            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map(notification => {
                const IconComponent = getNotificationIcon(notification.type);
                const CategoryIcon = getCategoryIcon(notification.category);
                
                return (
                  <Card 
                    key={notification.id} 
                    className={cn(
                      'p-4 border transition-colors hover:bg-gray-50',
                      !notification.read ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : 'border-gray-200',
                      notification.priority === 'high' && !notification.read ? 'border-l-red-500' : ''
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-full flex-shrink-0',
                        getNotificationColor(notification.type, notification.priority)
                      )}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={cn(
                                'font-medium text-sm',
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              )}>
                                {notification.title}
                              </h4>
                              <CategoryIcon className="w-3 h-3 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    window.location.href = notification.actionUrl!;
                                  }}
                                  className="text-xs h-6 px-2"
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => archiveNotification(notification.id)}
                              className="h-6 w-6 p-0"
                              title="Archive"
                            >
                              <Archive className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t text-center">
            <Button variant="ghost" size="sm" className="text-sm text-gray-600">
              View All Notifications
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationCenter;