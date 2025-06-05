"use client";
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import BookingsTable from '@/components/shared/bookingsTable';
import { DollarSign, DollarCircle, CalendarDays, Star} from '@/components/icons';

const bookingStatus = {
  id: "1279486",
  steps: [
    { label: "Booking Requested", date: "May 5, 5:54 AM", completed: true },
    { label: "Photographer Assigned", date: "May 5, 8:54 AM", completed: true },
    { label: "Shoot in Progress", date: "May 5, 8:54 AM", completed: true },
    { label: "Editing", date: "Currently", completed: false, inProgress: true },
    { label: "Order Delivery", date: "Expected May 8, 2025", completed: false }
  ]
};

const upcomingBookings = [
  {
    id: 1,
    location: "Dubai Marina",
    dateTime: new Date().toISOString(),
    price: 120.5,
    package: "Premium",
    customer: "John Doe",
  },
  {
    id: 2,
    location: "Burj Khalifa",
    dateTime: new Date().toISOString(),
    price: 99.9,
    package: "Standard",
    customer: "Alice Smith",
  },
];

const completedBookings = [
  {
    id: 3,
    location: "Desert Safari",
    dateTime: new Date().toISOString(),
    price: 150.0,
    package: "Adventure",
    customer: "David Lee",
  },
  {
    id: 4,
    location: "Atlantis The Palm",
    dateTime: new Date().toISOString(),
    price: 199.5,
    package: "Luxury",
    customer: "Emma Johnson",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    averageRating: 0
  });

  const requestInProgress = useRef(false); // Track ongoing requests

  const fetchBookings = useCallback(async () => {
    if (requestInProgress.current) return; // Skip if already fetching
    requestInProgress.current = true;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch bookings');
      
      return data;
    } finally {
      requestInProgress.current = false;
    }
  }, [session]);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchBookings();
        if (!data) return; // Skip if request was aborted
        
        setBookings(data.bookings);
        setStats({
          averageRating: data.pagination.total,
          pendingPayouts: data.pagination.total,
          totalEarnings: data.pagination.total,
          activeBookings: data.bookings.filter(
            (b: any) => !['COMPLETED', 'CANCELLED'].includes(b.status)
          ).length
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [status, session, fetchBookings]);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "booking_created":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "shoot_done":
      case "shoot in progress":
        return "bg-blue-100 text-blue-800";
      case "editing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
  <div className="p-4 space-y-4">

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <div className="p-3 border border-gray-200 rounded-md">
          <CalendarDays color="#0D824B" size={25} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Active Bookings</div>
          <div className="text-xl font-semibold">{stats.activeBookings}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <div className="p-3 border border-gray-300 rounded-md">
          <DollarCircle color="#515662" size={25} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Total Earnings</div>
          <div className="text-xl font-semibold">AED {stats.totalEarnings}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <div className="p-3 border border-gray-200 rounded-md">
          <DollarSign color="#CC3A30" size={25} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Pending Payouts</div>
          <div className="text-xl font-semibold">AED {stats.pendingPayouts}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <div className="p-3 border border-gray-200 rounded-md">
          <Star size={25} />
        </div>
        <div>
          <div className="text-xs text-gray-500">Average Ratings</div>
          <div className="text-xl font-semibold">{stats.averageRating}</div>
        </div>
      </div>
    </div>

    {/* Upcoming Bookings */}
    <BookingsTable title="Upcoming Bookings" bookings={upcomingBookings} />

    {/* Completed Bookings */}
    <BookingsTable title="Completed Bookings" bookings={completedBookings} />

  </div>
);
}