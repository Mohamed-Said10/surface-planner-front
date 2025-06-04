'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Video, Box, Home, Settings, HelpCircle, LogOut } from "lucide-react";

const projects = [
  {
    id: 1,
    location: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
    date: "Feb 13, 2025 3:40 am",
    package: "Gold",
    addons: ["📸", "🎥", "🚗"],
    price: "AED 250.00",
    photographer: "Theresa Webb",
    status: "Shoot done"
  },
  {
    id: 2,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 21, 2025 8:23 pm",
    package: "Silver",
    addons: [],
    price: "AED 250.00",
    photographer: "Courtney Henry",
    status: "Completed"
  },
  {
    id: 3,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Mar 4, 2025 12:06 am",
    package: "Diamond",
    addons: ["🚗"],
    price: "AED 250.00",
    photographer: "Wade Warren",
    status: "Scheduled"
  },
  {
    id: 4,
    location: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
    date: "Feb 11, 2025 7:15 pm",
    package: "Diamond",
    addons: [],
    price: "AED 250.00",
    photographer: "Esther Howard",
    status: "Canceled"
  },
  {
    id: 5,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Feb 15, 2025 10:48 pm",
    package: "Gold",
    addons: [],
    price: "AED 250.00",
    photographer: "Guy Hawkins",
    status: "Shoot done"
  },
  {
    id: 6,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 8, 2025 8:20 am",
    package: "Diamond",
    addons: [],
    price: "AED 250.00",
    photographer: "Devon Lane",
    status: "Completed"
  },
  {
    id: 7,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Feb 12, 2025 12:09 pm",
    package: "Silver",
    addons: ["📸"],
    price: "AED 250.00",
    photographer: "Arlene McCoy",
    status: "Scheduled"
  },
  {
    id: 8,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 14, 2025 5:15 am",
    package: "Silver",
    addons: [],
    price: "AED 250.00",
    photographer: "Bessie Cooper",
    status: "Canceled"
  },
  {
    id: 9,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Feb 2, 2025 8:54 pm",
    package: "Gold",
    addons: [],
    price: "AED 250.00",
    photographer: "Brooklyn Simmons",
    status: "Shoot done"
  }
];

export default function CompletedPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "shoot done":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text[#0D4835]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photographer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((booking, index) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <a href={`/dash/project-details/${index}`} className="text-sm underline text-[#0D4835]">{booking.location}</a>
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
                    <div className="flex justify-between gap-4">
                      <a className='flex flex-col items-center underline cursor-pointer text-sm text-gray-900'>
                        <Camera className="h-4 w-4" />
                        <span>View</span>
                      </a>
                      <a className='flex flex-col items-center underline cursor-pointer text-sm text-gray-900'>
                        <Camera className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    </div>
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