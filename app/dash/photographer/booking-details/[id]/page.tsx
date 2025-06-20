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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "We have availability as early as tomorrow morning. What date and time work best for you?",
      sender: 'support',
      timestamp: '11:11 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState({
    'Unedited Photos': false,
    'Edited Photos': false,
    'Videos': false,
    '360° Virtual Tour': false,
    'Floor Plan & Room Staging': false
  });

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
        const response = await fetch(`/api/bookings/${id}`, {
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

  // Status steps based on booking status
  const getStatusSteps = () => {
    if (!booking) return [];
    
    // Vérifier si tous les fichiers sont uploadés
    const allFilesUploaded = Object.values(uploadProgress).every(hasFiles => hasFiles);
    
    const getStepStatus = (stepName: string) => {
      switch (stepName) {
        case 'Booking Requested':
          return { completed: true, date: "May 5, 5:54 AM" };
        case 'Photographer Assigned':
          return { 
            completed: isAccepted || allFilesUploaded, 
            date: (isAccepted || allFilesUploaded) ? "May 5, 8:54 AM" : "Pending" 
          };
        case 'Shoot':
          return { 
            completed: shootStatus === 'completed' || shootStatus === 'uploading' || allFilesUploaded,
            inProgress: shootStatus === 'shooting' && !allFilesUploaded,
            upcoming: shootStatus === 'ready' && !allFilesUploaded,
            date: allFilesUploaded 
              ? "Completed" 
              : shootStatus === 'completed' || shootStatus === 'uploading' 
                ? "Completed" 
                : shootStatus === 'shooting' 
                  ? "In Progress" 
                  : shootStatus === 'ready' 
                    ? "Ready to Start" 
                    : "Starts Soon"
          };
        case 'Editing':
          const hasUploadedFiles = Object.values(uploadProgress).some(hasFiles => hasFiles);
          
          return { 
            completed: allFilesUploaded,
            inProgress: hasUploadedFiles && !allFilesUploaded,
            date: allFilesUploaded 
              ? "All Files Uploaded - Complete"
              : hasUploadedFiles 
                ? "Upload in Progress"
                : "Not Started Yet"
          };
        case 'Order Delivery':
          return { 
            completed: allFilesUploaded, 
            date: allFilesUploaded ? "Ready for Delivery" : "Expected May 8, 2025" 
          };
        default:
          return { completed: false, date: "Pending" };
      }
    };
    
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

  // Message handlers
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

  const handleAcceptBooking = () => {
    setIsAccepted(true);
    setShootStatus('waiting');
    // Update booking status to active
    setBooking(prev => prev ? { ...prev, status: 'PHOTOGRAPHER_ASSIGNED' } : null);
  };

  const handleStartShoot = () => {
    setShootStatus('shooting');
    setShootStartTime(new Date());
    setShootingTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const handleFinishShoot = () => {
    setShootStatus('completed');
    // Stop the timer by not updating shootStartTime
  };

  const handleShootCompleted = () => {
    setShootStatus('uploading');
  };

  const handleReschedule = () => {
    console.log("Rescheduling with:", { selectedDate, selectedTimeSlot, rescheduleReason });
    setIsRescheduleModalOpen(false);
  };

  const handleCancel = () => {
    console.log("Cancelling with reason:", cancelReason);
    setIsCancelModalOpen(false);
  };

  const handleUploadProgress = (section: string, hasFiles: boolean) => {
    setUploadProgress(prev => {
      const newProgress = { ...prev, [section]: hasFiles };
      return newProgress;
    });
  };

  const handleRejectBooking = () => {
    const storedPreviousPath = sessionStorage.getItem('previousPath');
    
    if (storedPreviousPath && storedPreviousPath !== window.location.pathname) {
      router.push(storedPreviousPath);
    } else {
      router.push('/dash/photographer/bookings');
    }
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
    if (isAccepted) {
      return "bg-green-100 text-green-800";
    }
    
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "booking_created":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
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
        
        {!isAccepted ? (
          <div className="grid gap-4 grid-cols-2">
            <button 
              onClick={handleAcceptBooking}
              className="text-sm justify-center flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#12B76A] hover:bg-[#12B76A]/90"
            >
              Accept Booking
            </button>
            <button 
              onClick={handleRejectBooking}
              className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-[#CC3A30] border-red-300 hover:bg-gray-50"
            >
              <XSquare className="h-4 w-4" />
              Reject Booking
            </button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3">
            <button 
              onClick={() => setIsRescheduleModalOpen(true)}
              className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              Reschedule Booking
            </button>
            <button className="text-sm justify-center flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
              <NotebookText className="h-4 w-4" />
              Add Notes
            </button>
            <button 
              onClick={() => setIsCancelModalOpen(true)}
              className="text-sm justify-center flex items-center gap-2 px-4 py-2 text-[#CC3A30] border border-[#F9AFA9] rounded-lg hover:bg-[#fff4f4]"
            >
              <XSquare className="h-4 w-4" /> 
              Cancel Booking
            </button>
          </div>
        )}
      </div>

      {/* Status Section - Only shown when accepted */}
      {isAccepted && (
        <>
          <div className="bg-white rounded-lg border border-[#DBDCDF] px-6 py-3">
  <h3 className="text-lg font-semibold mb-2">Status</h3>
  
  {/* Progress Steps */}
  <hr className="mb-4 text-[#DBDCDF]" />
  
  {/* Progress Steps */}
  <div className="flex items-start justify-between mb-1">
    {statusSteps.map((step, index) => (
      <div key={index} className="flex flex-col relative flex-1">
        {/* Progress Line */}
        {index < statusSteps.length - 1 && (
          <div
            className={`absolute top-3 h-0.5 ${
              step.inProgress 
              ? 'bg-[#F79009]' 
              : step.completed 
                ? 'bg-[#0F9C5A]' 
                : 'bg-gray-300'
            }`}
            style={{
              height: '3px',
              left: '32px', // Start after the circle
              right: '0', // Extend to the right edge
              width: 'calc(100% - 40px)', // Full width minus circle diameter
              borderRadius: '9px',
              zIndex: 0,
            }}
          />
        )}
        
        {/* Circle */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 relative z-10 ${
          step.completed 
            ? 'bg-[#0F9C5A] text-white' 
            : step.inProgress
              ? 'bg-[#F79009] text-white animate-pulse'
              : step.upcoming 
                ? 'bg-[#F79009] text-white'
                : 'bg-gray-200 text-gray-400'
        }`}>
          {step.completed ? (
            <Check className="h-4 w-4" />
          ) : (
            <div className="w-2 h-2 bg-current rounded-full" />
          )}
        </div>
        
        {/* Label and Date */}
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 mb-1">{step.label}</p>
          <p className="text-xs text-gray-500">{step.date}</p>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Shooting Section - Show timer or UploadWork */}
          {shootStatus !== 'uploading' ? (
            <div className="bg-white rounded-lg border border-[#DBDCDF] px-6 py-3">
              <h3 className="text-lg font-semibold mb-2">Shooting</h3>

              <hr className="mb-4 text-[#DBDCDF]" />
              
              <div className="bg-[#F5F6F6] rounded-lg p-5 text-center">
                {shootStatus === 'waiting' && (
                  <>
                    <p className="text-base text-[#101828] font-medium mb-4">Shoot Starts in</p>
                    <div className="flex items-center justify-center gap-4 text-4xl font-bold text-[#0F553E] mb-6">
                      <div className="text-center">
                        <div>{countdown.hours.toString().padStart(2, '0')}</div>
                        <div className="text-xs text-[#0F553E] font-normal">Hours</div>
                      </div>
                      <div className="text-[#0F553E]">:</div>
                      <div className="text-center">
                        <div>{countdown.minutes.toString().padStart(2, '0')}</div>
                        <div className="text-xs text-[#0F553E] font-normal">Mins</div>
                      </div>
                      <div className="text-[#0F553E]">:</div>
                      <div className="text-center">
                        <div>{countdown.seconds.toString().padStart(2, '0')}</div>
                        <div className="text-xs text-[#0F553E] font-normal">Secs</div>
                      </div>
                    </div>
                  </>
                )}

                {(shootStatus === 'ready' || shootStatus === 'shooting' || shootStatus === 'completed') && (
                  <>
                    <p className="text-base text-[#101828] font-medium mb-4">
                      {shootStatus === 'shooting' ? 'Shooting Time' : 'Shoot Starts in'}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-4xl font-bold text-[#CC3A30] mb-6">
                      <div className="text-center">
                        <div>
                          {shootStatus === 'shooting' || shootStatus === 'completed' 
                            ? shootingTime.hours.toString().padStart(2, '0')
                            : '00'
                          }
                        </div>
                        <div className="text-xs text-[#CC3A30] font-normal">Hours</div>
                      </div>
                      <div className="text-[#CC3A30]">:</div>
                      <div className="text-center">
                        <div>
                          {shootStatus === 'shooting' || shootStatus === 'completed'
                            ? shootingTime.minutes.toString().padStart(2, '0')
                            : '00'
                          }
                        </div>
                        <div className="text-xs text-[#CC3A30] font-normal">Mins</div>
                      </div>
                      <div className="text-[#CC3A30]">:</div>
                      <div className="text-center">
                        <div>
                          {shootStatus === 'shooting' || shootStatus === 'completed'
                            ? shootingTime.seconds.toString().padStart(2, '0')
                            : '00'
                          }
                        </div>
                        <div className="text-xs text-[#CC3A30] font-normal">Secs</div>
                      </div>
                    </div>
                  </>
                )}

                {/* Dynamic Button based on shoot status */}
                {shootStatus === 'ready' && (
                  <button 
                    onClick={handleStartShoot}
                    className="px-24 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-[#fcfcfc] text-sm font-normal flex items-center gap-2 mx-auto"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Start Shoot Now
                  </button>
                )}

                {shootStatus === 'shooting' && (
                  <button 
                    onClick={handleFinishShoot}
                    className="px-24 py-2 bg-[#CC3A30] text-white rounded-lg hover:bg-[#e23f36] text-sm font-normal flex items-center gap-2 mx-auto"
                  >
                    <CheckCircle className="h-4 w-4" color="white"/>
                    Finish Shoot
                  </button>
                )}

                {shootStatus === 'completed' && (
                  <button 
                    onClick={handleShootCompleted}
                    className="px-24 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-normal flex items-center gap-2 mx-auto"
                  >
                    <CheckCircle className="h-4 w-4" color="white"/>
                    Shoot Completed
                  </button>
                )}
              </div>
            </div>
          ) : (
            <UploadWork onUploadProgress={handleUploadProgress} />
          )}
        </>
      )}

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