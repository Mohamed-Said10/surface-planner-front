'use client';
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { Search } from '@/components/icons';
import { Photo, Video, Virtual } from '@/components/icons/addOns';

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
      case "booking_created":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "shoot_done":
      case "shoot done":
      case "booking_created":
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
    <div className="p-4">
      <div className="bg-white overflow-hidden rounded-lg border border-[#E0E0E0]">
        <div className="p-4 border-b flex justify-between items-center bg-[#F5F6F6]">
          <div className="relative mb-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[#93979E] pointer-events-none">
              <Search size={20} className="mr-2" />
            </span>
            <Input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md pl-10 placeholder:text-base placeholder:text-[#93979E] focus-visible:ring-0 focus-visible:ring-offset-0 border-0 shadow-none"
            />
          </div>
          <Button 
            onClick={fetchBookings}
            variant="outline"
            size="sm"
            disabled={true}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-[38%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Booking</th>
                <th className="w-[18%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Package</th>
                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Price</th>
                <th className="w-[17%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Photographer</th>
                <th className="w-[12%] px-6 py-3 text-center text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-[#E0E0E0]">
                    <td className="w-[38%] px-6 py-4 border-r border-[#E0E0E0]">
                      <Link href={`/dash/client/booking-details/${booking.id}`}
                        className="text-sm underline text-[#0D4835]"
                      >
                        {booking.buildingName}, {booking.street}
                      </Link>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.appointmentDate)}
                      </div>
                    </td>
                    <td className="w-[18%] px-6 py-4 border-r border-[#E0E0E0] align-middle">
                      <div className="flex items-center text-sm text-[#515662]">
                        <span className="truncate">{booking.package.name}</span>
                        {booking.addOns.length > 0 && (
                          <span className="flex items-center gap-1 ml-1 shrink-0">
                            <span className="relative text-xl mb-1 font-extralight">+</span>
                            {booking.addOns.map((addon: any, index: any) => {
                              if (addon.name.includes('Photo')) return <Photo key={index} />;
                              if (addon.name.includes('Video')) return <Video key={index} />;
                              if (addon.name.includes('Virtual')) return <Virtual key={index} />;
                            })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="w-[15%] px-6 py-4 border-r border-[#E0E0E0]">
                      <div className="text-sm text-[#515662]">
                        AED {booking.package.price + 
                            booking.addOns.reduce((sum, addon) => sum + addon.price, 0)}
                      </div>
                    </td>
                    <td className="w-[17%] px-6 py-4 border-r border-[#E0E0E0]">
                      <div className="text-sm text-[#515662] truncate">
                        {booking.photographer ? 
                          `${booking.photographer.firstname} ${booking.photographer.lastname}` : 
                          'Not assigned'}
                      </div>
                    </td>
                    <td className="w-[12%] px-3 py-4 border-r border-[#E0E0E0]">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 rounded-full ${getStatusColor(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 border-r border-[#E0E0E0]">
                    {searchTerm ? 'No matching bookings found' : 'No bookings available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}