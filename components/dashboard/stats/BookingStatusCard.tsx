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
    inProgress?: boolean;
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
     {   credentials: 'include',
        headers: { 'Content-Type': 'application/json' },}
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
      SHOOT_IN_PROGRESS: "Shoot in Progress",
      EDITING_IN_PROGRESS: "Editing",
      ORDER_DELIVERED: "Order Delivery"
    };

    // Get all possible statuses in order
    const allStatuses = [
      "BOOKING_CREATED",
      "PHOTOGRAPHER_ASSIGNED",
      "SHOOT_IN_PROGRESS",
      "EDITING_IN_PROGRESS",
      "ORDER_DELIVERED"
    ];

    // Find the current status index
    const currentStatus = apiData.statusHistory[0]?.status; // Assuming the first item is the latest
    const currentIndex = allStatuses.indexOf(currentStatus);

    // Create steps array
    const steps = allStatuses.map((status, index) => {
      const historyItem = apiData.statusHistory.find(item => item.status === status);
      const isCompleted = index < currentIndex;
      const isCurrent = index === currentIndex;
      
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
      } else if (isCurrent) {
        date = "Currently";
      } else if (status === "ORDER_DELIVERED" && currentIndex >= 3) {
        // Example: Estimate delivery date 3 days after editing starts
        const editingStartItem = apiData.statusHistory.find(item => item.status === "EDITING_IN_PROGRESS");
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
        inProgress: isCurrent && !isCompleted
      };
    });

    return {
      id: apiData.bookingId,
      steps
    };
  };

  const calculateProgress = () => {
    if (!bookingStatus) return { completed: 0, inProgress: 0 };
    
    const totalSteps = bookingStatus.steps.length;
    const completedSteps = bookingStatus.steps.filter(step => step.completed).length;
    const inProgressSteps = bookingStatus.steps.filter(step => step.inProgress).length;

    return {
      completed: (completedSteps / totalSteps) * 100,
      inProgress: (inProgressSteps / totalSteps) * 100
    };
  };

  const progress = calculateProgress();

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
        <h2 className="text-sm font-semibold mb-6">Booking#{bookingStatus.id} Status</h2>
 <div className="relative flex justify-between">
  {bookingStatus.steps.map((step, index) => {
    const isLastStep = index === bookingStatus.steps.length - 1;
    const isCompleted = step.completed;
    const isInProgress = step.inProgress;
    const nextStep = !isLastStep ? bookingStatus.steps[index + 1] : null;

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
              ${isCompleted ? 'bg-orange-500' : 
                isInProgress ? 'bg-gray-200' : 
                'bg-gray-200'}`}
          />
        )}
      </div>
    );
  })}
</div>
      </div>
    </div>
  )
}

export default BookingStatusCard;