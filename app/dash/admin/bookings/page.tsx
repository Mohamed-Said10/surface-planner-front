'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import AdminBookingsTable from '@/components/shared/AdminBookingsTable';

export interface Booking {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  photographerId: string | null;
  status: "BOOKING_CREATED" | "PHOTOGRAPHER_ASSIGNED" | "SHOOTING" | "EDITING" | "COMPLETED" | "CANCELLED";
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
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

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

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'pending') {
      return booking.status === 'BOOKING_CREATED';
    } else if (activeTab === 'completed') {
      return booking.status === 'COMPLETED';
    } else {
      return booking.status !== 'COMPLETED' && booking.status !== 'BOOKING_CREATED';
    }
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
        <Button onClick={fetchBookings} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* TABS */}
<div className="flex w-full border-b">
  <button
    onClick={() => setActiveTab('pending')}
    className={`flex-1 px-4 py-2 font-medium text-sm text-center rounded-t ${
      activeTab === 'pending' ? 'border-b-2 border-black text-black' : 'text-gray-500'
    }`}
  >
    Pending Upload
  </button>
  <button
    onClick={() => setActiveTab('upcoming')}
    className={`flex-1 px-4 py-2 font-medium text-sm text-center rounded-t ${
      activeTab === 'upcoming' ? 'border-b-2 border-black text-black' : 'text-gray-500'
    }`}
  >
    Upcoming
  </button>
  <button
    onClick={() => setActiveTab('completed')}
    className={`flex-1 px-4 py-2 font-medium text-sm text-center rounded-t ${
      activeTab === 'completed' ? 'border-b-2 border-black text-black' : 'text-gray-500'
    }`}
  >
    Completed
  </button>
</div>


      {/* TABLE */}
      <AdminBookingsTable
        title=""
        bookings={filteredBookings}
        isSearchable={true}
      />
    </div>
  );
}
