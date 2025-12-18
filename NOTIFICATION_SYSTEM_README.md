# Notification System Documentation

## Overview
This notification system provides real-time updates for all three user roles (Admin, Photographer, and Client) in the Surface Planner application. It tracks the complete booking lifecycle from creation to completion.

## Features Implemented

### ✅ Core Functionality
- **Real-time notification bell** with unread count badge
- **Role-based notifications** for Admin, Photographer, and Client
- **Automatic polling** every 30 seconds for new notifications
- **Click-to-navigate** to relevant booking/page
- **Mark as read** functionality (individual and bulk)
- **Notification types** with custom icons and priorities
- **Metadata support** for rich notification context

### 🔔 Notification Triggers

#### 1. **Client Creates Booking** → Admin Notified
- **When**: Client submits a new booking in the booking form
- **Who Gets Notified**: All admin users
- **Notification Type**: `BOOKING_CREATED`
- **Action**: Admin can click to view booking details and assign a photographer
- **File**: `components/website/steps-form/SummaryStep.tsx`

#### 2. **Admin Assigns Photographer** → Photographer Notified  
- **When**: Admin assigns a photographer to a booking
- **Who Gets Notified**: The assigned photographer
- **Notification Type**: `PHOTOGRAPHER_ASSIGNED`
- **Action**: Photographer can click to view booking details and accept/reject
- **File**: `app/dash/admin/booking-details/[id]/page.tsx`

#### 3. **Status Changes** → Relevant Parties Notified
- **When**: Booking status changes (e.g., accepted, shooting, editing, completed)
- **Who Gets Notified**: Admin, photographer, and/or client (depending on status)
- **Notification Type**: `STATUS_CHANGE`
- **Action**: Navigate to booking details to see updated status

## File Structure

```
components/
├── types/
│   └── notification.ts                    # Notification types and utilities
├── dashboard/
│   └── header/
│       └── NotificationBell.tsx          # Main notification UI component
└── website/
    └── steps-form/
        └── SummaryStep.tsx               # Booking creation with notification trigger

app/
└── dash/
    └── admin/
        └── booking-details/
            └── [id]/
                └── page.tsx              # Photographer assignment with notification

helpers/
└── notification.service.ts               # API service for notification calls

BACKEND_NOTIFICATION_API_SPEC.md          # Complete backend specification
```

## Frontend Components

### NotificationBell Component
**Location**: `components/dashboard/header/NotificationBell.tsx`

**Features**:
- Bell icon with unread count badge
- Dropdown list of recent notifications
- Auto-refresh every 30 seconds
- Click notification to navigate and mark as read
- "Mark all as read" button
- Role-based navigation

**Usage**:
```tsx
import NotificationBell from '@/components/dashboard/header/NotificationBell';

// Already integrated in Header component
<NotificationBell />
```

### Notification Types
**Location**: `components/types/notification.ts`

**Available Types**:
- `BOOKING_CREATED` - New booking request
- `PHOTOGRAPHER_ASSIGNED` - Photographer assigned to booking
- `PHOTOGRAPHER_ACCEPTED` - Photographer accepted booking
- `PHOTOGRAPHER_REJECTED` - Photographer rejected booking
- `STATUS_CHANGE` - Booking status updated
- `MESSAGE` - New message received
- `PAYMENT` - Payment update
- `BOOKING_CANCELLED` - Booking cancelled

**Type Definition**:
```typescript
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  recipientId: string;
  bookingId?: string;
  metadata?: {
    photographerName?: string;
    clientName?: string;
    bookingReference?: string;
    // ... more fields
  };
  actionUrl?: string;
}
```

### Notification Service
**Location**: `helpers/notification.service.ts`

**Main Methods**:

```typescript
// General notification operations
NotificationService.getNotifications()
NotificationService.markAsRead(notificationId)
NotificationService.markAllAsRead()
NotificationService.deleteNotification(notificationId)
NotificationService.getUnreadCount()

// Booking-specific notifications
BookingNotificationService.notifyAdminOfNewBooking(bookingId, clientName, bookingReference)
BookingNotificationService.notifyPhotographerOfAssignment(photographerId, bookingId, clientName, bookingReference)
BookingNotificationService.notifyBookingAccepted(bookingId, photographerName, clientId, bookingReference)
BookingNotificationService.notifyBookingRejected(bookingId, photographerName, bookingReference)
BookingNotificationService.notifyStatusChange(bookingId, oldStatus, newStatus, bookingReference, recipientIds)
```

## How to Use

### Adding a New Notification Trigger

1. **Import the service**:
```typescript
import { BookingNotificationService } from '@/helpers/notification.service';
```

2. **Call the appropriate method**:
```typescript
// Example: After photographer accepts a booking
await BookingNotificationService.notifyBookingAccepted(
  booking.id,
  `${photographer.firstname} ${photographer.lastname}`,
  booking.clientId,
  booking.id.slice(0, 8)
);
```

3. **Handle errors gracefully**:
```typescript
try {
  await BookingNotificationService.notifyAdminOfNewBooking(...);
} catch (error) {
  console.error('Notification failed:', error);
  // Don't block the main flow
}
```

### Creating Custom Notifications

```typescript
import { NotificationService } from '@/helpers/notification.service';

await NotificationService.createNotification({
  type: 'MESSAGE',
  recipientId: 'user-id',
  bookingId: 'booking-id', // optional
  metadata: {
    senderName: 'John Doe',
    message: 'Hello!'
  }
});
```

## Backend Requirements

The frontend is ready and waiting for the backend API endpoints. Please refer to **`BACKEND_NOTIFICATION_API_SPEC.md`** for complete backend implementation details.

### Critical Backend Endpoints Needed:

1. **`GET /api/notifications`** - Fetch user notifications
2. **`PATCH /api/notifications/:id/read`** - Mark as read
3. **`PATCH /api/notifications/mark-all-read`** - Mark all as read
4. **`POST /api/notifications/booking-created`** - Notify admin of new booking
5. **`POST /api/notifications/photographer-assigned`** - Notify photographer of assignment

See the full specification in `BACKEND_NOTIFICATION_API_SPEC.md`.

## Notification Flow Examples

### Example 1: New Booking Flow
```
1. Client fills booking form
2. Client clicks "Submit" in SummaryStep
3. POST /api/bookings creates booking
4. Frontend calls BookingNotificationService.notifyAdminOfNewBooking()
5. Backend creates notifications for all admins
6. Admin sees bell icon badge increase
7. Admin clicks bell, sees "New Booking Request"
8. Admin clicks notification
9. Navigates to /dash/admin/booking-details/[id]
10. Notification marked as read automatically
```

### Example 2: Photographer Assignment Flow
```
1. Admin views booking details
2. Admin clicks "Assign Photographer"
3. Admin selects photographer and confirms
4. POST /api/bookings/:id/assign updates booking
5. Frontend calls BookingNotificationService.notifyPhotographerOfAssignment()
6. Backend creates notification for photographer
7. Photographer logs in, sees notification
8. Photographer clicks notification
9. Navigates to /dash/photographer/booking-details/[id]
10. Photographer can accept or reject
```

## Customization

### Change Polling Interval
In `NotificationBell.tsx`, line 57:
```typescript
// Poll for new notifications every 30 seconds
const interval = setInterval(fetchNotifications, 30000);

// Change to 60 seconds:
const interval = setInterval(fetchNotifications, 60000);
```

### Add New Notification Types
1. Add to enum in `components/types/notification.ts`:
```typescript
export type NotificationType = 
  | 'BOOKING_CREATED'
  | 'YOUR_NEW_TYPE';  // Add here
```

2. Add to config:
```typescript
export const notificationConfig: Record<NotificationType, ...> = {
  YOUR_NEW_TYPE: {
    icon: '🎉',
    color: 'green',
    defaultPriority: 'MEDIUM',
  }
};
```

3. Add to content generator:
```typescript
export function generateNotificationContent(type, metadata) {
  switch (type) {
    case 'YOUR_NEW_TYPE':
      return {
        title: 'New Event',
        message: 'Something happened!',
      };
  }
}
```

### Styling
The notification bell uses Tailwind CSS. Customize in `NotificationBell.tsx`:
- Bell icon: Line 172
- Badge: Line 175-180
- Dropdown: Line 184-257

## Testing

### Manual Testing Checklist:
- [ ] Admin sees notification when client creates booking
- [ ] Photographer sees notification when assigned
- [ ] Clicking notification navigates to correct page
- [ ] Badge shows correct unread count
- [ ] "Mark all as read" clears badge
- [ ] Notifications persist after page refresh
- [ ] Dropdown closes when clicking outside
- [ ] Icons display correctly for each type
- [ ] Timestamps show relative time (e.g., "5m ago")
- [ ] Unread notifications have blue background

### Testing with Backend:
Once backend is implemented, test:
1. Create a booking as a client
2. Check admin dashboard for notification
3. Assign photographer as admin
4. Check photographer dashboard for notification
5. Verify API calls in browser DevTools Network tab

## Troubleshooting

### Notifications Not Showing
1. Check browser console for API errors
2. Verify `NEXT_PUBLIC_API_URL` in `.env.development` or `.env.production`
3. Check backend endpoint returns correct format
4. Verify authentication cookies are sent (`credentials: 'include'`)

### Badge Count Incorrect
1. Check backend returns correct `unreadCount`
2. Verify marking as read calls succeed
3. Check for race conditions in polling

### Navigation Not Working
1. Verify role is correctly set in session
2. Check `actionUrl` or `bookingId` in notification object
3. Verify routes exist for all user roles

## Environment Variables

Add to `.env.development` and `.env.production`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000  # or your backend URL
```

## Browser Compatibility
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## Performance Considerations
- Polling interval: 30 seconds (configurable)
- Notifications cached in component state
- API calls only when component mounted
- Lightweight UI updates

## Future Enhancements
- [ ] WebSocket for real-time push notifications
- [ ] Browser push notifications (when page not open)
- [ ] Email notifications for important events
- [ ] Notification preferences/settings
- [ ] Sound alerts for high-priority notifications
- [ ] Desktop notifications via Notification API
- [ ] Notification history page with search
- [ ] Filter notifications by type/date

## Support
For issues or questions about the notification system, please refer to:
- This README
- `BACKEND_NOTIFICATION_API_SPEC.md` for backend details
- Component source code with inline comments
