'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import BookingsTable from '@/components/shared/bookingsTable';

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

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Upcoming Bookings */}
      <BookingsTable title="Upcoming Bookings" bookings={upcomingBookings} />

      {/* Completed Bookings */}
      <BookingsTable title="Completed Bookings" bookings={completedBookings} />
    </div>
  );
}