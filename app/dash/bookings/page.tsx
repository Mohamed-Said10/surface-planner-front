'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Video, Box, Home, Settings, HelpCircle, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

interface Booking {
  id: string;
  buildingName: string;
  street: string;
  appointmentDate: string;
  package: {
    name: string;
    price: number; // ← add this
  };
  photographer?: {
    firstname: string;
    lastname: string;
  };
  status: string;
  addOns: {
    name: string;
    price: number; // ← add this if you use it
  }[];
}


interface ApiResponse {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/bookings', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data: ApiResponse = await response.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchBookings();
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "shoot done":
      case "booking_created":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLocation = (booking: Booking) => {
    return `${booking.buildingName}, ${booking.street}`;
  };

  const formatPrice = (price: number) => {
    console.log("price: ",price);
    return `AED ${price.toFixed(2)}`;
  };

  const formatPhotographerName = (booking: Booking) => {
    if (!booking.photographer) return "Not assigned";
    return `${booking.photographer.firstname} ${booking.photographer.lastname}`;
  };

  const filteredBookings = bookings.filter(booking => 
    formatLocation(booking).toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.package.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatPhotographerName(booking).toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-2"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <Input
            type="search"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

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
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4">
                      <a href={`/dash/booking-details/${booking.id}`} className="text-sm underline text-[#0D4835]">
                        {formatLocation(booking)}
                      </a>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.appointmentDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {booking.package.name}
                        {booking.addOns.length > 0 && (
                          <span className="ml-1">
                            {booking.addOns.map(addon => {
                              if (addon.name.includes('Photo')) return '📸';
                              if (addon.name.includes('Video')) return '🎥';
                              if (addon.name.includes('Car')) return '🚗';
                              return '';
                            }).join(' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatPrice(booking.package?.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatPhotographerName(booking)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 rounded-full ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {bookings.length === 0 ? 'No bookings found' : 'No matching bookings found'}
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