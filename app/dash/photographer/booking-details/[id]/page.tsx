'use client';
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Calendar, X, Send, NotebookText } from "lucide-react";
import UploadWork from "@/components/shared/upload-work";
import { CheckCircle, XSquare } from '@/components/icons';
import { useRouter } from "next/navigation";

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
  } | null;
  client: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  notes: string | null;
  // Add payment data when available
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
  }>;
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
  const router = useRouter();
  const { data: session } = useSession();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 5 // Set to 5 seconds for testing
  });
  const [shootStatus, setShootStatus] = useState('waiting'); // 'waiting', 'ready', 'shooting', 'completed', 'uploading'
  const [shootingTime, setShootingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [shootStartTime, setShootStartTime] = useState<Date | null>(null);
  
  // Modal states
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const requestInProgress = useRef(false);

  // Countdown timer effect
  useEffect(() => {
    if (!isAccepted || shootStatus !== 'waiting') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Countdown finished
          clearInterval(timer);
          setShootStatus('ready');
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAccepted, shootStatus]);

  // Shooting timer effect
  useEffect(() => {
    if (shootStatus !== 'shooting' || !shootStartTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - shootStartTime.getTime()) / 1000);
      
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      
      setShootingTime({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [shootStatus, shootStartTime]);

  // Fetch booking details - FIXED API CALL
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (requestInProgress.current) return;
      requestInProgress.current = true;

      try {
        setLoading(true);
        // Use the correct endpoint for single booking details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch booking');
        
        const bookingData = await response.json();
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    };

    if (session && id) {
      fetchBookingDetails();
    }
  }, [session, id]);

  // Helper function to determine step status
  const getStepStatus = (stepLabel: string) => {
    if (!booking) return { status: 'pending', icon: null };

    const statusMap: Record<string, string[]> = {
      'Booking Requested': ['BOOKING_CREATED', 'PHOTOGRAPHER_ASSIGNED', 'PHOTOGRAPHER_ACCEPTED', 'SHOOTING', 'EDITING', 'COMPLETED'],
      'Photographer Assigned': ['PHOTOGRAPHER_ASSIGNED', 'PHOTOGRAPHER_ACCEPTED', 'SHOOTING', 'EDITING', 'COMPLETED'],
      'Shoot': ['SHOOTING', 'EDITING', 'COMPLETED'],
      'Editing': ['EDITING', 'COMPLETED'],
      'Order Delivery': ['COMPLETED']
    };

    const activeStatuses = statusMap[stepLabel] || [];
    const isActive = activeStatuses.includes(booking.status);

    return {
      status: isActive ? 'completed' : 'pending',
      icon: isActive ? <CheckCircle /> : null
    };
  };

  // Status steps based on booking status
  const getStatusSteps = () => {
    if (!booking) return [];

    const statusOrder = [
      "BOOKING_CREATED",
      "PHOTOGRAPHER_ASSIGNED",
      "PHOTOGRAPHER_ACCEPTED",
      "SHOOTING",
      "EDITING",
      "COMPLETED"
    ];

    const currentIndex = statusOrder.indexOf(booking.status);

    return [
      {
        label: "Booking Requested",
        ...getStepStatus('Booking Requested')
      },
      {
        label: "Photographer Assigned",
        ...getStepStatus('Photographer Assigned')
      },
      {
        label: "Shoot",
        ...getStepStatus('Shoot')
      },
      {
        label: "Editing",
        ...getStepStatus('Editing')
      },
      {
        label: "Order Delivery",
        ...getStepStatus('Order Delivery')
      }
    ];
  };

  // Fetch messages when chat modal opens
  const fetchMessages = async () => {
    if (!id) return;

    try {
      setLoadingMessages(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages?bookingId=${id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.senderId === session?.user?.id ? 'user' : 'support',
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Message handlers
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !booking) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: id,
          receiverId: booking.client.id,
          text: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...messages,
          {
            id: data.message.id,
            text: data.message.text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

  const handleRejectBooking = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (res.ok) {
        const updated = await res.json();
        setBooking(updated);
        router.push('/dash/photographer');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    }
  };

  // Fetch messages when chat modal opens
  useEffect(() => {
    if (isChatModalOpen) {
      fetchMessages();
    }
  }, [isChatModalOpen]);

  const handleAcceptBooking = async () => {
    try {
      setIsAccepting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const updated = await res.json();
        setBooking(updated);
        // Open chat modal after successful acceptance
        setIsChatModalOpen(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to accept booking');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking');
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!booking || !booking.package) {
    return (
      <div className="p-4 text-center text-gray-500">
        {!booking ? 'Booking not found' : 'Booking data incomplete'}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (isAccepted) {
      return "bg-green-100 text-green-800";
    }
    
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "booking_created":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "photographer_assigned":
        return "bg-orange-100 text-orange-800";
      case "photographer_accepted":
        return "bg-emerald-100 text-emerald-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "shooting":
      case "shoot in progress":
        return "bg-blue-100 text-blue-800";
      case "editing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    if (isAccepted) {
      return "Active";
    }
    return booking.status === 'BOOKING_CREATED' 
    ? 'Upcoming' 
    : booking.status.replace(/_/g, ' ').toLowerCase();
  };

  console.log('test booking', booking)

  // Mock photographer data when accepted
  const getPhotographerName = () => {
    if (isAccepted || booking.photographer) {
      return booking.photographer 
        ? `${booking.photographer.firstname} ${booking.photographer.lastname}` 
        : 'Michael Philips';
    }
    return 'Not assigned yet';
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="p-4 space-y-4">
      {/* Package Details - Dynamic */}
      <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 flex-wrap flex-col">
            <span className="text-lg font-semibold">Booking #{booking.id.slice(0, 8)}</span>
            <h2 className="text-sm text-gray-600">Diamond Package</h2>
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
            <span>{getStatusText()}</span>
          </div>
        </div>
        <div className="border-b mb-3 mt-3"/>

        <div className={`grid gap-8 mb-4 ${isAccepted ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Included Services</h3>
            <p className="text-sm text-gray-700 font-medium">
              Twilight Photos + 360° Virtual Tour
            </p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Date & Time</h3>
            <p className="text-sm text-gray-700 font-medium">
              {new Date(booking.appointmentDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} – {booking.timeSlot}
            </p>
          </div>
          {isAccepted && (
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Photographer Assigned</h3>
              <p className="text-sm text-gray-700 font-medium">
                {getPhotographerName()}
              </p>
            </div>
          )}
        </div>
        <hr className="mb-4" />
        <div className="grid gap-4 grid-cols-4">
          <button
            onClick={handleAcceptBooking}
            disabled={isAccepting || booking.status !== 'PHOTOGRAPHER_ASSIGNED'}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#12B76A] hover:bg-[#12B76A]/90 disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[inset_0_1.5px_0_0_#FFFFFF48,inset_-1.5px_0_0_0_#FFFFFF20,inset_1.5px_0_0_0_#FFFFFF20,inset_0_-2px_0_0_#FFFFFF20,inset_0_-2px_0_0_#00000030]"
          >
            {isAccepting ? 'Accepting...' : booking.status === 'PHOTOGRAPHER_ACCEPTED' ? 'Booking Accepted' : 'Accept Booking'}
          </button>
          <button 
            onClick={() => setIsRescheduleModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 border-t border-l border-r rounded-lg text-gray-700 hover:bg-gray-50 shadow-[inset_0_1.5px_0_0_#FFFFFF48,inset_-1.5px_0_0_0_#FFFFFF20,inset_1.5px_0_0_0_#FFFFFF20,inset_0_-2px_0_0_#FFFFFF20,inset_0_-2px_0_0_#00000030]"
          >
            <Calendar className="h-4 w-4" />
            Reschedule Booking
          </button>
          <button className="text-sm justify-center flex items-center gap-2 px-4 py-2 border-t border-l border-r rounded-lg text-gray-700 hover:bg-gray-50 shadow-[inset_0_1.5px_0_0_#FFFFFF48,inset_-1.5px_0_0_0_#FFFFFF20,inset_1.5px_0_0_0_#FFFFFF20,inset_0_-2px_0_0_#FFFFFF20,inset_0_-2px_0_0_#00000030]">
            <NotebookText className="h-4 w-4" />
            Add Notes
          </button>
          <button 
            onClick={() => setIsCancelModalOpen(true)}
            className="text-sm justify-center flex items-center gap-2 px-4 py-2 text-red-600 border-red-300 rounded-lg hover:bg-gray-50 shadow-[inset_0_1.5px_0_0_#FFFFFF48,inset_-1.5px_0_0_0_#FFFFFF20,inset_1.5px_0_0_0_#FFFFFF20,inset_0_-2px_0_0_#FFFFFF20,inset_0_-2px_0_0_#00000030]"
          >
            <XSquare className="h-4 w-4" /> 
            Cancel Booking
          </button>
        </div>
      </div>

      <UploadWork
        bookingId={id as string}
        onFileUpload={(section, files) => {
          console.log(`Uploading files for ${section}:`, files);
          // Files will be uploaded by the UploadWork component
        }}
      />
      {/* <Payement_Details/> */}

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
                  onClick={() => {
                    handleCancel();
                    handleRejectBooking();
                  }}
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
              <h2 className="text-xl font-semibold">Help for Booking #{booking.id.slice(0, 8)}</h2>
              <button onClick={() => setIsChatModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
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
                ))
              )}
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