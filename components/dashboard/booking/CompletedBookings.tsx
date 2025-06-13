"use client";
import React from 'react';

const completedBookings = [
  {
    id: 3,
    location: 'Desert Safari',
    dateTime: new Date().toISOString(),
    price: 150.0,
    package: 'Adventure',
    customer: 'David Lee',
  },
  {
    id: 4,
    location: 'Atlantis The Palm',
    dateTime: new Date().toISOString(),
    price: 199.5,
    package: 'Luxury',
    customer: 'Emma Johnson',
  },
];

const CompletedBookings = () => (
  <div>
    <h2 className="text-lg font-semibold">Completed Bookings</h2>
    <div className="bg-white rounded-lg shadow mt-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {completedBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.id}</td>
                <td className="px-6 py-4">
                  <a href="#" className="text-sm underline text-[#0D4835]">{booking.location}</a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(booking.dateTime).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">AED {booking.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.package}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default CompletedBookings;
