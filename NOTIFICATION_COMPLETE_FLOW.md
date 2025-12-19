1. CLIENT CREATES BOOKING
   ↓
2. SummaryStep.tsx calls BookingNotificationService.notifyAdminOfNewBooking()
   ↓
3. Frontend sends POST to /api/notifications/booking-created
   ↓
4. Backend creates notification with userId = adminId
   ↓
5. Database stores notification with isRead = false
   ↓
6. Admin's NotificationBell polls every 30s
   ↓
7. Admin sees bell badge: 🔔(1)
   ↓
8. Admin clicks notification
   ↓
9. Frontend navigates to booking-details
   ↓
10. Admin assigns photographer
    ↓
11. Frontend calls notifyPhotographerOfAssignment()
    ↓
12. Backend creates notification with userId = photographerId
    ↓
13. Photographer sees bell badge: 🔔(1)
    ↓
14. Photographer uploads work
    ↓
15. Frontend calls notifyClientWorkCompleted()
    ↓
16. Backend creates notification with userId = clientId
    ↓
17. Client sees bell badge: 🔔(1)

# Real-Time Notification Flow

## How It Works

The system uses **Server-Sent Events (SSE)** for real-time notifications. Each user maintains an open SSE connection to the backend, and notifications are pushed instantly without polling.

---

## Flow 1: Client Creates Booking → Admin Notified

1. **CLIENT CREATES BOOKING**
   - SummaryStep.tsx calls `BookingNotificationService.notifyAdminOfNewBooking()`
   
2. **FRONTEND → BACKEND**
   - Sends POST to `/api/notifications/booking-created`
   
3. **BACKEND**
   - Creates notification in Supabase with `userId = adminId`
   - Supabase real-time triggers INSERT event
   
4. **REAL-TIME UPDATE**
   - SSE stream sends `notification` event to admin's browser
   - Admin's NotificationBell receives update instantly ⚡
   - Bell badge updates: 🔔(1)
   
5. **ADMIN CLICKS NOTIFICATION**
   - Frontend navigates to booking-details
   - Sends PATCH to `/api/notifications/{id}/read`
   - Supabase triggers UPDATE event
   - Bell badge updates in real-time

---

## Flow 2: Admin Assigns Photographer → Photographer Notified

1. **ADMIN ASSIGNS PHOTOGRAPHER**
   - booking-details page calls `notifyPhotographerOfAssignment()`
   
2. **FRONTEND → BACKEND**
   - Sends POST to `/api/notifications/photographer-assigned`
   
3. **BACKEND**
   - Creates notification with `userId = photographerId`
   
4. **REAL-TIME UPDATE**
   - Photographer's SSE stream receives notification instantly ⚡
   - Bell badge appears: 🔔(1)

---

## Flow 3: Photographer Uploads Work → Client Notified

1. **PHOTOGRAPHER UPLOADS WORK**
   - upload-work.tsx calls `notifyClientWorkCompleted()`
   
2. **FRONTEND → BACKEND**
   - Sends POST to `/api/notifications/work-completed`
   
3. **BACKEND**
   - Creates notification with `userId = clientId`
   
4. **REAL-TIME UPDATE**
   - Client's SSE stream receives notification instantly ⚡
   - Bell badge appears: 🔔(1)

---

## Technical Details

### Frontend (Real-Time Connection)
- **Hook**: `useRealtimeNotifications()` in `hooks/useRealtimeNotifications.ts`
- **Connection**: SSE to `/api/notifications/stream`
- **Events Handled**:
  - `notification` - New notification created
  - `notification-update` - Notification marked as read
  - `notification-delete` - Notification deleted
  - `heartbeat` - Keep connection alive

### Backend (SSE Endpoint)
- **Endpoint**: `GET /api/notifications/stream`
- **Authentication**: Uses NextAuth session
- **Real-Time Source**: Supabase `postgres_changes` events
- **Events Sent**: INSERT, UPDATE, DELETE on Notification table

### No Polling!
- Old system: Polled every 30 seconds ❌
- New system: Real-time updates via SSE ✅
- Benefit: Instant notifications, reduced server load