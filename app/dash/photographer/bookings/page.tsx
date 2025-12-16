'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import BookingsTable from '@/components/shared/bookingsTable';

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  photographerId: string | null;
  status: "BOOKING_CREATED" |"PHOTOGRAPHER_ASSIGNED"| "SHOOTING" | "EDITING" | "COMPLETED" | "CANCELLED";
  packageId: number;
  propertyType: string;
  propertySize: string;
  buildingName: string;
  unitNumber: string;
  floor: string;
  street: string;
  villaNumber: string | null;
  company: string | null;
  appointmentDate: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  additionalDirections: string | null;
  additionalRequests: string | null;
  additionalInfo: string | null;
  isPaid: boolean;

  // relations
  package: {
    id: number;
    name: string;
    price: number;
    description: string;
    features: string[];
    pricePerExtra: number;
  };

  addOns: {
    id: string;
    name: string;
    price: number;
    addonId: string;
    bookingId: string;
  }[];

  client: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };

  photographer: {
    id: string;
    firstname: string;
    lastname: string;
    email?: string;
  } | null;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');


  const fetchBookings = async () => {
    if (requestInProgress.current) return;
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
      requestInProgress.current = false;
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status]);

  const pendingBookings = bookings.filter(booking => booking.status === 'EDITING');
  const upcomingBookings = bookings.filter(booking => booking.status !== "COMPLETED");
  const completedBookings = bookings.filter(booking => booking.status === "COMPLETED");


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
      <div className="w-full bg-white">
        <div className="flex w-full border-b border-gray-200">
          {['pending', 'upcoming', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as 'pending' | 'upcoming' | 'completed')}
              className={`flex-1 px-4 py-3 text-center text-sm font-medium ${
                selectedTab === tab
                  ? 'border-b-2 border-black text-black bg-white'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {tab === 'pending' ? 'Pending Upload' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === 'pending' && <BookingsTable title="Pending Upload" bookings={pendingBookings} />}
      {selectedTab === 'upcoming' && <BookingsTable title="Upcoming Bookings" bookings={upcomingBookings} />}
      {selectedTab === 'completed' && <BookingsTable title="Completed Bookings" bookings={completedBookings} />}
    </div>
  );
}