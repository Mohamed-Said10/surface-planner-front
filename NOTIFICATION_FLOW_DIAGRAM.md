# Notification System - Visual Flow Summary

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION FLOW DIAGRAM                     │
└─────────────────────────────────────────────────────────────────┘

         CLIENT                   ADMIN                PHOTOGRAPHER
           │                        │                        │
           │                        │                        │
    1. Creates Booking             │                        │
           │─────────────────────► │                        │
           │                    2. Gets Notification        │
           │                        │                        │
           │                    3. Reviews Booking          │
           │                        │                        │
           │                    4. Assigns Photographer     │
           │                        │───────────────────────►│
           │                        │              5. Gets Notification
           │                        │                        │
           │                        │              6. Reviews & Accepts
           │                        │                        │
           │◄───────────────────────┼────────────────────────│
           │           7. Both get status update notifications
           │                        │                        │
```

## 📱 Notification Types & Recipients

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NOTIFICATION TYPE          │  TRIGGERED BY  │  NOTIFIES               │
├─────────────────────────────────────────────────────────────────────────┤
│  BOOKING_CREATED            │  Client        │  → All Admins           │
│  PHOTOGRAPHER_ASSIGNED      │  Admin         │  → Assigned Photographer│
│  PHOTOGRAPHER_ACCEPTED      │  Photographer  │  → Admin & Client       │
│  PHOTOGRAPHER_REJECTED      │  Photographer  │  → All Admins           │
│  STATUS_CHANGE              │  Any           │  → Relevant Parties     │
│  MESSAGE                    │  Any           │  → Recipient            │
│  PAYMENT                    │  System        │  → Relevant Parties     │
│  BOOKING_CANCELLED          │  Any           │  → All Parties          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Detailed Flow: New Booking

```
STEP 1: CLIENT CREATES BOOKING
┌────────────────────────────────────────────┐
│  Client fills out booking form            │
│  - Property details                        │
│  - Package selection                       │
│  - Date & time                            │
│  - Personal details                        │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│  SummaryStep.tsx                          │
│  handleSubmit() called                     │
│  → POST /api/bookings                     │
│  → BookingNotificationService             │
│     .notifyAdminOfNewBooking()           │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│  BACKEND CREATES NOTIFICATION              │
│  For each admin:                           │
│  - type: BOOKING_CREATED                  │
│  - title: "New Booking Request"           │
│  - priority: HIGH                          │
│  - bookingId: xyz                         │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
STEP 2: ADMIN SEES NOTIFICATION
┌────────────────────────────────────────────┐
│  NotificationBell.tsx                      │
│  - Badge shows "1" unread                 │
│  - Polls every 30s                        │
│  - Displays: "New Booking Request"        │
│  - Icon: 📅                               │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│  Admin clicks notification                 │
│  → Navigates to booking details           │
│  → Notification marked as read            │
│  → Badge count decrements                 │
└────────────────────────────────────────────┘
```

## 🔄 Detailed Flow: Photographer Assignment

```
STEP 1: ADMIN ASSIGNS PHOTOGRAPHER
┌────────────────────────────────────────────┐
│  Admin in booking details page            │
│  /dash/admin/booking-details/[id]         │
│  - Clicks "Assign Photographer"           │
│  - Selects photographer from dropdown     │
│  - Confirms assignment                    │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│  page.tsx (booking-details)               │
│  handleAssign() called                     │
│  → POST /api/bookings/:id/assign          │
│  → BookingNotificationService             │
│     .notifyPhotographerOfAssignment()     │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│  BACKEND CREATES NOTIFICATION              │
│  For assigned photographer:                │
│  - type: PHOTOGRAPHER_ASSIGNED            │
│  - title: "New Booking Assignment"        │
│  - priority: HIGH                          │
│  - bookingId: xyz                         │
│  - metadata: { clientName, bookingRef }   │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
STEP 2: PHOTOGRAPHER SEES NOTIFICATION
┌────────────────────────────────────────────┐
│  NotificationBell.tsx                      │
│  - Badge shows "1" unread                 │
│  - Displays: "New Booking Assignment"     │
│  - Icon: 📸                               │
│  - Message: "You have been assigned..."   │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│  Photographer clicks notification          │
│  → Navigates to booking details           │
│  → Can accept or reject booking           │
│  → Notification marked as read            │
└────────────────────────────────────────────┘
```

## 🗂️ File Architecture

```
surface-planner-front/
│
├── components/
│   ├── types/
│   │   └── notification.ts ...................... Notification TypeScript types
│   │                                              - NotificationType enum
│   │                                              - Notification interface
│   │                                              - notificationConfig
│   │                                              - generateNotificationContent()
│   │
│   ├── dashboard/
│   │   └── header/
│   │       └── NotificationBell.tsx ............. Main notification UI component
│   │                                              - Bell icon with badge
│   │                                              - Notification dropdown
│   │                                              - Mark as read functionality
│   │                                              - Auto-refresh every 30s
│   │
│   └── website/
│       └── steps-form/
│           └── SummaryStep.tsx .................. Booking form submission
│                                                  - Creates booking
│                                                  - Triggers admin notification
│
├── app/
│   └── dash/
│       └── admin/
│           └── booking-details/
│               └── [id]/
│                   └── page.tsx ................. Booking details page
│                                                  - Assign photographer
│                                                  - Trigger photographer notification
│
├── helpers/
│   └── notification.service.ts .................. API service layer
│                                                  - NotificationService class
│                                                  - BookingNotificationService class
│                                                  - All API call methods
│
├── BACKEND_NOTIFICATION_API_SPEC.md ............. Complete backend specification
│                                                  - Database schema
│                                                  - All API endpoints
│                                                  - Implementation examples
│
├── NOTIFICATION_SYSTEM_README.md ................ Complete documentation
│                                                  - Features overview
│                                                  - Usage guide
│                                                  - Customization
│                                                  - Troubleshooting
│
└── BACKEND_QUICK_START.md ....................... Quick backend guide
                                                   - Essential requirements
                                                   - Code examples
                                                   - Testing guide
```

## 🎨 UI Components

```
┌─────────────────────────────────────────────────────────────┐
│  NOTIFICATION BELL (Top Right of Dashboard)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   🔔  ①  ← Bell icon with unread badge                      │
│                                                               │
│   Click to open dropdown ▼                                  │
│                                                               │
│   ┌───────────────────────────────────────────────────┐    │
│   │  Notifications        [Mark all as read]          │    │
│   ├───────────────────────────────────────────────────┤    │
│   │  📅 New Booking Request           •  5m ago       │    │
│   │  John Doe has created a new booking...            │    │
│   ├───────────────────────────────────────────────────┤    │
│   │  📸 Photographer Assigned            2h ago       │    │
│   │  You have been assigned to booking...             │    │
│   ├───────────────────────────────────────────────────┤    │
│   │  ✅ Photographer Accepted            1d ago       │    │
│   │  Jane Smith has accepted the booking...           │    │
│   ├───────────────────────────────────────────────────┤    │
│   │              [View all notifications]              │    │
│   └───────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Legend:
• Blue dot = Unread notification
Blue background = Unread notification
Gray background = Read notification
```

## 🔌 API Endpoints Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│  METHOD  │  ENDPOINT                              │  PURPOSE          │
├──────────────────────────────────────────────────────────────────────┤
│  GET     │  /api/notifications                    │  Get all          │
│  GET     │  /api/notifications/unread-count       │  Get count        │
│  PATCH   │  /api/notifications/:id/read           │  Mark one read    │
│  PATCH   │  /api/notifications/mark-all-read      │  Mark all read    │
│  DELETE  │  /api/notifications/:id                │  Delete one       │
│  POST    │  /api/notifications                    │  Create (generic) │
│  POST    │  /api/notifications/booking-created    │  Notify admin     │
│  POST    │  /api/notifications/photographer-      │  Notify photog    │
│          │    assigned                            │                   │
│  POST    │  /api/notifications/booking-accepted   │  Notify accept    │
│  POST    │  /api/notifications/booking-rejected   │  Notify reject    │
│  POST    │  /api/notifications/status-change      │  Notify status    │
└──────────────────────────────────────────────────────────────────────┘
```

## 💾 Database Schema

```sql
┌────────────────────────────────────────────────────────────┐
│  TABLE: notifications                                      │
├────────────────────────────────────────────────────────────┤
│  id               VARCHAR(36)    PRIMARY KEY               │
│  type             ENUM           NOT NULL                  │
│  title            VARCHAR(255)   NOT NULL                  │
│  message          TEXT           NOT NULL                  │
│  priority         ENUM           DEFAULT 'MEDIUM'          │
│  is_read          BOOLEAN        DEFAULT FALSE             │
│  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP │
│  updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP │
│  recipient_id     VARCHAR(36)    FK → users.id             │
│  sender_id        VARCHAR(36)    FK → users.id (NULLABLE)  │
│  booking_id       VARCHAR(36)    FK → bookings.id (NULLABLE)│
│  metadata         JSON           (NULLABLE)                │
│  action_url       VARCHAR(255)   (NULLABLE)                │
└────────────────────────────────────────────────────────────┘

INDEXES:
- idx_recipient_read (recipient_id, is_read)
- idx_created_at (created_at DESC)
- idx_booking_id (booking_id)
```

## ⚡ Performance Considerations

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
├─────────────────────────────────────────────────────────────┤
│  ✓ Polling interval: 30 seconds (configurable)             │
│  ✓ Component-level caching (useState)                       │
│  ✓ Lazy loading of notification dropdown                    │
│  ✓ Optimistic UI updates for mark as read                  │
│  ✓ Debounced API calls                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  BACKEND (RECOMMENDED)                                       │
├─────────────────────────────────────────────────────────────┤
│  ✓ Database indexes on recipient_id and is_read            │
│  ✓ Limit query results (default: 50)                        │
│  ✓ Pagination for large notification lists                  │
│  ✓ Cache unread counts in Redis (optional)                 │
│  ✓ Bulk insert for multiple notifications                   │
│  ✓ Archive old notifications (> 90 days)                   │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing Checklist

```
□ CLIENT CREATES BOOKING
  □ Admin receives notification
  □ Badge count increases
  □ Notification appears in dropdown
  □ Correct icon and message displayed

□ ADMIN ASSIGNS PHOTOGRAPHER
  □ Photographer receives notification
  □ Badge count increases
  □ Click notification navigates to booking details
  □ Notification marked as read after click

□ MARK AS READ
  □ Single notification can be marked read
  □ "Mark all as read" works
  □ Badge count updates correctly
  □ UI reflects read state (no blue dot)

□ NAVIGATION
  □ Clicking notification navigates correctly for each role
  □ URLs are correct for admin/photographer/client
  □ Page opens with correct booking details

□ EDGE CASES
  □ No notifications shows empty state
  □ Multiple rapid bookings handled correctly
  □ Old notifications persist after page refresh
  □ Logout/login preserves notifications
```

## 🚀 Deployment Checklist

```
□ FRONTEND
  □ Environment variable NEXT_PUBLIC_API_URL set correctly
  □ NotificationBell component in header
  □ All notification triggers implemented
  □ Error handling in place

□ BACKEND
  □ Database table created with indexes
  □ All 11 API endpoints implemented
  □ Authentication middleware on all routes
  □ Authorization checks (users see only their notifications)
  □ Input validation
  □ Error handling and logging

□ TESTING
  □ Unit tests for NotificationService
  □ Integration tests for API endpoints
  □ E2E tests for booking flow
  □ Load testing for notification system

□ MONITORING
  □ Log notification creation
  □ Track notification delivery rate
  □ Monitor API response times
  □ Alert on failed notifications
```

## 📊 Success Metrics

```
✓ Admin notified within 1 second of booking creation
✓ Photographer notified within 1 second of assignment
✓ 99%+ notification delivery rate
✓ < 500ms API response time
✓ Zero notification loss
✓ User engagement with notifications > 80%
```

---

**All files are ready!** The frontend implementation is complete. Send the backend specification files to your backend AI and the system will be fully operational once the backend is implemented.
