import React, { useEffect } from "react";
import { Class } from "@/context/ClassContext";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Generate hours from 8:00 to 20:00 (8am to 8pm)
const hours = Array.from({ length: 13 }, (_, i) => i + 8);

// Height of each hour cell in pixels (reduced from 64px)
const HOUR_CELL_HEIGHT = 56;

// Color mapping for different class types
const typeColors = {
  lecture: {
    bg: "bg-[#16b3d4]", // Soft teal
    border: "border-[#0e7a8f]", // Darker teal
  },
  lab: {
    bg: "bg-[#feca14]", // Soft yellow
    border: "border-[#d9a800]", // Darker yellow
  },
  seminar: {
    bg: "bg-[#ec745c]", // Soft coral
    border: "border-[#c85240]", // Darker coral
  },
  discussion: {
    bg: "bg-[#e85484]", // Soft pink
    border: "border-[#c03a68]", // Darker pink
  },
};

interface ClassCalendarProps {
  classes: Class[];
}

const ClassCalendar: React.FC<ClassCalendarProps> = ({ classes }) => {
  const classMeetings = classes.flatMap((classItem) => {
    return classItem.meetings.map((meeting) => {
      return {
        ...meeting,
        title: classItem.title,
        type: classItem.type,
        id: classItem.id,
      };
    });
  });

  const calculateHeight = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    const durationInMinutes = endInMinutes - startInMinutes;

    // Each hour block is now HOUR_CELL_HEIGHT pixels
    return `${(durationInMinutes / 60) * HOUR_CELL_HEIGHT}px`;
  };

  const calculateOffset = (startTime: string) => {
    const [hour, minute] = startTime.split(":").map(Number);
    // Calculate how far into the hour block we should start
    const offsetMinutes = minute;
    return `${(offsetMinutes / 60) * HOUR_CELL_HEIGHT}px`;
  };

  // Function to determine if a meeting belongs in a specific hour block
  const isMeetingInHourBlock = (
    meeting: any,
    day: string,
    hourValue: number
  ) => {
    if (meeting.day.toLowerCase() !== day.toLowerCase()) {
      return false;
    }

    // Ensure we're working with numbers for comparison
    const [meetingHour] = meeting.startTime.split(":").map(Number);

    // Debug log for problematic classes
    if (meeting.title === "Literature" || meeting.title === "Biology") {
      console.log(`Checking ${meeting.title} (ID: ${meeting.id}):`, {
        day: meeting.day,
        calendarDay: day,
        startTime: meeting.startTime,
        meetingHour,
        hourValue,
        matches: meetingHour === hourValue,
      });
    }

    return meetingHour === hourValue;
  };

  // Get the appropriate colors for a class type
  const getClassColors = (type: string) => {
    const colors = typeColors[type as keyof typeof typeColors] || {
      bg: "bg-indigo-800",
      border: "border-indigo-950",
    };
    return colors;
  };

  useEffect(() => {
    console.log("Classes in Calendar component:", classMeetings);

    // Debug specific classes that aren't showing up
    const literatureClass = classMeetings.filter(
      (m) => m.title === "Literature"
    );
    const biologyClasses = classMeetings.filter((m) => m.title === "Biology");

    console.log("Literature class meetings:", literatureClass);
    console.log("Biology class meetings:", biologyClasses);
  }, [classMeetings]);

  const formatHour = (hour: number) => {
    // Format with AM/PM
    if (hour < 12) {
      return `${hour}:00 AM`;
    } else if (hour === 12) {
      return `12:00 PM`;
    } else {
      return `${hour - 12}:00 PM`;
    }
  };

  return (
    <div className="grid grid-cols-[0.3fr_repeat(7,1fr)] gap-0 w-2/3 mb-12">
      <div></div> {/* Empty corner for time labels */}
      {daysOfWeek.map((day) => (
        <div
          key={day}
          className={`text-center text-sm bg-zinc-800 p-2 text-zinc-200 ${
            day === "Monday" ? "rounded-tl-xl" : ""
          } ${day === "Sunday" ? "rounded-tr-xl" : ""}`}
        >
          {day.slice(0, 3).toUpperCase()}
        </div>
      ))}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className="text-right my-auto pr-4 text-sm text-zinc-400">
            {formatHour(hour)}
          </div>
          {daysOfWeek.map((day) => (
            <div
              key={day + hour}
              className="border-b border-r border-zinc-800 bg-transparent relative"
              style={{ height: `${HOUR_CELL_HEIGHT}px` }}
            >
              {classMeetings.map((meeting, index) => {
                if (isMeetingInHourBlock(meeting, day, hour)) {
                  const height = calculateHeight(
                    meeting.startTime,
                    meeting.endTime
                  );
                  const topOffset = calculateOffset(meeting.startTime);
                  const colors = getClassColors(meeting.type);

                  return (
                    <div
                      key={index}
                      className={`absolute inset-x-0 rounded-t-sm ${colors.bg} text-left pl-4 text-zinc-50 overflow-hidden border-t-4 ${colors.border}`}
                      style={{
                        height: height,
                        top: topOffset,
                      }}
                    >
                      <div className="p-1 pb-0 pl-0 text-zinc-950 text-md font-semibold truncate">
                        {meeting.title}
                      </div>
                      <div className="pl-0 -mt-1 text-zinc-950 text-xs truncate">
                        {meeting.startTime} - {meeting.endTime}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ClassCalendar;
