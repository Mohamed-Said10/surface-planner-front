'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Notification } from '@/components/types/notification';

interface UseRealtimeNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refetch: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for real-time notifications using Server-Sent Events (SSE)
 * Connects to backend SSE endpoint to receive live notification updates
 */
export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch notifications:', response.status);
        return;
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up SSE connection for real-time updates
  useEffect(() => {
    if (!session?.user) return;

    // Fetch initial data
    fetchNotifications();

    // Connect to SSE endpoint - no query params needed as backend uses session
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/stream`,
      { withCredentials: true }
    );

    eventSourceRef.current = eventSource;

    // Handle connection confirmation
    eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') {
          // Connection established
        }
      } catch (error) {
        // Ignore parsing errors for heartbeat messages
      }
    });

    // Handle new notification event
    eventSource.addEventListener('notification', (event) => {
      try {
        const newNotification: Notification = JSON.parse(event.data);

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Optional: Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/icons/notification-icon.png',
            badge: '/icons/notification-badge.png',
          });
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    });

    // Handle notification update event (e.g., marked as read)
    eventSource.addEventListener('notification-update', (event) => {
      try {
        const updatedNotification: Notification = JSON.parse(event.data);

        setNotifications((prev) => {
          // Find the current state of this notification
          const currentNotification = prev.find(n => n.id === updatedNotification.id);
          
          // Only update if the SSE data is actually different or newer
          const updated = prev.map((n) => {
            if (n.id === updatedNotification.id) {
              // Merge with priority to keep isRead: true if already set
              return {
                ...updatedNotification,
                isRead: updatedNotification.isRead || n.isRead
              };
            }
            return n;
          });
          
          // Recalculate unread count based on updated list
          const newUnreadCount = updated.filter((n) => !n.isRead).length;
          setUnreadCount(newUnreadCount);
          
          return updated;
        });
      } catch (error) {
        console.error('❌ [SSE] Error parsing notification update:', error);
      }
    });

    // Handle notification delete event
    eventSource.addEventListener('notification-delete', (event) => {
      try {
        const { notificationId } = JSON.parse(event.data);

        setNotifications((prev) => {
          const filtered = prev.filter((n) => n.id !== notificationId);
          
          // Recalculate unread count based on filtered list
          const newUnreadCount = filtered.filter((n) => !n.isRead).length;
          setUnreadCount(newUnreadCount);
          
          return filtered;
        });
      } catch (error) {
        console.error('Error parsing notification delete:', error);
      }
    });

    // Handle unread count update
    eventSource.addEventListener('unread-count', (event) => {
      try {
        const { count } = JSON.parse(event.data);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error parsing unread count:', error);
      }
    });

    // Handle connection open
    eventSource.onopen = () => {
      // Connection opened
    };

    // Handle errors
    eventSource.onerror = (error) => {
      // SSE will automatically reconnect
      if (eventSource.readyState === EventSource.CLOSED) {
        // Connection closed, will retry
      }
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [session]);

  return {
    notifications,
    unreadCount,
    loading,
    refetch: fetchNotifications,
    setNotifications,
    setUnreadCount,
  };
}
