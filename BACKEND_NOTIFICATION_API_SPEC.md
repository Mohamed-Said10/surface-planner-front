# Backend API Specification for Notification System

## Overview
This document specifies the backend API endpoints required to support the notification system in the Surface Planner Next.js frontend application. The notification system handles communication between Admins, Photographers, and Clients regarding booking lifecycle events.

## Database Schema Requirements

### Notifications Table
```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM(
    'BOOKING_CREATED',
    'PHOTOGRAPHER_ASSIGNED', 
    'PHOTOGRAPHER_ACCEPTED',
    'PHOTOGRAPHER_REJECTED',
    'STATUS_CHANGE',
    'MESSAGE',
    'PAYMENT',
    'BOOKING_CANCELLED'
  ) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  recipient_id VARCHAR(36) NOT NULL,
  sender_id VARCHAR(36),
  booking_id VARCHAR(36),
  
  -- Additional metadata (stored as JSON)
  metadata JSON,
  
  -- Action URL for frontend navigation
  action_url VARCHAR(255),
  
  INDEX idx_recipient_read (recipient_id, is_read),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_booking_id (booking_id),
  
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
```

## API Endpoints

### 1. Get User Notifications
**Endpoint:** `GET /api/notifications`  
**Authentication:** Required (JWT/Session)  
**Description:** Fetch all notifications for the authenticated user

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `unreadOnly` (optional): Boolean to filter only unread notifications (default: false)

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "BOOKING_CREATED",
      "title": "New Booking Request",
      "message": "John Doe has created a new booking (12345678). Please review and assign a photographer.",
      "priority": "HIGH",
      "isRead": false,
      "createdAt": "2025-12-18T10:30:00Z",
      "updatedAt": "2025-12-18T10:30:00Z",
      "recipientId": "admin-user-id",
      "senderId": "client-user-id",
      "bookingId": "booking-123",
      "metadata": {
        "clientName": "John Doe",
        "bookingReference": "12345678"
      },
      "actionUrl": "/dash/admin/booking-details/booking-123"
    }
  ],
  "unreadCount": 5,
  "totalCount": 23
}
```

### 2. Get Unread Count
**Endpoint:** `GET /api/notifications/unread-count`  
**Authentication:** Required  
**Description:** Get count of unread notifications for the authenticated user

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

### 3. Mark Notification as Read
**Endpoint:** `PATCH /api/notifications/:notificationId/read`  
**Authentication:** Required  
**Description:** Mark a specific notification as read

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 4. Mark All Notifications as Read
**Endpoint:** `PATCH /api/notifications/mark-all-read`  
**Authentication:** Required  
**Description:** Mark all notifications for the user as read

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "updatedCount": 5
}
```

### 5. Delete Notification
**Endpoint:** `DELETE /api/notifications/:notificationId`  
**Authentication:** Required  
**Description:** Delete a specific notification

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

### 6. Create Generic Notification (Internal Use)
**Endpoint:** `POST /api/notifications`  
**Authentication:** Required  
**Description:** Create a new notification (for internal system use)

**Request Body:**
```json
{
  "type": "BOOKING_CREATED",
  "title": "New Booking Request",
  "message": "A client has created a new booking",
  "priority": "HIGH",
  "recipientId": "user-id",
  "bookingId": "booking-id",
  "metadata": {
    "clientName": "John Doe",
    "bookingReference": "12345678"
  }
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "notification-id",
    "type": "BOOKING_CREATED",
    "title": "New Booking Request",
    "message": "A client has created a new booking",
    "isRead": false,
    "createdAt": "2025-12-18T10:30:00Z"
  }
}
```

## Booking-Specific Notification Endpoints

### 7. Notify Admin of New Booking
**Endpoint:** `POST /api/notifications/booking-created`  
**Authentication:** Required  
**Description:** Send notification to admin(s) when a client creates a new booking

**Request Body:**
```json
{
  "bookingId": "booking-123",
  "clientName": "John Doe",
  "bookingReference": "12345678"
}
```

**Implementation Logic:**
1. Find all users with role 'ADMIN'
2. Create a notification for each admin with type 'BOOKING_CREATED'
3. Include booking details in metadata
4. Set action URL to `/dash/admin/booking-details/{bookingId}`

**Response:**
```json
{
  "success": true,
  "message": "Admin(s) notified successfully",
  "notificationCount": 2
}
```

### 8. Notify Photographer of Assignment
**Endpoint:** `POST /api/notifications/photographer-assigned`  
**Authentication:** Required (Admin only)  
**Description:** Notify a photographer when they are assigned to a booking

**Request Body:**
```json
{
  "photographerId": "photographer-id",
  "bookingId": "booking-123",
  "clientName": "John Doe",
  "bookingReference": "12345678"
}
```

**Implementation Logic:**
1. Create notification for the photographer with type 'PHOTOGRAPHER_ASSIGNED'
2. Include client name and booking reference in metadata
3. Set action URL to `/dash/photographer/booking-details/{bookingId}`
4. Optionally send email notification

**Response:**
```json
{
  "success": true,
  "message": "Photographer notified successfully",
  "notificationId": "notification-id"
}
```

### 9. Notify Booking Accepted
**Endpoint:** `POST /api/notifications/booking-accepted`  
**Authentication:** Required (Photographer only)  
**Description:** Notify admin and client when photographer accepts a booking

**Request Body:**
```json
{
  "bookingId": "booking-123",
  "photographerName": "Jane Smith",
  "clientId": "client-id",
  "bookingReference": "12345678"
}
```

**Implementation Logic:**
1. Create notification for all admins with type 'PHOTOGRAPHER_ACCEPTED'
2. Create notification for the client
3. Include photographer name in metadata
4. Set appropriate action URLs for each role

**Response:**
```json
{
  "success": true,
  "message": "Notifications sent successfully",
  "notificationCount": 3
}
```

### 10. Notify Booking Rejected
**Endpoint:** `POST /api/notifications/booking-rejected`  
**Authentication:** Required (Photographer only)  
**Description:** Notify admin when photographer rejects a booking

**Request Body:**
```json
{
  "bookingId": "booking-123",
  "photographerName": "Jane Smith",
  "bookingReference": "12345678",
  "reason": "Schedule conflict"
}
```

**Implementation Logic:**
1. Create notification for all admins with type 'PHOTOGRAPHER_REJECTED'
2. Include photographer name and rejection reason in metadata
3. Set action URL to booking details for reassignment

**Response:**
```json
{
  "success": true,
  "message": "Admin(s) notified of rejection",
  "notificationCount": 2
}
```

### 11. Notify Status Change
**Endpoint:** `POST /api/notifications/status-change`  
**Authentication:** Required  
**Description:** Notify relevant parties when booking status changes

**Request Body:**
```json
{
  "bookingId": "booking-123",
  "oldStatus": "PHOTOGRAPHER_ASSIGNED",
  "newStatus": "SHOOTING",
  "bookingReference": "12345678",
  "recipientIds": ["client-id", "photographer-id"]
}
```

**Implementation Logic:**
1. Create notifications for all specified recipients
2. Use type 'STATUS_CHANGE'
3. Include old and new status in metadata
4. Set appropriate action URLs based on recipient role

**Response:**
```json
{
  "success": true,
  "message": "Status change notifications sent",
  "notificationCount": 2
}
```

## Real-time Notification Support (Optional Enhancement)

### WebSocket/Server-Sent Events
For real-time notifications without polling, implement WebSocket or Server-Sent Events:

**WebSocket Endpoint:** `ws://your-api-url/notifications/live`  
**Authentication:** Via query parameter or initial handshake

**Message Format:**
```json
{
  "event": "new_notification",
  "data": {
    "id": "notification-id",
    "type": "BOOKING_CREATED",
    "title": "New Booking Request",
    "message": "...",
    "priority": "HIGH",
    "createdAt": "2025-12-18T10:30:00Z"
  }
}
```

## Security Considerations

1. **Authentication**: All endpoints require valid authentication
2. **Authorization**: Users can only access their own notifications
3. **Rate Limiting**: Implement rate limiting on notification endpoints
4. **Input Validation**: Validate all input data to prevent injection attacks
5. **XSS Prevention**: Sanitize notification messages before storing
6. **CORS**: Configure appropriate CORS headers for the Next.js frontend

## Implementation Notes

### Notification Creation Triggers

**On Booking Creation:**
```javascript
// After successfully creating a booking in POST /api/bookings
await notificationService.notifyBookingCreated({
  bookingId: newBooking.id,
  clientName: user.firstname + ' ' + user.lastname,
  bookingReference: newBooking.id.slice(0, 8)
});
```

**On Photographer Assignment:**
```javascript
// In POST /api/bookings/:id/assign endpoint
await notificationService.notifyPhotographerAssigned({
  photographerId: assignedPhotographerId,
  bookingId: bookingId,
  clientName: booking.client.firstname + ' ' + booking.client.lastname,
  bookingReference: bookingId.slice(0, 8)
});
```

**On Status Updates:**
```javascript
// In PATCH /api/bookings/:id/status endpoint
await notificationService.notifyStatusChange({
  bookingId: bookingId,
  oldStatus: currentStatus,
  newStatus: newStatus,
  bookingReference: bookingId.slice(0, 8),
  recipientIds: [booking.clientId, booking.photographerId, ...adminIds]
});
```

### Notification Service Helper (Backend)

```javascript
class NotificationService {
  static async create(data) {
    // Create notification in database
    return await Notification.create({
      id: generateUUID(),
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'MEDIUM',
      recipientId: data.recipientId,
      senderId: data.senderId,
      bookingId: data.bookingId,
      metadata: JSON.stringify(data.metadata),
      actionUrl: data.actionUrl,
      isRead: false
    });
  }

  static async notifyBookingCreated({ bookingId, clientName, bookingReference }) {
    const admins = await User.findAll({ where: { role: 'ADMIN' } });
    
    const notifications = admins.map(admin => ({
      type: 'BOOKING_CREATED',
      title: 'New Booking Request',
      message: `${clientName} has created a new booking (${bookingReference}). Please review and assign a photographer.`,
      priority: 'HIGH',
      recipientId: admin.id,
      bookingId: bookingId,
      metadata: { clientName, bookingReference },
      actionUrl: `/dash/admin/booking-details/${bookingId}`
    }));

    return await Promise.all(notifications.map(n => this.create(n)));
  }

  // Similar methods for other notification types...
}
```

## Testing Checklist

- [ ] Admin receives notification when client creates booking
- [ ] Photographer receives notification when assigned by admin
- [ ] Notification badge count updates correctly
- [ ] Clicking notification navigates to correct page
- [ ] Mark as read functionality works
- [ ] Mark all as read functionality works
- [ ] Notifications persist across browser sessions
- [ ] Unread count is accurate
- [ ] Old notifications can be deleted
- [ ] Notifications display correct timestamps
- [ ] Real-time updates work (if implemented)
- [ ] Multiple admins all receive notifications
- [ ] Role-based access control is enforced
- [ ] Notification metadata is correctly structured

## Future Enhancements

1. **Email Notifications**: Send email copies of important notifications
2. **Push Notifications**: Implement browser push notifications
3. **Notification Preferences**: Allow users to configure notification preferences
4. **Notification Templates**: Create reusable templates for common notifications
5. **Notification History**: Archive old notifications for audit purposes
6. **Bulk Operations**: Support bulk mark as read/delete operations
7. **Notification Categories**: Allow filtering by notification category
8. **Search**: Implement search functionality for notifications
