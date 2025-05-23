"use client";
import { Check } from "lucide-react";
import Router from "next/router";
import React, { useEffect, useRef, useState } from "react";

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
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestMade = useRef(false); // Tracks if request has been made
  const abortControllerRef = useRef<AbortController | null>(null);
  const ignoreResponse = useRef(false); // Add this ref

  useEffect(() => {
    // Create new controller for each request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    ignoreResponse.current = false; // Reset ignore flag

    const fetchStatusHistory = async () => {
      try {
        console.log("Starting fetch request");
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:3000/api/bookings/status-history/last",
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            signal
          }
        );

        if (ignoreResponse.current) return; // Skip if component unmounted
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch status");
        }

        const data = await response.json();
        
        if (ignoreResponse.current) return; // Skip if component unmounted
        
        if (!data?.bookingId) {
          throw new Error("No booking data available");
        }

        const transformedData = transformStatusHistory(data);
        setBookingStatus(transformedData);
      } catch (err) {
        if (ignoreResponse.current) return; // Skip if component unmounted
        
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        }
      } finally {
        if (!ignoreResponse.current) {
          setLoading(false);
        }
      }
    };

    fetchStatusHistory();

    return () => {
      // Mark that we should ignore the response
      ignoreResponse.current = true;
      // Abort any ongoing request
      abortControllerRef.current?.abort();
    };
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
      COMPLETED: "Order Delivery",
    };

    // Get all possible statuses in order
    const allStatuses = [
      "BOOKING_CREATED",
      "PHOTOGRAPHER_ASSIGNED",
      "SHOOTING",
      "EDITING",
      "COMPLETED",
    ];
    // Sort the status history by creation date (newest first)
    const sortedHistory = [...apiData.statusHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Find the current status
    const currentStatus = sortedHistory[0]?.status || ""; // Most recent status
    const currentIndex = allStatuses.indexOf(currentStatus);

    // Next step is the one after the current status
    const nextStepIndex = currentIndex + 1;

    // Create steps array
    const steps = allStatuses.map((status, index) => {
      const historyItem = sortedHistory.find((item) => item.status === status);

      // A step is completed if it's the current status or any previous step
      const isCompleted = index <= currentIndex;

      // A step is in progress if it's the next step after current status
      const isInProgress = index === nextStepIndex;

      let date = "Pending";
      if (historyItem) {
        const dateObj = new Date(historyItem.createdAt);
        date = dateObj.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      } else if (status === "ORDER_DELIVERED" && currentIndex >= 3) {
        // Example: Estimate delivery date 3 days after editing starts
        const editingStartItem = sortedHistory.find(
          (item) => item.status === "EDITING_IN_PROGRESS"
        );
        if (editingStartItem) {
          const deliveryDate = new Date(editingStartItem.createdAt);
          deliveryDate.setDate(deliveryDate.getDate() + 3);
          date = `Expected ${deliveryDate.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`;
        }
      }

      return {
        label: statusMap[status] || status,
        date,
        completed: isCompleted,
        inProgress: isInProgress,
      };
    });

    return {
      id: apiData.bookingId,
      steps,
    };
  };
  // Debug logs for state changes
  console.log("Current state:", { loading, error, bookingStatus });
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Parse error message
    let displayError = error;
    try {
      const errorObj = JSON.parse(error);
      if (errorObj.error) {
        displayError = errorObj.error;
      }
    } catch (e) {
      // Not JSON, use as-is
    }

    const isNoBookingsError = displayError.includes('No bookings') || 
                             displayError.includes('You haven\'t made any bookings yet');

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className={`text-center p-4 rounded-lg ${
          isNoBookingsError ? 'bg-[#F0F7F4] text-[#0D4835]' : 'bg-red-50 text-red-800'
        }`}>
          <h3 className="font-medium">
            {isNoBookingsError ? 'No Bookings Found' : 'Error Loading Status'}
          </h3>
          <p className="text-sm mt-1">{displayError}</p>
          {isNoBookingsError ? (
            <button 
              className="mt-3 px-4 py-2 bg-[#0D4835] text-white rounded-md hover:bg-[#0D4835]/90 text-sm"
              onClick={() => Router.push('/booking')}
            >
              Create New Booking
            </button>
          ) : (
            <button 
              className="mt-3 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!bookingStatus) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center p-4 text-gray-500">
          No booking status information available
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-semibold mb-6">
          Booking #{bookingStatus.id.substring(0, 8)} Status
        </h2>
        <div className="relative flex justify-between">
          {bookingStatus.steps.map((step, index) => {
            const isLastStep = index === bookingStatus.steps.length - 1;
            const isCompleted = step.completed;
            const isInProgress = step.inProgress;

            return (
              <div
                key={index}
                className="flex flex-col items-center relative"
                style={{ width: `${100 / bookingStatus.steps.length}%` }}
              >
                {/* Step Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 relative z-10
                  ${
                    isCompleted
                      ? "bg-emerald-500"
                      : isInProgress
                      ? "bg-orange-500"
                      : "bg-gray-200"
                  }`}
                >
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
                      ${
                        isCompleted &&
                        !bookingStatus.steps[index + 1].inProgress
                          ? "bg-emerald-500"
                          : isCompleted &&
                            bookingStatus.steps[index + 1].inProgress
                          ? "bg-orange-500"
                          : "bg-gray-200"
                      }`}
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
