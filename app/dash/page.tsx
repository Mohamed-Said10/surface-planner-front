'use client'

import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Camera, Video, Home, Settings, HelpCircle, LogOut, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

/*const bookings = [
  {
    id: 1,
    location: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
    date: "Feb 13, 2025 3:40 am",
    package: "Gold",
    addons: ["📸", "🎥", "🚗"],
    price: "AED 2500.00",
    photographer: "Theresa Webb",
    status: "Shoot done"
  },
  {
    id: 2,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 21, 2025 8:23 pm",
    package: "Silver",
    addons: [],
    price: "AED 180.00",
    photographer: "Courtney Henry",
    status: "Completed"
  },
  {
    id: 3,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Mar 4, 2025 12:06 am",
    package: "Diamond",
    addons: ["🚗"],
    price: "AED 220.00",
    photographer: "Wade Warren",
    status: "Scheduled"
  }
];*/

export default function HomePage() {

  const [searchTerm, setSearchTerm] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingCount, setBookingCount] = useState("");
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
          setBookingCount(data.pagination.total.toString());
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

    

  const stats = {
    totalBookings: bookingCount,
    activeBookings: bookings.filter(booking => booking.status.toLowerCase() === "scheduled").length,
  };
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "shoot done":
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

  return (



    <div className="p-4 space-y-4">
      {/* Booking Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-semibold mb-6">Booking#{bookingStatus.id} Status</h2>
        <div className="relative grid justify-between grid-cols-5">
          {bookingStatus.steps.map((step, index) => (
            <div key={index} className="col-span-1 flex flex-col items-left text-left relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 
              ${step.completed ? 'bg-emerald-500' : step.inProgress ? 'bg-orange-500' : 'bg-gray-200'}`}>
                {step.completed ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div className="text-xs font-medium">{step.label}</div>
              <div className="text-xs text-gray-500">{step.date}</div>
            </div>
          ))}
          {/* Progress Lines */}
          <div className="absolute top-3 left-0 w-full h-[2px] flex">
            <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
            <div className="h-full bg-orange-500" style={{ width: '15%' }} />
            <div className="h-full bg-gray-200" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

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