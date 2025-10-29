/**
 * Notification API Service
 * Handles user notifications and notification preferences
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'application'
    | 'deadline'
    | 'opportunity'
    | 'system'
    | 'achievement';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  applicationReminders: boolean;
  deadlineAlerts: boolean;
  opportunityNotifications: boolean;
  systemNotifications: boolean;
  notificationFrequency: 'instant' | 'daily' | 'weekly';
}

export interface NotificationFilter {
  type?: string;
  read?: boolean;
  limit?: number;
  offset?: number;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationService = {
  /**
   * Get all notifications for user
   */
  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    try {
      const response = await apiClient.get('/', {
        params: filter,
      });
      return response.data.notifications;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get('/unread-count');
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put(`/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; updated: number }> {
    try {
      const response = await apiClient.post('/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  /**
   * Get notification preferences
   */
  async getPreferences(userId?: string): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.get('/preferences', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Get preferences error:', error);
      throw error;
    }
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(
    userId: string,
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.put('/preferences', {
        userId,
        ...prefs,
      });
      return response.data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(subscription: PushSubscription): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post('/push-subscribe', {
        subscription: subscription.toJSON(),
      });
      return response.data;
    } catch (error) {
      console.error('Subscribe to push error:', error);
      throw error;
    }
  },
};
