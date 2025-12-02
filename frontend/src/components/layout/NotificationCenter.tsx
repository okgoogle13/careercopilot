/**
 * ELECTRIC ALCHEMIST: NOTIFICATION CENTER COMPONENT
 *
 * Notification center using Electric Alchemist Design System v4.4.
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { Button, Badge, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { notificationService } from '@/api/notificationService';
import type { Notification } from '@/api/notificationService';
import { isApiError } from '@/types/api';
import { cn } from '@/lib/utils';

export const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const notificationsResponse = await notificationService.getNotifications();
        if (!isApiError(notificationsResponse)) {
          setNotifications(notificationsResponse.data);
        } else {
          console.error('Failed to fetch notifications:', notificationsResponse.message);
        }

        const countResponse = await notificationService.getUnreadCount();
        if (!isApiError(countResponse)) {
          setUnreadCount(countResponse.data.count);
        } else {
          console.error('Failed to fetch unread count:', countResponse.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (!isApiError(response)) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        console.error('Failed to mark notification as read:', response.message);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (!isApiError(response)) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        console.error('Failed to mark all notifications as read:', response.message);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'info':
        return <Info className="h-5 w-5 text-secondary" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-tertiary" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error" />;
      default:
        return <Info className="h-5 w-5 text-on-surface-variant" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-h-[500px] p-0" align="end">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-hero text-lg font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-on-surface-variant mx-auto mb-2" />
              <p className="text-human text-sm text-on-surface-variant">
                No notifications yet
              </p>
            </div>
          ) : (
            <>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="mb-2 w-full"
                >
                  Mark all as read
                </Button>
              )}

              <div className="max-h-[350px] overflow-y-auto space-y-0">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex gap-3 p-3 cursor-pointer transition-colors',
                      !notification.read && 'bg-surface-container',
                      'hover:bg-surface-container-high',
                      index < notifications.length - 1 && 'border-b border-outline-variant'
                    )}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type || 'info')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={cn(
                            'text-human text-sm flex-1',
                            notification.read ? 'font-normal' : 'font-semibold'
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-human text-xs text-on-surface-variant mb-1">
                        {notification.message}
                      </p>
                      <p className="text-data text-xs text-on-surface-variant">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-1 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

