"use client";

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import BookingStatusCard from "@/components/dashboard/stats/BookingStatusCard";
import { Check } from "lucide-react";

interface StatusHistory {
  id: string;
  bookingId: string;
  userId: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

interface BookingStatus {
  id: string;
  steps: {
    label: string;
    date: string;
    completed: boolean;
    inProgress: boolean;
  }[];
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0
  });

  // États pour le booking status
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  const requestInProgress = useRef(false);
  const statusRequestMade = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const ignoreResponse = useRef(false);

  const fetchBookings = useCallback(async () => {
    if (requestInProgress.current) return;
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

  const transformStatusHistory = useCallback((apiData: {
    bookingId: string;
    statusHistory: StatusHistory[];
  }): BookingStatus => {
    const statusMap: Record<string, string> = {
      BOOKING_CREATED: "Booking Requested",
      PHOTOGRAPHER_ASSIGNED: "Photographer Assigned",
      SHOOTING: "Shoot in Progress",
      EDITING: "Editing",
      COMPLETED: "Order Delivery",
    };

    const allStatuses = [
      "BOOKING_CREATED",
      "PHOTOGRAPHER_ASSIGNED", 
      "SHOOTING",
      "EDITING",
      "COMPLETED",
    ];

    const sortedHistory = [...apiData.statusHistory].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const currentStatus = sortedHistory[0]?.status || "";
    const currentIndex = allStatuses.indexOf(currentStatus);
    const nextStepIndex = currentIndex + 1;

    const steps = allStatuses.map((status, index) => {
      const historyItem = sortedHistory.find((item) => item.status === status);
      const isCompleted = index <= currentIndex;
      const isInProgress = index === nextStepIndex;

      let date = "Pending";
      if (historyItem) {
        const dateObj = new Date(historyItem.createdAt);
        date = dateObj.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      } else if (status === "ORDER_DELIVERED" && currentIndex >= 3) {
        const editingStartItem = sortedHistory.find(
          (item) => item.status === "EDITING_IN_PROGRESS"
        );
        if (editingStartItem) {
          const deliveryDate = new Date(editingStartItem.createdAt);
          deliveryDate.setDate(deliveryDate.getDate() + 3);
          date = `Expected ${deliveryDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`;
        }
      }

      return {
        label: statusMap[status] || status,
        date,
        completed: isCompleted,
        inProgress: isInProgress,
      };
    });

    return {
      id: apiData.bookingId,
      steps,
    };
  }, []);

  const fetchStatusHistory = useCallback(async () => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    ignoreResponse.current = false;

    try {
      console.log("Starting fetch request");
      setStatusLoading(true);
      setStatusError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status-history/last`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal
        }
      );

      if (ignoreResponse.current) return;
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch status");
      }

      const data = await response.json();
      
      if (ignoreResponse.current) return;
      
      if (!data?.bookingId) {
        throw new Error("No booking data available");
      }

      const transformedData = transformStatusHistory(data);
      setBookingStatus(transformedData);
    } catch (err) {
      if (ignoreResponse.current) return;
      
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          setStatusError(err.message);
        }
      }
    } finally {
      if (!ignoreResponse.current) {
        setStatusLoading(false);
      }
    }
  }, [transformStatusHistory]);

  // Effect pour les bookings
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchBookings();
        if (!data) return;
        
        setBookings(data.bookings);
        setStats({
          totalBookings: data.pagination.total,
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

  // Effect pour le status history
  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    fetchStatusHistory();

    return () => {
      ignoreResponse.current = true;
      abortControllerRef.current?.abort();
    };
  }, [status, session, fetchStatusHistory]);

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
      <BookingStatusCard 
        bookingStatus={bookingStatus}
        loading={statusLoading}
        error={statusError}
        onRetry={fetchStatusHistory}
      />

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