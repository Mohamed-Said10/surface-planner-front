"use client";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface BookingStatus {
  id: string;
  steps: {
    label: string;
    date: string;
    completed: boolean;
    inProgress: boolean;
  }[];
}

interface BookingStatusCardProps {
  bookingStatus: BookingStatus | null;
  loading: boolean;
  error: string | null;
  shortId: string;  // Short ID for the booking, used in the header   
  onRetry?: () => void;
}

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({
  bookingStatus,
  loading,
  error,
  shortId,
  onRetry
}) => {
  const router = useRouter();
  console.log("BookingStatusCard props:", { loading, error, bookingStatus });

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
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
      <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
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
              onClick={() => router.push('/booking')}
            >
              Create New Booking
            </button>
          ) : (
            <button 
              className="mt-3 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm"
              onClick={onRetry || (() => window.location.reload())}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!bookingStatus && !loading) {
    return (
      <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
        <div className="text-center p-4 bg-[#F0F7F4] rounded-lg">
          <h3 className="font-medium text-[#0D4835]">No Active Bookings</h3>
          <p className="text-sm mt-1 text-[#0D4835]/80">You haven't made any bookings yet. Create your first booking to get started!</p>
          <button
            className="mt-3 px-4 py-2 bg-[#0D4835] text-white rounded-md hover:bg-[#0D4835]/90 text-sm"
            onClick={() => router.push('/booking')}
          >
            Create New Booking
          </button>
        </div>
      </div>
    );
  }

  // Ensure bookingStatus exists before rendering
  if (!bookingStatus) {
    return null;
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
        <h2 className="text-sm font-semibold mb-6">
          Booking #{shortId} Status
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