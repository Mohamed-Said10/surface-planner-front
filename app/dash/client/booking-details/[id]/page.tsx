"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Check, Calendar, HelpCircle, X, Download, Send } from "lucide-react"
import {
  getStatusSteps,
  getProgressStats,
  transformStatusHistoryArray, // Add this import
  type Booking as BookingType,
  type BookingStatus,
} from "@/helpers/bookingStatusHelper"
import BookingStatusCard from "@/components/dashboard/stats/BookingStatusCard"

interface Booking extends BookingType {
  package: {
    name: string
    price: number
    description: string
  }
  addOns: Array<{
    name: string
    price: number
  }>
  buildingName: string
  street: string
  unitNumber: string
  floor: string
  timeSlot: string
  photographer: {
    firstname: string
    lastname: string
    email: string
    phoneNumber: string
    name?: string
    phone?: string
    location?: string
  } | null
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  notes: string | null
}

interface Message {
  id: string
  text: string
  sender: "user" | "support"
  timestamp: string
}

const timeSlots = [
  { id: 1, time: "9 AM - 12 PM", duration: "3 hours", price: 250 },
  { id: 2, time: "1 PM - 4 PM", duration: "3 hours", price: 250 },
  { id: 3, time: "5 PM - 8 PM", duration: "3 hours", price: 250 },
]

export default function BookingDetailsPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [rescheduleReason, setRescheduleReason] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "We have availability as early as tomorrow morning. What date and time work best for you?",
      sender: "support",
      timestamp: "11:11 AM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  // États pour le booking status card
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const ignoreResponse = useRef(false)

  const requestInProgress = useRef(false)

  const fetchStatusHistory = useCallback(async () => {
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal
    ignoreResponse.current = false

    try {
      console.log("Starting fetch request for booking status")
      setStatusLoading(true)
      setStatusError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/status`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal,
      })

      if (ignoreResponse.current) return

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch status")
      }

      const data = await response.json()

      if (ignoreResponse.current) return

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No booking status data available")
      }

      // Use the new helper function for array format
      const transformedData = transformStatusHistoryArray(data)
      setBookingStatus(transformedData)
    } catch (err) {
      if (ignoreResponse.current) return

      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          setStatusError(err.message)
        }
      }
    } finally {
      if (!ignoreResponse.current) {
        setStatusLoading(false)
      }
    }
  }, [id])

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (requestInProgress.current) return
      requestInProgress.current = true

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3000/api/bookings?id=${id}`, {
          credentials: "include",
        })

        if (!response.ok) throw new Error("Failed to fetch booking")

        const data = await response.json()
        if (data.bookings.length > 0) {
          setBooking(data.bookings[0])
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
        requestInProgress.current = false
      }
    }

    if (session && id) {
      fetchBookingDetails()
    }
  }, [session, id])

  // Effect pour le status history
  useEffect(() => {
    if (!session || !id) return

    fetchStatusHistory()

    return () => {
      ignoreResponse.current = true
      abortControllerRef.current?.abort()
    }
  }, [session, id, fetchStatusHistory])

  // Message handlers
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: newMessage,
          sender: "user",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  const handleReschedule = () => {
    console.log("Rescheduling with:", { selectedDate, selectedTimeSlot, rescheduleReason })
    setIsRescheduleModalOpen(false)
  }

  const handleCancel = () => {
    console.log("Cancelling with reason:", cancelReason)
    setIsCancelModalOpen(false)
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!booking) {
    return <div className="p-4 text-center text-gray-500">Booking not found</div>
  }

  // Get status steps and progress using helper functions
  const statusSteps = getStatusSteps(booking)
  const { completedSteps, inProgressStep, progressPercentage } = getProgressStats(statusSteps)

  return (
    <div className="p-4 space-y-4">
      <BookingStatusCard
        bookingStatus={bookingStatus}
        loading={statusLoading}
        error={statusError}
        onRetry={fetchStatusHistory}
      />


      {/* Package Details - Dynamic */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <div className="w-8 h-8 text-orange-600 justify-center flex items-center">💎</div>
          </div>
          <div>
            <h2 className="text-md font-semibold">{booking.package.name}</h2>
            <p className="text-sm text-gray-600">Addons: {booking.addOns.map((a) => a.name).join(", ") || "None"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-4">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Property Address</h3>
            <p className="text-sm font-medium">
              {booking.buildingName}, {booking.street}, Unit {booking.unitNumber}, Floor {booking.floor}
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Scheduled Date & Time</h3>
            <p className="text-sm font-medium">
              {new Date(booking.appointmentDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              ({booking.timeSlot})
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Assigned Photographer</h3>
            <p className="text-sm font-medium">
              {booking.photographer
                ? `${booking.photographer.firstname} ${booking.photographer.lastname}`
                : "Not assigned yet"}
            </p>
          </div>
        </div>
        <hr className="h-1 bg-red mb-4" />
        <div className="grid gap-4 grid-cols-4">
          <button
            onClick={() => setIsRescheduleModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4" />
            Reschedule Booking
          </button>
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </button>
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            Cancel Booking
          </button>
          <button className="text-sm justify-center flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">
            <Download className="h-4 w-4" />
            Download Photos
          </button>
        </div>
      </div>

      {/* Photographer Details - Dynamic (Only show if photographer assigned) */}
      {booking.photographer && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Photographer Details</h2>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">View Portfolio →</button>
          </div>

          <hr className="h-1 bg-red mb-2" />
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Name</h3>
              <p className="text-sm font-medium">
                {booking.photographer.firstname} {booking.photographer.lastname}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
              <p className="text-sm font-medium">{booking.photographer.email}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
              <p className="text-sm font-medium">{booking.photographer.phoneNumber}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Location</h3>
              <p className="text-sm font-medium">Dubai UAE</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals remain the same */}
      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reschedule Booking</h2>
              <button onClick={() => setIsRescheduleModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason of Reschedule</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="emergency">Emergency</option>
                  <option value="schedule_conflict">Schedule Conflict</option>
                  <option value="weather">Weather Conditions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedTimeSlot === slot.time ? "border-emerald-500 bg-emerald-50" : ""
                      }`}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{slot.time}</p>
                          <p className="text-sm text-gray-500">{slot.duration}</p>
                        </div>
                        <p className="font-medium">AED {slot.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree that rescheduling is not allowed after this reschedule.
                </label>
              </div>
            </div>
            <div className="p-6 border-t">
              <button
                onClick={handleReschedule}
                disabled={!agreeToTerms || !selectedDate || !selectedTimeSlot || !rescheduleReason}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg disabled:opacity-50"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px]">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cancel Booking</h2>
              <button onClick={() => setIsCancelModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Cancellation</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  rows={4}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600"
                >
                  Keep Booking
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] h-[600px] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Help for Booking #{booking.id}</h2>
              <button onClick={() => setIsChatModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-gray-500"}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <button onClick={handleSendMessage} className="p-2 bg-emerald-600 text-white rounded-lg">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
