"use client";
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import BookingsTable from '@/components/shared/bookingsTable';
import { BookingCalendar }  from '@/components/shared/bookingCalendar';
import { DollarSign, DollarCircle, CalendarDays, Star} from '@/components/icons';

// Import the Booking interface from your BookingsPage component
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

export default function HomePage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
    averageRating: 0
  });

  const requestInProgress = useRef(false);

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

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchBookings();
        if (!data) return;
        
        setBookings(data.bookings);
        
        // Calculate dynamic stats
        const activeBookings = data.bookings.filter(
          (booking: Booking) => !['COMPLETED', 'CANCELLED'].includes(booking.status)
        );
        
        const completedBookings = data.bookings.filter(
          (booking: Booking) => booking.status === 'COMPLETED'
        );
        
        const totalEarnings = completedBookings.reduce((sum: number, booking: Booking) => {
          const packagePrice = booking.package?.price || 0;
          const addOnsPrice = booking.addOns?.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0) || 0;
          return sum + packagePrice + addOnsPrice;
        }, 0);
        
        const pendingPayouts = activeBookings.reduce((sum: number, booking: Booking) => {
          if (booking.isPaid) return sum;
          const packagePrice = booking.package?.price || 0;
          const addOnsPrice = booking.addOns?.reduce((addOnSum, addOn) => addOnSum + addOn.price, 0) || 0;
          return sum + packagePrice + addOnsPrice;
        }, 0);
        
        setStats({
          activeBookings: activeBookings.length,
          totalEarnings: totalEarnings,
          pendingPayouts: pendingPayouts,
          averageRating: 4.8 // You can calculate this from actual ratings when available
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [status, session, fetchBookings]);

  // Filter bookings dynamically
  const upcomingBookings = bookings.filter(booking => booking.status !== "COMPLETED");
  const completedBookings = bookings.filter(booking => booking.status === "COMPLETED");

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

  const bookingsCal = [
  { title: "Booking Title", day: 1, startHour: 10, endHour: 12 },
  { title: "Booking Title", day: 3, startHour: 13, endHour: 14 },
  { title: "Booking Title", day: 5, startHour: 9, endHour: 11 },
];

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

  const acceptBookings = [
    {
      id: 1,
      address: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
      date: "Feb 13, 2025 3:40 am"
    },
    {
      id: 2,
      address: "103 Al Lu'lu Street, Jumeirah 3, Dubai", 
      date: "Feb 13, 2025 3:40 am"
    },
    {
      id: 3,
      address: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
      date: "Feb 13, 2025 3:40 am"
    }
  ];

  return (
  <div className="px-5 space-y-4">

    <div className="grid grid-cols-2 gap-4">
      {/* Accept Bookings Section */}
      <div className="bg-white rounded-xl border border-[#DBDCDF] divide-y divide-[#C3C5C9] px-2">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">Accept Bookings</h2>
      </div>
      
      <div className="px-4">
        <div className="divide-y divide-[#F1F1F2]">
          {acceptBookings.map((booking, index) => (
            <div key={booking.id} className="flex items-center justify-between py-4">
              <div className="flex-1">
                <button className="text-left">
                  <p className="text-[#0D4835] text-sm underline hover:text-gray-600 transition-colors">{booking.address}</p>
                </button>
                <p className="text-xs text-[#646973] mt-1">{booking.date}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="px-4 py-2 text-sm font-medium text-[#AA3028] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_2px_4px_0_#DBDCDF]">
                  Reject
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#12B76A] rounded-lg hover:bg-green-700 transition-colors shadow-[0_2px_4px_0_#DBDCDF]">
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-[#DBDCDF] p-4 gap-1">
          <div className="p-3 border border-[#DBDCDF] rounded-md w-fit mb-2">
            <CalendarDays color="#0D824B" size={25} />
          </div>
          <div>
            <div className="text-xs text-[#515662]">Active Bookings</div>
            <div className="text-xl text-[#101828] font-semibold">4</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[#DBDCDF] p-4 gap-1">
          <div className="p-3 border border-[#DBDCDF] rounded-md w-fit mb-2">
            <DollarCircle color="#515662" size={25} />
          </div>
          <div>
            <div className="text-xs text-[#515662]">Total Earnings</div>
            <div className="text-xl text-[#101828] font-semibold">AED 540</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#DBDCDF] p-4 gap-1">
          <div className="p-3 border border-[#DBDCDF] rounded-md w-fit mb-2">
            <DollarSign color="#CC3A30" size={25} />
          </div>
          <div>
            <div className="text-xs text-[#515662]">Pending Payouts</div>
            <div className="text-xl text-[#101828] font-semibold">AED 270</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#DBDCDF] p-4 gap-1">
          <div className="p-3 border border-[#DBDCDF] rounded-md w-fit mb-2">
            <Star size={25} />
          </div>
          <div>
            <div className="text-xs text-[#515662]">Average Ratings</div>
            <div className="text-xl text-[#101828] font-semibold">4.7</div>
          </div>
        </div>
      </div>
      
    </div>

    <BookingCalendar bookings={bookingsCal} />

      {/* Upcoming Bookings */}
      <BookingsTable title="Upcoming Bookings" bookings={upcomingBookings} />

      {/* Completed Bookings */}
      <BookingsTable title="Completed Bookings" bookings={completedBookings} />
    </div>
  );
}