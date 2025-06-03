"use client";

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import BookingStatusCard from "@/components/dashboard/stats/BookingStatusCard";
import { Check, CalendarDays, DollarSign, Wallet, Star } from "lucide-react"
import UpComingBookings from '@/components/dashboard/booking/UpComingBookings';
import CompletedBookings from '@/components/dashboard/booking/CompletedBookings';





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
        <CalendarDays className="text-green-600" size={20} />
        <div>
          <div className="text-xs text-gray-500">Active Bookings</div>
          <div className="text-xl font-semibold">{stats.activeBookings}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <DollarSign className="text-gray-600" size={20} />
        <div>
          <div className="text-xs text-gray-500">Total Earnings</div>
          <div className="text-xl font-semibold">AED {stats.totalEarnings}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <Wallet className="text-red-600" size={20} />
        <div>
          <div className="text-xs text-gray-500">Pending Payouts</div>
          <div className="text-xl font-semibold">AED {stats.pendingPayouts}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
        <Star className="text-yellow-500" size={20} />
        <div>
          <div className="text-xs text-gray-500">Average Ratings</div>
          <div className="text-xl font-semibold">{stats.averageRating}</div>
        </div>
      </div>
    </div>

    {/* Recent UpComing Bookings */}
    <UpComingBookings />

    {/* Recent Completed Bookings */}
    <CompletedBookings />

  </div>
);
}