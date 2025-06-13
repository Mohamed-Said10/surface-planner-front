"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera,
  Video,
  Box,
  Home,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

const projects = [
  {
    id: 1,
    location: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
    date: "Feb 13, 2025 3:40 am",
    package: "Gold",
    addons: ["📸", "🎥", "🚗"],
    price: "AED 250.00",
    photographer: "Theresa Webb",
    status: "Shoot done",
  },
  {
    id: 2,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 21, 2025 8:23 pm",
    package: "Silver",
    addons: [],
    price: "AED 250.00",
    photographer: "Courtney Henry",
    status: "Completed",
  },
  {
    id: 3,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Mar 4, 2025 12:06 am",
    package: "Diamond",
    addons: ["🚗"],
    price: "AED 250.00",
    photographer: "Wade Warren",
    status: "Scheduled",
  },
  {
    id: 4,
    location: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
    date: "Feb 11, 2025 7:15 pm",
    package: "Diamond",
    addons: [],
    price: "AED 250.00",
    photographer: "Esther Howard",
    status: "Canceled",
  },
  {
    id: 5,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Feb 15, 2025 10:48 pm",
    package: "Gold",
    addons: [],
    price: "AED 250.00",
    photographer: "Guy Hawkins",
    status: "Shoot done",
  },
  {
    id: 6,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 8, 2025 8:20 am",
    package: "Diamond",
    addons: [],
    price: "AED 250.00",
    photographer: "Devon Lane",
    status: "Completed",
  },
  {
    id: 7,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Feb 12, 2025 12:09 pm",
    package: "Silver",
    addons: ["📸"],
    price: "AED 250.00",
    photographer: "Arlene McCoy",
    status: "Scheduled",
  },
  {
    id: 8,
    location: "78 Maeen 1, The Lakes, Dubai",
    date: "Feb 14, 2025 5:15 am",
    package: "Silver",
    addons: [],
    price: "AED 250.00",
    photographer: "Bessie Cooper",
    status: "Canceled",
  },
  {
    id: 9,
    location: "39 Al Khalas - Frond B Street, Dubai",
    date: "Feb 2, 2025 8:54 pm",
    package: "Gold",
    addons: [],
    price: "AED 250.00",
    photographer: "Brooklyn Simmons",
    status: "Shoot done",
  },
];

export default function CompletedPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const requestInProgress = useRef(false);
  const { data: session, status } = useSession();

  const fetchBookings = async () => {
    if (requestInProgress.current) return; // Skip if already fetching
    requestInProgress.current = true;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text[#0D4835]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Photographer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking, index) =>
                booking.status === "COMPLETED" ||
                booking.status === "CANCELLED" ? (
                  <>
                    <tr key={booking.id}>
                      <td className="px-6 py-4">
                        <a
                          href={`/dash/project-details/${index}`}
                          className="text-sm underline text-[#0D4835]"
                        >
                          {booking.street} {booking.buildingName}
                        </a>
                        <div className="text-xs text-gray-500">
                          {booking.appointmentDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.package.name}{" "}
                          {booking.addOns.length > 0 && (
                            <span className="ml-1">
                              {booking.addOns
                                .map((addon) => {
                                  if (addon.name.includes("Photo")) return "📸";
                                  if (addon.name.includes("Video")) return "🎥";
                                  return "✨";
                                })
                                .join(" ")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.package.price}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.photographer?.firstname}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-between gap-4">
                          <Link
                            href="#"
                            className="flex flex-col items-center text-sm text-gray-900 opacity-50 cursor-not-allowed"
                            aria-disabled="true"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Camera className="h-4 w-4" />
                            <span>View</span>
                          </Link>
                          <Link
                            href="#"
                            className="flex flex-col items-center text-sm text-gray-900 opacity-50 cursor-not-allowed"
                            aria-disabled="true"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Camera className="h-4 w-4" />
                            <span>Download</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
