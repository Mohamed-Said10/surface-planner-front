import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Camera, Video, Home, Settings, HelpCircle, LogOut, Check } from "lucide-react";
import Booking from "../(website)/booking/page";
import BookingStatusCard from "@/components/dashboard/stats/BookingStatusCard";

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

const stats = {
  totalBookings: 54,
  activeBookings: 7
};

const bookings = [
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
];

export default function HomePage() {
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

  return (


    <div className="p-4 space-y-4">
      {/* Booking Status */}
     <BookingStatusCard />

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
                    <div className="text-sm underline text-[#0D4835]">{booking.location}</div>
                    <div className="text-xs text-gray-500">{booking.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {booking.package} {booking.addons.join(" ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{booking.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{booking.photographer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
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