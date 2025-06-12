"use client";
import React from "react";
import { useRouter } from "next/navigation";
import exp from "node:constants";

interface Booking {
  id: string;
  buildingName: string;
  appointmentDate: string;
  timeSlot: string;
  package: {
    name: string;
    price: number;
  };
  client: {
    firstname: string;
    lastname: string;
  };
}

interface BookingsTableProps {
  title: string;
  bookings: Booking[];
}

const BookingsTable: React.FC<BookingsTableProps> = ({ title, bookings }) => {
  const router = useRouter();

  const handleBookingClick = (bookingId: string) => {
  router.push(`/dash/photographer/booking-details/${bookingId}`);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="bg-white rounded-lg shadow mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr 
                  key={booking.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBookingClick(booking.id)}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                    {booking.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm border-r border-gray-200">
                    <span className="underline text-[#0D4835] hover:text-[#0D4835]/80">
                      {booking.buildingName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                    {new Date(booking.appointmentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {booking.timeSlot}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                    AED {booking.package.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                    {booking.package.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.client.firstname} {booking.client.lastname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );}

  export default BookingsTable;