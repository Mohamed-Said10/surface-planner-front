// Notification types for the system
export type NotificationType = 
  | 'BOOKING_CREATED'           // Client creates a new booking -> Notify Admin
  | 'PHOTOGRAPHER_ASSIGNED'     // Admin assigns photographer -> Notify Photographer
  | 'PHOTOGRAPHER_ACCEPTED'     // Photographer accepts -> Notify Admin & Client
  | 'PHOTOGRAPHER_REJECTED'     // Photographer rejects -> Notify Admin
  | 'STATUS_CHANGE'             // Any status change -> Notify relevant parties
  | 'MESSAGE'                   // New message -> Notify recipient
  | 'PAYMENT'                   // Payment update -> Notify relevant parties
  | 'BOOKING_CANCELLED'         // Booking cancelled -> Notify all parties
  | 'WORK_COMPLETED';           // Photographer uploads work -> Notify Client

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
  
  // Related entities
  bookingId?: string;
  senderId?: string;
  recipientId: string;
  
  // Additional metadata
  metadata?: {
    photographerName?: string;
    clientName?: string;
    bookingReference?: string;
    oldStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };
  
  // Action link
  actionUrl?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}

// Notification configuration for each type
export const notificationConfig: Record<NotificationType, {
  icon: string;
  color: string;
  defaultPriority: NotificationPriority;
}> = {
  BOOKING_CREATED: {
    icon: '📅',
    color: 'blue',
    defaultPriority: 'HIGH',
  },
  PHOTOGRAPHER_ASSIGNED: {
    icon: '📸',
    color: 'purple',
    defaultPriority: 'HIGH',
  },
  PHOTOGRAPHER_ACCEPTED: {
    icon: '✅',
    color: 'green',
    defaultPriority: 'MEDIUM',
  },
  PHOTOGRAPHER_REJECTED: {
    icon: '❌',
    color: 'red',
    defaultPriority: 'HIGH',
  },
  STATUS_CHANGE: {
    icon: '🔄',
    color: 'orange',
    defaultPriority: 'MEDIUM',
  },
  MESSAGE: {
    icon: '💬',
    color: 'blue',
    defaultPriority: 'MEDIUM',
  },
  PAYMENT: {
    icon: '💰',
    color: 'green',
    defaultPriority: 'HIGH',
  },
  BOOKING_CANCELLED: {
    icon: '🚫',
    color: 'red',
    defaultPriority: 'HIGH',
  },
  WORK_COMPLETED: {
    icon: '🎉',
    color: 'green',
    defaultPriority: 'HIGH',
  },
};

// Helper to generate notification title and message
export function generateNotificationContent(
  type: NotificationType,
  metadata: Notification['metadata']
): { title: string; message: string } {
  switch (type) {
    case 'BOOKING_CREATED':
      return {
        title: 'New Booking Request',
        message: `${metadata?.clientName || 'A client'} has created a new booking${metadata?.bookingReference ? ` (${metadata.bookingReference})` : ''}. Please review and assign a photographer.`,
      };
    
    case 'PHOTOGRAPHER_ASSIGNED':
      return {
        title: 'New Booking Assignment',
        message: `You have been assigned to a new booking${metadata?.bookingReference ? ` (${metadata.bookingReference})` : ''}${metadata?.clientName ? ` for ${metadata.clientName}` : ''}. Please review and accept or reject.`,
      };
    
    case 'PHOTOGRAPHER_ACCEPTED':
      return {
        title: 'Photographer Accepted Booking',
        message: `${metadata?.photographerName || 'The photographer'} has accepted the booking${metadata?.bookingReference ? ` (${metadata.bookingReference})` : ''}.`,
      };
    
    case 'PHOTOGRAPHER_REJECTED':
      return {
        title: 'Photographer Declined Booking',
        message: `${metadata?.photographerName || 'The photographer'} has declined the booking${metadata?.bookingReference ? ` (${metadata.bookingReference})` : ''}. Please assign another photographer.`,
      };
    
    case 'STATUS_CHANGE':
      return {
        title: 'Booking Status Updated',
        message: `Booking${metadata?.bookingReference ? ` ${metadata.bookingReference}` : ''} status changed from ${metadata?.oldStatus || 'previous status'} to ${metadata?.newStatus || 'new status'}.`,
      };
    
    case 'MESSAGE':
      return {
        title: 'New Message',
        message: `You have a new message${metadata?.senderName ? ` from ${metadata.senderName}` : ''}.`,
      };
    
    case 'PAYMENT':
      return {
        title: 'Payment Update',
        message: metadata?.message || 'There is a payment update for your booking.',
      };
    
    case 'BOOKING_CANCELLED':
      return {
        title: 'Booking Cancelled',
        message: `Booking${metadata?.bookingReference ? ` ${metadata.bookingReference}` : ''} has been cancelled${metadata?.reason ? `: ${metadata.reason}` : ''}.`,
      };
    
    case 'WORK_COMPLETED':
      return {
        title: 'Your Photos Are Ready! 🎉',
        message: `${metadata?.photographerName || 'Your photographer'} has finished editing and uploaded all files for booking${metadata?.bookingReference ? ` ${metadata.bookingReference}` : ''}. Click to view and download your photos!`,
      };
    
    default:
      return {
        title: 'Notification',
        message: 'You have a new notification.',
      };
  }
}
