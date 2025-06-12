"use client"
import type React from "react"
import { useRouter } from "next/navigation"

interface Booking {
  id: string
  buildingName: string
  appointmentDate: string
  timeSlot: string
  package: {
    name: string
    price: number
  }
  client: {
    firstname: string
    lastname: string
  }
}

interface BookingsTableProps {
  title: string
  bookings: Booking[]
}

const BookingsTable: React.FC<BookingsTableProps> = ({ title, bookings }) => {
  const router = useRouter()

  const handleBookingClick = (bookingId: string) => {
    router.push(`/dash/photographer/booking-details/${bookingId}`)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="bg-white rounded-lg  mt-4">
        <div className="overflow-hidden rounded-lg border border-[#E0E0E0]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0] first:rounded-tl-lg">
                  ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Booking
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] border-r border-[#E0E0E0]">
                  Package
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#343B48] bg-[#F5F6F6] last:rounded-tr-lg">
                  Customer Name
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking.id}
                  className={`border-t border-[#E0E0E0] hover:bg-gray-50 cursor-pointer ${
                    index === bookings.length - 1 ? "last-row" : ""
                  }`}
                  onClick={() => handleBookingClick(booking.id)}
                >
                  <td
                    className={`py-4 px-4 text-sm font-medium border-r border-[#E0E0E0] ${
                      index === bookings.length - 1 ? "rounded-bl-lg" : ""
                    }`}
                  >
                    {booking.id.slice(0, 8)}...
                  </td>
                  <td className="py-4 px-4 text-sm border-r border-[#E0E0E0]">
                    <span className="underline text-[#0D4835] hover:text-[#0D4835]/80">{booking.buildingName}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 border-r border-[#E0E0E0]">
                    {new Date(booking.appointmentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {booking.timeSlot}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 border-r border-[#E0E0E0]">
                    AED {booking.package.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 border-r border-[#E0E0E0]">{booking.package.name}</td>
                  <td
                    className={`py-4 px-4 text-sm text-gray-900 ${
                      index === bookings.length - 1 ? "rounded-br-lg" : ""
                    }`}
                  >
                    {booking.client.firstname} {booking.client.lastname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BookingsTable
