'use client';
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Calendar, HelpCircle, X, Download, Send, Notebook, NotebookText, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Payement_Details from "@/components/shared/payment-details";
import UploadWork from "@/components/shared/upload-work";
interface Booking {
  id: string;
  status: string;
  package: {
    name: string;
    price: number;
    description: string;
  };
  addOns: Array<{
    name: string;
    price: number;
  }>;
  buildingName: string;
  street: string;
  unitNumber: string;
  floor: string;
  appointmentDate: string;
  timeSlot: string;
  photographer: {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    name?: string;
    phone?: string;
    location?: string;
  } | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  notes: string | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

const timeSlots = [
  { id: 1, time: '9 AM - 12 PM', duration: '3 hours', price: 250 },
  { id: 2, time: '1 PM - 4 PM', duration: '3 hours', price: 250 },
  { id: 3, time: '5 PM - 8 PM', duration: '3 hours', price: 250 }
];

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states (preserved from your original code)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "We have availability as early as tomorrow morning. What date and time work best for you?",
      sender: 'support',
      timestamp: '11:11 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const requestInProgress = useRef(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {

      if (requestInProgress.current) return; // Skip if already fetching
      requestInProgress.current = true;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/bookings?id=${id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch booking');
        
        const data = await response.json();
        if (data.bookings.length > 0) {
          setBooking(data.bookings[0]);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session && id) {
      fetchBookingDetails();
    }
  }, [session, id]);

  // Status steps based on booking status
  const getStatusSteps = () => {
    if (!booking) return [];
    
    const statusOrder = [
      "BOOKING_CREATED",
      "PHOTOGRAPHER_ASSIGNED", 
      "SHOOT_IN_PROGRESS",
      "EDITING",
      "DELIVERED"
    ];
    
    const currentIndex = statusOrder.indexOf(booking.status);
    
    return [
      { 
        label: "Booking Requested", 
        date: new Date(booking.appointmentDate).toLocaleString('en-US', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }),
        completed: currentIndex >= 0
      },
      { 
        label: "Photographer Assigned", 
        date: booking.photographer ? 
          new Date().toLocaleString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          }) : 'Pending',
        completed: currentIndex >= 1
      },
      { 
        label: "Shoot in Progress", 
        date: currentIndex >= 2 ? 
          new Date().toLocaleString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          }) : 'Pending',
        completed: currentIndex >= 2
      },
      { 
        label: "Editing", 
        date: currentIndex >= 3 ? 'Currently' : 'Pending',
        completed: currentIndex >= 3,
        inProgress: currentIndex === 3
      },
      {
        label: "Order Delivery",
        date: currentIndex >= 4
          ? new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : 'Expected ' +
            new Date(
              new Date(booking.appointmentDate).setDate(
                new Date(booking.appointmentDate).getDate() + 3
              )
            ).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
        completed: currentIndex >= 4,
      }
    ];
  };

  // Message handlers (preserved from your original code)
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          text: newMessage,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setNewMessage("");
    }
  };

  const handleReschedule = () => {
    console.log("Rescheduling with:", { selectedDate, selectedTimeSlot, rescheduleReason });
    setIsRescheduleModalOpen(false);
  };

  const handleCancel = () => {
    console.log("Cancelling with reason:", cancelReason);
    setIsCancelModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-4 text-center text-gray-500">
        Booking not found
      </div>
    );
  }
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "booking_created":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
          case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "shoot_done":
      case "shoot in progress":
        return "bg-blue-100 text-blue-800";
      case "editing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const statusSteps = getStatusSteps();
  const completedSteps = statusSteps.filter(step => step.completed).length;
  const inProgressStep = statusSteps.findIndex(step => step.inProgress);
const BOOKING = {
  photographer: {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+971 50 123 4567",
  },
  totalCost: 700,
  paidAmount: 500,
  payments: [
    {
      id: "120894",
      datePaid: "March 3, 2025, 2:00 PM",
      amount: 500,
      method: "Credit Card",
      status: "Paid",
    },
    {
      id: "120894",
      datePaid: "March 3, 2025, 2:00 PM",
      amount: 200,
      method: "Paypal",
      status: "Failed",
    },
  ],
}
  return (
    <div className="p-4 space-y-4">
      {/* Booking Status - Dynamic */}
 

      {/* Package Details - Dynamic */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between gap-4 ">
          <div className=" flex items-start gap-2 flex-wrap flex-col  ">
                        <span className="text-lg font-semibold">Booking #SP2025</span>

            <h2 className="text-sm ">{booking.package.name}</h2>
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor("upcoming")}`}>
            <span>upcoming</span>
          </div>
        </div>
        <div className="dvideligne border-b mb-3 mt-3"/>

        <div className="grid grid-cols-3 gap-8 mb-4">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Include Services</h3>
            <p className="text-sm text-gray-700 font-medium">
              Twilight Photos + 360 Virtual Tour
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Scheduled Date & Time</h3>
            <p className="text-sm text-gray-700 font-medium">
             March 3, 2025 – 2:00 PM
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Photographer Assigned</h3>
            <p className="text-sm text-gray-700 font-medium">
          Michael Philips
            </p>
          </div>
        </div>
        <hr className="h-1 bg-red mb-4" />
        <div className="grid gap-4 grid-cols-4">
        
          <button 
            onClick={() => setIsChatModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-white shadow-[0_2px_0_rgba(0,0,0,0.3)] bg-green-400 hover:bg-green-500"
          >
            Accept Booking
          </button>
            <button 
            onClick={() => setIsRescheduleModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 shadow-[0_2px_0_rgba(0,0,0,0.3)]"
          >
            <Calendar className="h-4 w-4" />
            Reschedule Booking
          </button>
        
          <button className="text-sm justify-center flex items-center gap-2 px-4 py-2  border rounded-lg text-gray-700  hover:bg-gray-50 shadow-[0_2px_0_rgba(0,0,0,0.3)] ">
            <NotebookText className="h-4 w-4" />
            Add Notes
          </button>
            <button 
            onClick={() => setIsCancelModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50 shadow-[0_2px_0_rgba(0,0,0,0.3)]"
          >
            <XSquare className="h-4 w-4" /> 
            Cancel Booking
          </button>
        </div>
      </div>

   
<UploadWork/>
   <Payement_Details/>


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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason of Reschedule
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 border rounded-lg cursor-pointer ${
                        selectedTimeSlot === slot.time ? 'border-emerald-500 bg-emerald-50' : ''
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation
                </label>
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
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
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
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
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
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-emerald-600 text-white rounded-lg"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}