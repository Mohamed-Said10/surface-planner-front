'use client';
import { Check, Calendar, HelpCircle, X, Download, Send } from "lucide-react";
import { useState } from "react";
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}
const bookingStatus = {
  id: "1279486",
  steps: [
    { label: "Booking Requested", date: "May 5, 5:54 AM", completed: true },
    { label: "Photographer Assigned", date: "May 5, 8:54 AM", completed: true },
    { label: "Shoot in Progress", date: "May 5, 8:54 AM", completed: true },
    { label: "Editing", date: "Currently", completed: false, inProgress: true },
    { label: "Order Delivery", date: "Expected May 8, 2025", completed: false }
  ]
};

const bookingDetails = {
  package: "Diamond Package",
  addons: "Extra Fast Delivery Service",
  propertyAddress: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
  scheduledDateTime: "Feb 12, 2025 6:23 am",
  photographer: {
    name: "Courtney Henry",
    email: "michaelp@email.com",
    phone: "+1 (555) 987-6543",
    location: "Dubai UAE"
  }
};


const timeSlots = [
  { id: 1, time: '9 AM - 12 PM', duration: '3 hours', price: 250 },
  { id: 2, time: '1 PM - 4 PM', duration: '3 hours', price: 250 },
  { id: 3, time: '5 PM - 8 PM', duration: '3 hours', price: 250 }
];
export default function BookingDetailsPage() {
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
    // Handle reschedule logic here
    console.log("Rescheduling with:", { selectedDate, selectedTimeSlot, rescheduleReason });
    setIsRescheduleModalOpen(false);
  };

  const handleCancel = () => {
    // Handle cancellation logic here
    console.log("Cancelling with reason:", cancelReason);
    setIsCancelModalOpen(false);
  };
  return (

    <div className="p-4 space-y-4">

      {/* Booking Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-semibold mb-6">Status</h2>
        <div className="relative grid justify-between grid-cols-5">
          {bookingStatus.steps.map((step, index) => (
            <div key={index} className="col-span-1 flex flex-col items-left text-left relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 
                      ${step.completed ? 'bg-emerald-500' : step.inProgress ? 'bg-orange-500' : 'bg-gray-200'}`}>
                {step.completed ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div className="text-xs font-medium">{step.label}</div>
              <div className="text-xs text-gray-500">{step.date}</div>
            </div>
          ))}
          {/* Progress Lines */}
          <div className="absolute top-3 left-0 w-full h-[2px] flex">
            <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
            <div className="h-full bg-orange-500" style={{ width: '15%' }} />
            <div className="h-full bg-gray-200" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <div className="w-8 h-8 text-orange-600 justify-center flex items-center">💎</div>
          </div>
          <div>
            <h2 className="text-md font-semibold">{bookingDetails.package}</h2>
            <p className="text-sm text-gray-600">Addons: {bookingDetails.addons}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-4">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Property Address</h3>
            <p className="text-sm font-medium">{bookingDetails.propertyAddress}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Scheduled Date & Time</h3>
            <p className="text-sm font-medium">{bookingDetails.scheduledDateTime}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Assigned Photographer</h3>
            <p className="text-sm font-medium">{bookingDetails.photographer.name}</p>
          </div>
        </div>
        <hr className="h-1 bg-red mb-4" />
        <div className="grid gap-4 grid-cols-4">
          <button onClick={() => setIsRescheduleModalOpen(true)} className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            <Calendar className="h-4 w-4" />
            Reschedule Booking
          </button>
          <button onClick={() => setIsChatModalOpen(true)} className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            <HelpCircle className="h-4 w-4" />
            Contact Support
          </button>
          <button onClick={() => setIsCancelModalOpen(true)} className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50">
            <X className="h-4 w-4" />
            Cancel Booking
          </button>
          <button className="text-sm justify-center flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">
            <Download className="h-4 w-4" />
            Download Photos
          </button>
        </div>
      </div>

      {/* Photographer Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Photographer Details</h2>
          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View Portfolio →
          </button>
        </div>

        <hr className="h-1 bg-red mb-2" />
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Name</h3>
            <p className="text-sm font-medium">{bookingDetails.photographer.name}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Email</h3>
            <p className="text-sm font-medium">{bookingDetails.photographer.email}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Phone</h3>
            <p className="text-sm font-medium">{bookingDetails.photographer.phone}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Location</h3>
            <p className="text-sm font-medium">{bookingDetails.photographer.location}</p>
          </div>
        </div>
      </div>








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
              <h2 className="text-xl font-semibold">Help for Booking #{bookingStatus.id}</h2>
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