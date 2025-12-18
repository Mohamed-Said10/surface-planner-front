# Backend Implementation Guide - Quick Start

## 🎯 What You Need to Implement

This is a **notification system** for a booking application with 3 user roles: **Admin**, **Photographer**, and **Client**.

## 📋 Core Requirements

### 1. Database Table
Create a `notifications` table with these fields:
- `id` (UUID/String, Primary Key)
- `type` (Enum: BOOKING_CREATED, PHOTOGRAPHER_ASSIGNED, etc.)
- `title` (String)
- `message` (Text)
- `priority` (Enum: LOW, MEDIUM, HIGH, URGENT)
- `is_read` (Boolean, default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `recipient_id` (Foreign Key → users.id)
- `sender_id` (Foreign Key → users.id, nullable)
- `booking_id` (Foreign Key → bookings.id, nullable)
- `metadata` (JSON, nullable)
- `action_url` (String, nullable)

**Indexes needed:**
- `recipient_id + is_read` (for fast unread queries)
- `created_at DESC` (for sorting)
- `booking_id` (for booking-related queries)

### 2. Essential API Endpoints

#### A. Get User Notifications
```
GET /api/notifications
Auth: Required
Query params: limit, offset, unreadOnly

Returns:
{
  notifications: [...],
  unreadCount: 5,
  totalCount: 23
}
```

#### B. Mark Notification as Read
```
PATCH /api/notifications/:id/read
Auth: Required

Returns: { success: true }
```

#### C. Mark All as Read
```
PATCH /api/notifications/mark-all-read
Auth: Required

Returns: { success: true, updatedCount: 5 }
```

#### D. Notify Admin of New Booking
```
POST /api/notifications/booking-created
Auth: Required
Body: { bookingId, clientName, bookingReference }

Logic:
1. Find all users with role = 'ADMIN'
2. Create notification for each admin
3. Set type = 'BOOKING_CREATED'
4. Set actionUrl = '/dash/admin/booking-details/{bookingId}'

Returns: { success: true, notificationCount: 2 }
```

#### E. Notify Photographer of Assignment
```
POST /api/notifications/photographer-assigned
Auth: Required (Admin only)
Body: { photographerId, bookingId, clientName, bookingReference }

Logic:
1. Create notification for the photographer
2. Set type = 'PHOTOGRAPHER_ASSIGNED'
3. Set actionUrl = '/dash/photographer/booking-details/{bookingId}'
4. Include clientName and bookingReference in metadata

Returns: { success: true, notificationId: "..." }
```

### 3. Integration Points

#### When a Booking is Created (in POST /api/bookings):
```javascript
// After saving the booking
await createNotificationsForAdmins({
  type: 'BOOKING_CREATED',
  title: 'New Booking Request',
  message: `${clientName} has created a new booking (${bookingRef}). Please review and assign a photographer.`,
  bookingId: newBooking.id,
  metadata: { clientName, bookingReference: bookingRef }
});
```

#### When a Photographer is Assigned (in POST /api/bookings/:id/assign):
```javascript
// After assigning the photographer
await createNotification({
  type: 'PHOTOGRAPHER_ASSIGNED',
  title: 'New Booking Assignment',
  message: `You have been assigned to a new booking (${bookingRef}) for ${clientName}.`,
  recipientId: photographerId,
  bookingId: bookingId,
  metadata: { clientName, bookingReference: bookingRef }
});
```

## 🔧 Implementation Example (Pseudo-code)

```javascript
// Notification Service
class NotificationService {
  
  // Get notifications for a user
  async getNotifications(userId, { limit = 50, offset = 0, unreadOnly = false }) {
    const where = { recipient_id: userId };
    if (unreadOnly) where.is_read = false;
    
    const notifications = await Notification.findAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    const unreadCount = await Notification.count({
      where: { recipient_id: userId, is_read: false }
    });
    
    const totalCount = await Notification.count({
      where: { recipient_id: userId }
    });
    
    return { notifications, unreadCount, totalCount };
  }
  
  // Mark as read
  async markAsRead(notificationId, userId) {
    await Notification.update(
      { is_read: true },
      { where: { id: notificationId, recipient_id: userId } }
    );
  }
  
  // Mark all as read
  async markAllAsRead(userId) {
    const result = await Notification.update(
      { is_read: true },
      { where: { recipient_id: userId, is_read: false } }
    );
    return result[0]; // number of updated rows
  }
  
  // Create notification
  async create(data) {
    return await Notification.create({
      id: generateUUID(),
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'MEDIUM',
      recipient_id: data.recipientId,
      sender_id: data.senderId,
      booking_id: data.bookingId,
      metadata: JSON.stringify(data.metadata),
      action_url: data.actionUrl,
      is_read: false
    });
  }
  
  // Notify all admins
  async notifyAdmins(data) {
    const admins = await User.findAll({ where: { role: 'ADMIN' } });
    const notifications = admins.map(admin => 
      this.create({ ...data, recipientId: admin.id })
    );
    return await Promise.all(notifications);
  }
}
```

## 🔗 API Routes to Create

1. **GET** `/api/notifications` → Get user's notifications
2. **PATCH** `/api/notifications/:id/read` → Mark one as read
3. **PATCH** `/api/notifications/mark-all-read` → Mark all as read
4. **POST** `/api/notifications/booking-created` → Notify admins of new booking
5. **POST** `/api/notifications/photographer-assigned` → Notify photographer

## ⚡ Quick Implementation Checklist

- [ ] Create `notifications` database table with indexes
- [ ] Create NotificationService/Repository class
- [ ] Implement GET /api/notifications endpoint
- [ ] Implement PATCH /api/notifications/:id/read endpoint
- [ ] Implement PATCH /api/notifications/mark-all-read endpoint
- [ ] Create POST /api/notifications/booking-created endpoint
- [ ] Create POST /api/notifications/photographer-assigned endpoint
- [ ] Add notification creation in POST /api/bookings (after booking created)
- [ ] Add notification creation in POST /api/bookings/:id/assign (after assignment)
- [ ] Test with Postman/frontend
- [ ] Add authentication checks on all endpoints
- [ ] Add authorization (users can only see their notifications)

## 🔐 Security Requirements

1. **Authentication**: All endpoints require valid user session/token
2. **Authorization**: Users can only access their own notifications
3. **Input Validation**: Validate all incoming data (bookingId, recipientId, etc.)
4. **Rate Limiting**: Prevent spam/abuse
5. **SQL Injection**: Use parameterized queries
6. **XSS**: Sanitize message content if allowing HTML

## 📊 Database Indexes (Important for Performance!)

```sql
-- Fast lookup for user's unread notifications
CREATE INDEX idx_notifications_recipient_unread 
ON notifications(recipient_id, is_read);

-- Fast sorting by date
CREATE INDEX idx_notifications_created_at 
ON notifications(created_at DESC);

-- Fast lookup by booking
CREATE INDEX idx_notifications_booking 
ON notifications(booking_id);
```

## 🧪 Testing the API

### Test 1: Get Notifications
```bash
curl -X GET http://localhost:3000/api/notifications \
  -H "Cookie: session=..." \
  -H "Content-Type: application/json"
```

### Test 2: Create Booking Notification
```bash
curl -X POST http://localhost:3000/api/notifications/booking-created \
  -H "Cookie: session=..." \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-123",
    "clientName": "John Doe",
    "bookingReference": "12345678"
  }'
```

### Test 3: Mark as Read
```bash
curl -X PATCH http://localhost:3000/api/notifications/abc-123/read \
  -H "Cookie: session=..." \
  -H "Content-Type: application/json"
```

## 📝 Expected Response Formats

### Notification Object:
```json
{
  "id": "uuid",
  "type": "BOOKING_CREATED",
  "title": "New Booking Request",
  "message": "John Doe has created a new booking...",
  "priority": "HIGH",
  "isRead": false,
  "createdAt": "2025-12-18T10:30:00Z",
  "updatedAt": "2025-12-18T10:30:00Z",
  "recipientId": "user-id",
  "senderId": "client-id",
  "bookingId": "booking-123",
  "metadata": {
    "clientName": "John Doe",
    "bookingReference": "12345678"
  },
  "actionUrl": "/dash/admin/booking-details/booking-123"
}
```

## 🚀 Frontend is Ready!
The frontend code is complete and waiting for your API endpoints. Once you implement the backend, the notification system will work automatically.

## 📚 Additional Documentation
See `BACKEND_NOTIFICATION_API_SPEC.md` for complete technical specifications.

## ❓ Questions to Consider

1. **ORM/Query Builder**: What are you using? (Sequelize, Prisma, TypeORM, raw SQL?)
2. **Authentication**: How is user authenticated? (JWT, sessions, cookies?)
3. **Database**: PostgreSQL, MySQL, MongoDB?
4. **Framework**: Express, NestJS, Fastify, other?

Adjust the implementation based on your stack!
