'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import UpComingBookings from '@/components/dashboard/booking/UpComingBookings';
import CompletedBookings from '@/components/dashboard/booking/CompletedBookings';

interface Booking {
  id: string;
  buildingName: string;
  street: string;
  appointmentDate: string;
  package: {
    name: string;
    price: number;
  };
  addOns: Array<{
    name: string;
    price: number;
  }>;
  photographer: {
    firstname: string;
    lastname: string;
  } | null;
  status: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const requestInProgress = useRef(false);

  const fetchBookings = async () => {
    
    if (requestInProgress.current) return; // Skip if already fetching
    requestInProgress.current = true;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status]);

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.buildingName?.toLowerCase().includes(searchLower) ||
      booking.street.toLowerCase().includes(searchLower) ||
      booking.package.name.toLowerCase().includes(searchLower) ||
      (booking.photographer && 
        `${booking.photographer.firstname} ${booking.photographer.lastname}`
          .toLowerCase().includes(searchLower)) ||
      booking.status.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Button 
          onClick={fetchBookings}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Recent UpComing Bookings */}
    <UpComingBookings />

    {/* Recent Completed Bookings */}
    <CompletedBookings />
    </div>
  );
}