"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search } from '@/components/icons'

interface Booking {
  id: string
  buildingName: string
  appointmentDate: string
  timeSlot: string
  status: string
  package: {
    name: string
    price: number
  }
  client: {
    firstname: string
    lastname: string
  }
  photographerId: string | null;
  photographer: {
    id: string;
    firstname: string;
    lastname: string;
    email?: string;
  } | null;
}

interface AdminBookingsTableProps {
  title: string
  bookings: Booking[]
  isSearchable?: boolean
}

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  SHOOTING: "bg-blue-100 text-blue-800",
  EDITING: "bg-purple-100 text-purple-800",
  BOOKING_CREATED: "bg-yellow-100 text-yellow-800",
  PHOTOGRAPHER_ASSIGNED: "bg-indigo-100 text-indigo-800",
}

const AdminBookingsTable: React.FC<AdminBookingsTableProps> = ({ title, bookings, isSearchable }) => {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const handleBookingClick = (bookingId: string) => {
    router.push(`/dash/admin/booking-details/${bookingId}`)
  }

  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .split('_')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const searchLower = search.toLowerCase()
      const matchSearch = (
        booking.id.toLowerCase().includes(searchLower) ||
        (booking.buildingName || "").toLowerCase().includes(searchLower) ||
        `${booking.client.firstname} ${booking.client.lastname}`.toLowerCase().includes(searchLower) ||
        `${booking.photographer?.firstname || ""} ${booking.photographer?.lastname || ""}`.toLowerCase().includes(searchLower) ||
        new Date(booking.appointmentDate).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric"
        }).toLowerCase().includes(searchLower)
      )
      const matchStatus = statusFilter ? booking.status === statusFilter : true
      return matchSearch && matchStatus
    })
  }, [bookings, search, statusFilter])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {isSearchable && (
        <div className="flex items-center justify-between gap-4 mb-0 bg-[#F5F6F6] px-4 pt-3 pb-2 border border-b-0 border-[#E0E0E0] rounded-t-lg">
          {/* Search input */}
          <div className="relative flex-1">
            <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search Booking ID, Customer Name, Photographer, Date"
      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4835]"
    />
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <Search className="w-4 h-4" />
    </span>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">View: All</option>
            {Object.keys(statusColors).map(status => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-b-lg">
          <div className={`overflow-hidden border border-t-1 border-[#DBDCDF] rounded-b-lg ${
              !isSearchable ? "rounded-t-lg" : ""
            }`}
          >
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Booking
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Package
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Customer Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Photographer
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr
                  key={booking.id}
                  className={`border-t border-[#E0E0E0] hover:bg-gray-50 cursor-pointer`}
                  onClick={() => handleBookingClick(booking.id)}
                >
                  <td className={`py-4 px-4 text-sm font-medium border-r border-[#E0E0E0] ${index === bookings.length - 1 ? "rounded-bl-lg" : ""}`}>
                    {booking.id.slice(0, 8)}...
                  </td>
                  <td className="py-4 px-4 text-sm border-r border-[#E0E0E0]">
                    <span className="underline text-[#0D4835] hover:text-[#0D4835]/80 block">
                      {booking.buildingName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(booking.appointmentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {booking.timeSlot}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 border-r border-[#E0E0E0]">
                    {booking.package.name.replace(/ ?package/i, '')}
                  </td>
                  <td className="py-4 px-4 text-sm border-r border-[#E0E0E0]">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}>
                      {formatStatus(booking.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 border-r border-[#E0E0E0]">
                    {booking.client.firstname} {booking.client.lastname}
                  </td>
                  <td className={`py-4 px-4 text-sm text-gray-900 ${index === bookings.length - 1 ? "rounded-br-lg" : ""}`}>
                    {booking.photographer?.firstname
                      ? `${booking.photographer.firstname} ${booking.photographer.lastname}`
                      : '_'}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                    No bookings match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminBookingsTable
