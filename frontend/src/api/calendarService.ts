/**
 * Calendar API Service
 * Handles calendar events, deadlines, and task scheduling
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventType: 'deadline' | 'interview' | 'reminder' | 'task';
  relatedApplicationId?: string;
  relatedJobId?: string;
  completed: boolean;
  metadata?: Record<string, any>;
}

export interface EventFilters {
  eventType?: string;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
}

export interface EventCreate {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventType: 'deadline' | 'interview' | 'reminder' | 'task';
  relatedApplicationId?: string;
  relatedJobId?: string;
}

export interface EventUpdate extends Partial<EventCreate> {
  completed?: boolean;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/calendar`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const calendarService = {
  /**
   * Create calendar event
   */
  async createEvent(event: EventCreate): Promise<CalendarEvent> {
    try {
      const response = await apiClient.post('/', event);
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },

  /**
   * List calendar events
   */
  async listEvents(userId?: string, filters?: EventFilters): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get('/', {
        params: { userId, ...filters },
      });
      return response.data.events;
    } catch (error) {
      console.error('List events error:', error);
      throw error;
    }
  },

  /**
   * Get specific event
   */
  async getEvent(eventId: string): Promise<CalendarEvent> {
    try {
      const response = await apiClient.get(`/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  },

  /**
   * Update event
   */
  async updateEvent(eventId: string, updates: EventUpdate): Promise<CalendarEvent> {
    try {
      const response = await apiClient.put(`/${eventId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  },

  /**
   * Delete event
   */
  async deleteEvent(eventId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  },

  /**
   * Sync deadlines from applications
   */
  async syncDeadlines(userId: string): Promise<{ synced: number; events: CalendarEvent[] }> {
    try {
      const response = await apiClient.post('/sync-deadlines', { userId });
      return response.data;
    } catch (error) {
      console.error('Sync deadlines error:', error);
      throw error;
    }
  },

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(
    userId: string,
    daysAhead: number = 30
  ): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get('/upcoming', {
        params: { userId, daysAhead },
      });
      return response.data.events;
    } catch (error) {
      console.error('Get upcoming events error:', error);
      throw error;
    }
  },

  /**
   * Mark event as completed
   */
  async completeEvent(eventId: string): Promise<CalendarEvent> {
    try {
      const response = await apiClient.put(`/${eventId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Complete event error:', error);
      throw error;
    }
  },
};
