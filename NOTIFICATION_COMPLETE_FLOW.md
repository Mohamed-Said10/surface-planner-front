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