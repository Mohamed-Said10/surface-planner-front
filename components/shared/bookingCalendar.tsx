import React from "react";

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

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  currentDay,
  currentHour,
}) => {
  const hours = Array.from({ length: 8 }, (_, i) => i + 9); // 9 AM to 4 PM

  // Dynamically compute the base week start date from the earliest booking
  const today = React.useMemo(() => {
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

  const alignedDay = currentDay ?? today.getDay();
  const alignedHour = currentHour ?? today.getHours();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden p-4">
      <div className="pt-6 pb-2 text-lg font-semibold">Your Bookings</div>
      <hr className="my-4 border-[#C3C5C9]" />

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] bg-white border-b border-gray-300 text-sm text-center font-medium text-gray-600">
          <div className="bg-white" />
          {days.map((day, i) => (
            <div
              key={i}
              className="py-3 border-l border-gray-300 flex flex-col items-center justify-center"
            >
              <div className="text-xs mb-1">
                {alignedDay === i ? (
                  <span className="inline-flex w-7 h-7 rounded-full bg-[#0F553E] text-white items-center justify-center">
                    {dates[i].getDate()}
                  </span>
                ) : (
                  <span>{dates[i].getDate()}</span>
                )}
              </div>
              <div>{day}</div>
            </div>
          ))}

        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))]">
          {/* Time Column */}
          <div className="flex flex-col text-xs text-right text-gray-500">
            {hours.map((hour, i) => (
              <div key={i} className="h-14 px-2 flex items-center justify-end">
                {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Booking Columns */}
          {Array.from({ length: 7 }, (_, dayIndex) => (
            <div key={dayIndex} className="relative border-l border-gray-300">
              {hours.map((_, i) => (
                <div
                  key={i}
                  className={`h-14 ${i < hours.length - 1 ? "border-b border-gray-300" : ""}`}
                ></div>
              ))}

              {/* Booking Blocks */}
              {bookings
                .filter((booking) => {
                  console.log('booking',booking)
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
                        className="absolute left-1 w-[94%] bg-[#C5D6D1] rounded-md text-xs p-1.5 shadow"
                        style={{
                          top: `calc(${top}% + 2px)`,
                          height: `calc(${height}% - 6px)`,
                        }}
                      >
                        <div className="font-medium">{booking.street}</div>
                        <div>
                          {startHour <= 12
                            ? `${startHour}am`
                            : `${startHour - 12}pm`}{" "}
                          -{" "}
                          {endHour <= 12
                            ? `${endHour}am`
                            : `${endHour - 12}pm`}
                        </div>
                      </div>
                    );
                  } catch (err) {
                    console.error(
                      "Error parsing booking timeSlot:",
                      booking.timeSlot,
                      err
                    );
                    return null;
                  }
                })}

              {/* Current Time Indicator */}
              {dayIndex === alignedDay &&
                alignedHour >= 9 &&
                alignedHour <= 16 && (
                  <div
                    className="absolute left-0 w-full flex items-center"
                    style={{
                      top: `${((alignedHour - 9) * 100) / hours.length}%`,
                    }}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full -ml-1.5"></div>
                    <div className="h-0.5 bg-red-500 w-full ml-1"></div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BookingCalendar