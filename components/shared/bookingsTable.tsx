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
    <div className="bg-white rounded-lg mt-4">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-[#F5F6F6]">
              <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">ID</th>
              <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Booking</th>
              <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Date & Time</th>
              <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Price</th>
              <th className="p-4 text-sm font-medium text-gray-500 border-b border-r border-gray-200">Package</th>
              <th className="p-4 text-sm font-medium text-gray-500 border-b border-gray-200">Customer Name</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id} className={index !== bookings.length - 1 ? "border-b border-gray-200" : ""}>
                <td className="p-4 text-sm border-r border-gray-200">{booking.id}</td>
                <td className="p-4 text-sm border-r border-gray-200">
                  <a href="#" className="underline text-[#0D4835]">{booking.location}</a>
                </td>
                <td className="p-4 text-sm border-r border-gray-200">
                  {new Date(booking.dateTime).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="p-4 text-sm border-r border-gray-200">AED {booking.price.toFixed(2)}</td>
                <td className="p-4 text-sm border-r border-gray-200">{booking.package}</td>
                <td className="p-4 text-sm">{booking.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default bookingsTable;