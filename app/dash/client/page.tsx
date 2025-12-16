"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import BookingStatusCard from "@/components/dashboard/stats/BookingStatusCard";
import { CalendarDaysCalculated, CalendarDays } from "@/components/icons";
import { Photo, Video, Virtual } from "@/components/icons/addOns";
import {
  transformStatusHistory,
  getStatusColor,
  formatStatus,
  formatDate,
  type BookingStatus,
} from "@/helpers/bookingStatusHelper";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
  });

  // États pour le booking status
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(
    null
  );
  const [shortIdStatus, setShortIdStatus] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  const requestInProgress = useRef(false);
  const statusRequestMade = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const ignoreResponse = useRef(false);

  const fetchBookings = useCallback(async () => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to fetch bookings");

      return data;
    } finally {
      requestInProgress.current = false;
    }
  }, [session]);

  const fetchStatusHistory = useCallback(async () => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    ignoreResponse.current = false;

    try {
      setStatusLoading(true);
      setStatusError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status-history/last`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal,
        }
      );

      if (ignoreResponse.current) return;

      const data = await response.json();
      setShortIdStatus(data.shortId);
      if (ignoreResponse.current) return;

      // Handle "no bookings" case as empty state, not an error
      if (!response.ok) {
        if (data.error && (data.error.includes("haven't made any bookings") || data.error.includes("No bookings"))) {
          setBookingStatus(null);
          setStatusLoading(false);
          return;
        }
        throw new Error(data.message || data.error || "Failed to fetch status");
      }

      if (!data?.bookingId) {
        setBookingStatus(null);
        setStatusLoading(false);
        return;
      }

      const transformedData = transformStatusHistory(data);
      setBookingStatus(transformedData);
    } catch (err) {
      if (ignoreResponse.current) return;

      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          setStatusError(err.message);
        }
      }
    } finally {
      if (!ignoreResponse.current) {
        setStatusLoading(false);
      }
    }
  }, []);

  // Effect pour les bookings
  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchBookings();
        if (!data) return;

        setBookings(data.bookings);
        setStats({
          totalBookings: data.pagination.total,
          activeBookings: data.bookings.filter(
            (b: any) => !["COMPLETED", "CANCELLED"].includes(b.status)
          ).length,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [status, session, fetchBookings]);

  // Effect pour le status history
  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    fetchStatusHistory();

    return () => {
      ignoreResponse.current = true;
      abortControllerRef.current?.abort();
    };
  }, [status, session, fetchStatusHistory]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }


  return (
    <div className="p-4 space-y-4">
      <BookingStatusCard
        shortId={shortIdStatus || ""}
        bookingStatus={bookingStatus}
        loading={statusLoading}
        error={statusError}
        onRetry={fetchStatusHistory}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-[#DBDCDF] p-4 flex items-center gap-3">
          <div className="p-3 border border-[#DBDCDF] rounded-md">
            <CalendarDays color="#0D824B" size={25} />
          </div>
          <div>
            <div className="text-xs text-[#515662]">Total Bookings</div>
            <div className="text-xl text-[#101828] font-semibold">
              {stats.totalBookings}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#DBDCDF] p-4 flex items-center gap-3">
          <div className="p-3 border border-[#DBDCDF] rounded-md">
            <CalendarDaysCalculated
              size={25}
              dayNumber={stats.activeBookings}
            />
          </div>
          <div>
            <div className="text-xs text-[#515662]">Active Bookings</div>
            <div className="text-xl text-[#101828] font-semibold">
              {stats.activeBookings}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-lg font-semibold">My Bookings</h2>

      <div className="bg-white overflow-hidden rounded-lg border border-[#E0E0E0]">
        <div className="overflow-x-auto">
          <table className="w-full">
  <thead>
    <tr className="bg-gray-50">
      <th className="w-[38%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Booking</th>
      <th className="w-[18%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Package</th>
      <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Price</th>
      <th className="w-[17%] px-6 py-3 text-left text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Photographer</th>
      <th className="w-[12%] px-6 py-3 text-center text-xs font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">Status</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {bookings.map((booking) => (
      <tr key={booking.id} className="border-t border-[#E0E0E0]">
        <td className="w-[38%] px-6 py-4 border-r border-[#E0E0E0]">
          <Link href={`/dash/client/booking-details/${booking.id}`}
              className="text-sm underline text-[#0D4835]"
            >
              {booking.buildingName}, {booking.street}
            </Link>
          <div className="text-xs text-gray-500">{formatDate(booking.appointmentDate)}</div>
        </td>
        <td className="w-[18%] px-6 py-4 border-r border-[#E0E0E0] align-middle">
          <div className="flex items-center text-sm text-[#515662]">
            <span className="truncate">{booking.package.name}</span>
           {booking.addOns.length > 0 && (
  <span className="flex items-center gap-1 ml-1 shrink-0">
    <span className="relative text-xl mb-1 font-extralight">+</span>
    {(() => {
      const names = booking.addOns.map((addon: any) => addon.name);
      const showPhoto = names.some((name:string) => name.includes('Photo'));
      const showVideo = names.some((name:string) => name.includes('Video'));
      const showVirtual = names.some((name:string) => name.includes('Virtual'));

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
        <td className="w-[15%] px-6 py-4 border-r border-[#E0E0E0]">
          <div className="text-sm text-[#515662]">
            AED {booking.package.price + booking.addOns.reduce((sum: any, addon: any) => sum + addon.price, 0)}
          </div>
        </td>
        <td className="w-[17%] px-6 py-4 border-r border-[#E0E0E0]">
          <div className="text-sm text-[#515662] truncate">{booking.photographer?.firstname || "Not assigned"}</div>
        </td>
        <td className="w-[12%] px-3 py-4 border-r border-[#E0E0E0]">
          <div className="flex justify-center">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
              {formatStatus(booking.status)}
            </span>
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
