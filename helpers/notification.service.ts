/**
 * Notification Service Helper
 * Handles all notification-related API calls
 */

import { 
  Notification, 
  NotificationType, 
  NotificationResponse,
  generateNotificationContent,
  notificationConfig
} from '@/components/types/notification';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class NotificationService {
  /**
   * Fetch all notifications for the current user
   */
  static async getNotifications(): Promise<NotificationResponse | null> {
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return null;
    }
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Create a notification (called from frontend after certain actions)
   * This is a helper that will call the backend to create notifications
   */
  static async createNotification(data: {
    type: NotificationType;
    recipientId: string;
    bookingId?: string;
    metadata?: any;
  }): Promise<boolean> {
    try {
      const content = generateNotificationContent(data.type, data.metadata);
      const config = notificationConfig[data.type];

      const response = await fetch(`${API_URL}/api/notifications`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: data.type,
          title: content.title,
          message: content.message,
          priority: config.defaultPriority,
          recipientId: data.recipientId,
          bookingId: data.bookingId,
          metadata: data.metadata,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }
}

/**
 * Booking-specific notification helpers
 */
export class BookingNotificationService {
  /**
   * Notify admin when a new booking is created
   */
  static async notifyAdminOfNewBooking(bookingId: string, clientName: string, bookingReference: string): Promise<void> {
    try {
      await fetch(`${API_URL}/api/notifications/booking-created`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          clientName,
          bookingReference,
        }),
      });
    } catch (error) {
      console.error('Error notifying admin of new booking:', error);
    }
  }

  /**
   * Notify photographer when assigned to a booking
   */
  static async notifyPhotographerOfAssignment(
    photographerId: string,
    bookingId: string,
    clientName: string,
    bookingReference: string
  ): Promise<void> {
    try {
      await fetch(`${API_URL}/api/notifications/photographer-assigned`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photographerId,
          bookingId,
          clientName,
          bookingReference,
        }),
      });
    } catch (error) {
      console.error('Error notifying photographer of assignment:', error);
    }
  }

  /**
   * Notify admin and client when photographer accepts booking
   */
  static async notifyBookingAccepted(
    bookingId: string,
    photographerName: string,
    clientId: string,
    bookingReference: string
  ): Promise<void> {
    try {
      await fetch(`${API_URL}/api/notifications/booking-accepted`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          photographerName,
          clientId,
          bookingReference,
        }),
      });
    } catch (error) {
      console.error('Error notifying booking accepted:', error);
    }
  }

  /**
   * Notify admin when photographer rejects booking
   */
  static async notifyBookingRejected(
    bookingId: string,
    photographerName: string,
    bookingReference: string
  ): Promise<void> {
    try {
      await fetch(`${API_URL}/api/notifications/booking-rejected`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          photographerName,
          bookingReference,
        }),
      });
    } catch (error) {
      console.error('Error notifying booking rejected:', error);
    }
  }

  /**
   * Notify relevant parties of status change
   */
  static async notifyStatusChange(
    bookingId: string,
    oldStatus: string,
    newStatus: string,
    bookingReference: string,
    recipientIds: string[]
  ): Promise<void> {
    try {
      await fetch(`${API_URL}/api/notifications/status-change`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          oldStatus,
          newStatus,
          bookingReference,
          recipientIds,
        }),
      });
    } catch (error) {
      console.error('Error notifying status change:', error);
    }
  }
}
