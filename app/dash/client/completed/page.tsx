"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Photo, Video, Virtual } from "@/components/icons/addOns";

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

export default function CompletedPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestInProgress = useRef(false);
  const { data: session, status } = useSession();

  const fetchBookings = async () => {
    if (requestInProgress.current) return;
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
      requestInProgress.current = false;
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-white ">
          <div className="p-8 text-center text-gray-500">
            Loading bookings...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-white shadow">
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white overflow-hidden rounded-lg border border-[#E0E0E0] ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0] ">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0] ">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0] ">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0] ">
                  Assigned Photographer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] "></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking, index) =>
                booking.status === "COMPLETED" ||
                booking.status === "CANCELLED" ? (
                  <tr key={booking.id} className="border-t border-[#E0E0E0]">
                    <td className="px-6 py-4 border-r border-[#E0E0E0]">
                     <Link href={`/dash/client/booking-details/${booking.id}`}
              className="text-sm underline text-[#0D4835]"
            >
              {booking.buildingName}, {booking.street}
            </Link>
                      <div className=" flex items-center text-sm text-[#515662]">
                        {booking.appointmentDate}
                      </div>
                    </td>
                    <td className="w-[18%] px-6 py-4 border-r border-[#E0E0E0] align-middle">
                      <div className="flex items-center text-sm text-[#515662]">
                        <span className="truncate">{booking.package.name}</span>
                        {booking.addOns.length > 0 && (
                          <span className="flex items-center gap-1 ml-1 shrink-0">
                            <span className="relative text-xl mb-1 font-extralight">
                              +
                            </span>
                            {(() => {
                              const names = booking.addOns.map(
                                (addon: any) => addon.name
                              );
                              const showPhoto = names.some((name: string) =>
                                name.includes("Photo")
                              );
                              const showVideo = names.some((name: string) =>
                                name.includes("Video")
                              );
                              const showVirtual = names.some((name: string) =>
                                name.includes("Virtual")
                              );

                              return (
                                <>
                                  {showPhoto && <Photo />}
                                  {showVideo && <Video />}
                                  {showVirtual && <Virtual />}
                                </>
                              );
                            })()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-[#E0E0E0]">
                      <div className="text-sm text-gray-900">
                        AED {booking.package.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-[#E0E0E0]">
                      {booking.photographer ? (
                        <div className="text-sm text-gray-900">
                          {booking.photographer.firstname}{" "}
                          {booking.photographer.lastname}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Not assigned
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <Link
                          href="#"
                          className="flex flex-col items-center text-sm text-gray-400 pointer-events-none"
                          aria-disabled="true"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                        <Link
                          href="#"
                          className="flex flex-col items-center text-sm text-gray-400 pointer-events-none"
                          aria-disabled="true"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
