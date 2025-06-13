"use client";
import { Check } from "lucide-react";
import Router from "next/router";
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
  onRetry?: () => void;
}

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({
  bookingStatus,
  loading,
  error,
  onRetry
}) => {
  console.log("BookingStatusCard props:", { loading, error, bookingStatus });

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
              onClick={onRetry || (() => window.location.reload())}
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
          <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-[#DBDCDF] p-6">
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