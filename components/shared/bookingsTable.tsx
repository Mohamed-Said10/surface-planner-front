"use client";
import React from "react";

interface Booking {
  id: number;
  location: string;
  dateTime: string;
  price: number;
  package: string;
  customer: string;
}

interface BookingsTableProps {
  title: string;
  bookings: Booking[];
}

const bookingsTable: React.FC<BookingsTableProps> = ({ title, bookings }) => (
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
              <tr key={booking.id}>
                <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{booking.id}</td>
                <td className="px-6 py-4 text-sm border-r border-gray-200">
                  <a href="#" className="underline text-[#0D4835]">{booking.location}</a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                  {new Date(booking.dateTime).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">AED {booking.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">{booking.package}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default bookingsTable;