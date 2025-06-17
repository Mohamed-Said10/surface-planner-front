import React from "react";

type Booking = {
  title: string;
  day: number;
  startHour: number;
  endHour: number;
};

interface BookingCalendarProps {
  bookings: Booking[];
  currentDay?: number;
  currentHour?: number;
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dates = [17, 18, 19, 20, 21, 22, 23];

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  currentDay = new Date().getDay(),
  currentHour = new Date().getHours(),
}) => {
  const hours = Array.from({ length: 8 }, (_, i) => i + 9);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden p-4">
      {/* Title */}
      <div className="pt-6 pb-2 text-lg font-semibold">
        Your Bookings
      </div>

      <hr className="my-4 border-[#C3C5C9]" />

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] bg-white border-b border-gray-300 text-sm text-center font-medium text-gray-600">
          <div className="bg-white" /> {/* Time Column Empty */}
          {days.map((day, i) => (
            <div key={i} className="py-3 border-l border-gray-300">
              <div className="text-xs mb-1">
                {currentDay === i ? (
                  <span className="inline-block w-7 h-7 rounded-full bg-green-700 text-white leading-7">
                    {dates[i]}
                  </span>
                ) : (
                  <span>{dates[i]}</span>
                )}
              </div>
              <div>{day}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))]">
          {/* Time Labels Column */}
          <div className="flex flex-col border-r border-gray-300 text-xs text-right text-gray-500">
            {hours.map((hour, i) => (
              <div key={i} className="h-14 px-2 pt-1 border-b border-gray-300">
                {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Booking Grid Columns */}
          {Array.from({ length: 7 }, (_, dayIndex) => (
            <div key={dayIndex} className="relative border-l border-gray-300">
              {/* Horizontal Lines */}
              {hours.map((_, i) => (
                <div
                  key={i}
                  className="h-14 border-b border-gray-300"
                ></div>
              ))}

              {/* Booking Blocks */}
              {bookings
                .filter((b) => b.day === dayIndex)
                .map((b, index) => {
                  const top = ((b.startHour - 9) / hours.length) * 100;
                  const height =
                    ((b.endHour - b.startHour) / hours.length) * 100;
                  return (
                    <div
                      key={index}
                      className="absolute left-1 w-[94%] bg-[#C5D6D1] rounded-md text-xs p-1.5 shadow"
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                      }}
                    >
                      <div className="font-medium">{b.title}</div>
                      <div>
                        {b.startHour <= 12
                          ? `${b.startHour}am`
                          : `${b.startHour - 12}pm`}{" "}
                        -{" "}
                        {b.endHour <= 12
                          ? `${b.endHour}am`
                          : `${b.endHour - 12}pm`}
                      </div>
                    </div>
                  );
                })}

              {/* Current Time Line */}
              {dayIndex === currentDay && currentHour >= 9 && currentHour <= 16 && (
                <div
                  className="absolute left-0 w-full flex items-center"
                  style={{
                    top: `${((currentHour - 3) / hours.length) * 100}%`,
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
