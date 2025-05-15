"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import BookingStatusCard from "@/components/dashboard/stats/BookingStatusCard";
import { Check } from "lucide-react";



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
    totalBookings: 0,
    activeBookings: 0
  });

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings with session:', session);
      
      const response = await fetch('http://localhost:3000/api/bookings', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 401) {
        // Handle unauthorized (session likely expired)
        throw new Error('Session expired. Please login again.');
      }
      
      const data = await response.json();
      console.log('Bookings data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!session) {
          throw new Error('No active session found');
        }
        
        const data = await fetchBookings();
        setBookings(data.bookings);
        
        setStats({
          totalBookings: data.pagination.total,
          activeBookings: data.bookings.filter(
            (b: any) => !['COMPLETED', 'CANCELLED'].includes(b.status)
          ).length
        });
      } catch (err) {
        console.error('Loading error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [status, session]);

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
        <BookingStatusCard />

    {/* Booking Status */}
    

    {/* Stats */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500">Total Bookings</div>
        <div className="text-xl font-semibold">{stats.totalBookings}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500">Active Bookings</div>
        <div className="text-xl font-semibold">{stats.activeBookings}</div>
      </div>
    </div>

    {/* Recent Bookings */}
    <h2 className="text-lg font-semibold">My Bookings</h2>

    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photographer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4">
                  <div className="text-sm underline text-[#0D4835]">
                    {booking.buildingName}, {booking.street}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(booking.appointmentDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {booking.package.name}
                    {booking.addOns.length > 0 && (
                      <span className="ml-1">
                        {booking.addOns.map((addon:any) => {
                          if (addon.name.includes('Photo')) return '📸';
                          if (addon.name.includes('Video')) return '🎥';
                          return '✨';
                        }).join(' ')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    AED {booking.package.price + 
                        booking.addOns.reduce((sum:any, addon:any) => sum + addon.price, 0)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {booking.photographer?.firstname || 'Not assigned'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 rounded-full ${getStatusColor(booking.status)}`}>
                    {formatStatus(booking.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}