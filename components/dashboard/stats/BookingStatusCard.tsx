"use client"
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface StatusHistory {
  id: string;
  bookingId: string;
  userId: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

interface BookingStatus {
  id: string;
  steps: {
    label: string;
    date: string;
    completed: boolean;
    inProgress: boolean;
  }[];
}

const BookingStatusCard = () => {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/bookings/status-history/last',
          {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch status history');
        }
        const data = await response.json();
        
        // Transform the API data into the format your component expects
        const transformedData = transformStatusHistory(data);
        setBookingStatus(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStatusHistory();
  }, []);

  const transformStatusHistory = (apiData: {
    bookingId: string;
    statusHistory: StatusHistory[];
  }): BookingStatus => {
    // Map API status to your display labels
    const statusMap: Record<string, string> = {
      BOOKING_CREATED: "Booking Requested",
      PHOTOGRAPHER_ASSIGNED: "Photographer Assigned",
      SHOOTING: "Shoot in Progress",
      EDITING: "Editing",
      COMPLETED: "Order Delivery"
    };

    // Get all possible statuses in order
      const allStatuses = [
      "BOOKING_CREATED",
      "PHOTOGRAPHER_ASSIGNED",
      "SHOOTING",
      "EDITING",
      "COMPLETED"
    ];
    // Sort the status history by creation date (newest first)
    const sortedHistory = [...apiData.statusHistory].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Find the current status
    const currentStatus = sortedHistory[0]?.status || ""; // Most recent status
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    // Next step is the one after the current status
    const nextStepIndex = currentIndex + 1;

    // Create steps array
    const steps = allStatuses.map((status, index) => {
      const historyItem = sortedHistory.find(item => item.status === status);
      
      // A step is completed if it's the current status or any previous step
      const isCompleted = index <= currentIndex;
      
      // A step is in progress if it's the next step after current status
      const isInProgress = index === nextStepIndex;
      
      let date = "Pending";
      if (historyItem) {
        const dateObj = new Date(historyItem.createdAt);
        date = dateObj.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      } else if (status === "ORDER_DELIVERED" && currentIndex >= 3) {
        // Example: Estimate delivery date 3 days after editing starts
        const editingStartItem = sortedHistory.find(item => item.status === "EDITING_IN_PROGRESS");
        if (editingStartItem) {
          const deliveryDate = new Date(editingStartItem.createdAt);
          deliveryDate.setDate(deliveryDate.getDate() + 3);
          date = `Expected ${deliveryDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}`;
        }
      }

      return {
        label: statusMap[status] || status,
        date,
        completed: isCompleted,
        inProgress: isInProgress
      };
    });

    return {
      id: apiData.bookingId,
      steps
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bookingStatus) {
    return <div>No booking status found</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-semibold mb-6">Booking #{bookingStatus.id.substring(0, 8)} Status</h2>
        <div className="relative flex justify-between">
          {bookingStatus.steps.map((step, index) => {
            const isLastStep = index === bookingStatus.steps.length - 1;
            const isCompleted = step.completed;
            const isInProgress = step.inProgress;

            return (
              <div key={index} className="flex flex-col items-center relative" style={{ width: `${100 / bookingStatus.steps.length}%` }}>
                {/* Step Circle */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 relative z-10
                  ${isCompleted ? 'bg-emerald-500' : 
                    isInProgress ? 'bg-orange-500' : 
                    'bg-gray-200'}`}>
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Labels */}
                <div className="text-center">
                  <div className="text-xs font-medium">{step.label}</div>
                  <div className="text-xs text-gray-500">{step.date}</div>
                </div>

                {/* Line to next step (except after last step) */}
                {!isLastStep && (
                  <div 
                    className={`absolute top-3 h-[2px] w-full -right-1/2 z-0
                      ${isCompleted && !bookingStatus.steps[index + 1].inProgress ? 'bg-emerald-500' : 
                        (isCompleted && bookingStatus.steps[index + 1].inProgress) ? 'bg-orange-500' : 
                        'bg-gray-200'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStatusCard;