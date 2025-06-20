import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Booking = {
  id: string;
  appointmentDate: string;
  timeSlot: string;
  street: string;
};

interface BookingCalendarProps {
  bookings: Booking[];
  currentDay?: number;
  currentHour?: number;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  currentDay,
  currentHour,
}) => {
  const hours = Array.from({ length: 8 }, (_, i) => i + 9); // 9am to 4pm

  // State to manage current week
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate base date (current week or first booking)
  const baseDate = React.useMemo(() => {
    if (bookings.length === 0) return new Date();

    const sorted = [...bookings].sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );
    const earliestDate = new Date(sorted[0].appointmentDate);
    const startOfWeek = new Date(earliestDate);
    startOfWeek.setDate(earliestDate.getDate() - earliestDate.getDay());
    return startOfWeek;
  }, [bookings]);

  // Calculate displayed week based on offset
  const currentWeekStart = React.useMemo(() => {
    const weekStart = new Date(baseDate);
    weekStart.setDate(baseDate.getDate() + (weekOffset * 7));
    return weekStart;
  }, [baseDate, weekOffset]);

  const alignedDay = currentDay ?? new Date().getDay();
  const alignedHour = currentHour ?? new Date().getHours();

  // Generate the 7 days of current week
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  // Check if it's the current week
  const today = new Date();
  const isCurrentWeek = dates.some(date => 
    date.toDateString() === today.toDateString()
  );

  // Count bookings for the displayed week
  const bookingsThisWeek = bookings.filter(booking => {
    const appointmentDate = new Date(booking.appointmentDate);
    return dates.some(date => 
      appointmentDate.toDateString() === date.toDateString()
    );
  });

  // Navigation functions
  const goToPreviousWeek = () => setWeekOffset(prev => prev - 1);
  const goToNextWeek = () => setWeekOffset(prev => prev + 1);
  const goToCurrentWeek = () => setWeekOffset(0);

  // Format displayed period
  const formatWeekRange = () => {
    const start = dates[0];
    const end = dates[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
    } else {
      return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden p-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-semibold">Your Bookings</div>
          <div className="text-sm text-gray-600">{formatWeekRange()}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Previous week"
          >
            <ChevronLeft size={20} />
          </button>
          
          {!isCurrentWeek && (
            <button
              onClick={goToCurrentWeek}
              className="px-3 py-1 text-sm bg-[#0F553E] text-white rounded-md hover:bg-[#0d4a36] transition-colors"
            >
              Today
            </button>
          )}
          
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Next week"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Bookings count indicator */}
      <div className="mb-4 text-sm text-gray-600">
        {bookingsThisWeek.length} booking{bookingsThisWeek.length !== 1 ? 's' : ''} this week
      </div>

      <hr className="my-4 border-[#C3C5C9]" />

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] bg-white border-b border-gray-300 text-sm text-center font-medium text-gray-600">
          <div className="bg-white" />
          {days.map((day, i) => {
            const isToday = isCurrentWeek && alignedDay === i;
            return (
              <div
                key={i}
                className="py-3 border-l border-gray-300 flex flex-col items-center justify-center"
              >
                <div className="text-xs mb-1">
                  {isToday ? (
                    <span className="inline-flex w-7 h-7 rounded-full bg-[#0F553E] text-white items-center justify-center">
                      {dates[i].getDate()}
                    </span>
                  ) : (
                    <span className={dates[i].toDateString() === today.toDateString() ? 'font-bold text-[#0F553E]' : ''}>
                      {dates[i].getDate()}
                    </span>
                  )}
                </div>
                <div>{day}</div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))]">
          {/* Hours column */}
          <div className="flex flex-col text-xs text-right text-gray-500">
            {hours.map((hour, i) => (
              <div key={i} className="h-14 px-2 flex items-center justify-end">
                {hour <= 12 ? `${hour}h` : `${hour}h`}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {Array.from({ length: 7 }, (_, dayIndex) => (
            <div key={dayIndex} className="relative border-l border-gray-300">
              {hours.map((_, i) => (
                <div
                  key={i}
                  className={`h-14 ${i < hours.length - 1 ? "border-b border-gray-300" : ""}`}
                ></div>
              ))}

              {/* Booking blocks */}
              {bookings
                .filter((booking) => {
                  const appointmentDate = new Date(booking.appointmentDate);
                  return (
                    appointmentDate.toDateString() ===
                    dates[dayIndex].toDateString()
                  );
                })
                .map((booking) => {
                  try {
                    const time = booking.timeSlot?.toUpperCase().replace(/\s/g, "");
                    if (!time) return null;

                    let startHour: number;
                    let endHour: number;

                    if (time.includes("-")) {
                      const [start, end] = time.split("-");
                      const parseTime = (t: string) => {
                        const hour = parseInt(t);
                        return t.includes("PM") && hour < 12 ? hour + 12 : hour;
                      };
                      startHour = parseTime(start);
                      endHour = parseTime(end);
                    } else {
                      const hour = parseInt(time);
                      startHour = time.includes("PM") && hour < 12 ? hour + 12 : hour;
                      endHour = startHour + 2;
                    }

                    if (startHour < 9 || endHour > 17) return null;

                    const top = ((startHour - 9) * 100) / hours.length;
                    const height = ((endHour - startHour) * 100) / hours.length;

                    return (
                      <div
                        key={booking.id}
                        className="absolute left-1 w-[94%] bg-[#C5D6D1] rounded-md text-xs p-1.5 shadow hover:bg-[#b8cac4] transition-colors cursor-pointer"
                        style={{
                          top: `calc(${top}% + 2px)`,
                          height: `calc(${height}% - 6px)`,
                        }}
                        title={`${booking.street} - ${booking.timeSlot}`}
                      >
                        <div className="font-medium truncate">{booking.street}</div>
                        <div className="text-gray-600">
                          {startHour <= 12
                            ? `${startHour}h`
                            : `${startHour}h`}{" "}
                          -{" "}
                          {endHour <= 12
                            ? `${endHour}h`
                            : `${endHour}h`}
                        </div>
                      </div>
                    );
                  } catch (err) {
                    console.error(
                      "Error parsing timeSlot:",
                      booking.timeSlot,
                      err
                    );
                    return null;
                  }
                })}

              {/* Current time indicator */}
              {isCurrentWeek &&
                dayIndex === alignedDay &&
                alignedHour >= 9 &&
                alignedHour <= 16 && (
                  <div
                    className="absolute left-0 w-full h-0 flex items-center z-10"
                    style={{
                      top: `${((alignedHour - 9 + 0.5) * 100) / hours.length}%`,
                    }}
                  >
                    <div className="mx-2 flex items-center w-full">
                      <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5"></div>
                      <div className="h-0.5 bg-red-500 flex-1"></div>
                    </div>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message if no bookings */}
      {bookingsThisWeek.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No booking this week
        </div>
      )}
    </div>
  );
};