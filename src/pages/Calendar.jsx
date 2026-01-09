import { useState, useEffect } from "react";
import { getMeetings } from "../api";

export default function Calendar() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        setMeetings(data);
      } catch (err) {
        console.error("Błąd podczas pobierania spotkań:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMeetingsForDate = (day) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === currentDate.getMonth() &&
        meetingDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const daysOfWeek = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];
  const monthName = currentDate.toLocaleString("pl-PL", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Ładowanie spotkań...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kalendarz spotkań</h1>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            ← Poprzedni
          </button>
          <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Następny →
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-bold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const meetingsOnDay = day ? getMeetingsForDate(day) : [];
            const isToday =
              day &&
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 rounded-lg border-2 transition ${
                  !day
                    ? "bg-gray-50 border-gray-100"
                    : isToday
                    ? "bg-blue-100 border-blue-400"
                    : meetingsOnDay.length > 0
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {day && (
                  <>
                    <div className="font-bold text-lg mb-1">{day}</div>
                    <div className="space-y-1">
                      {meetingsOnDay.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="text-xs bg-blue-500 text-white p-1 rounded truncate hover:bg-blue-600 cursor-pointer"
                          title={meeting.title}
                        >
                          {meeting.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming meetings */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Nadchodzące spotkania</h2>
        {meetings.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
            Brak spotkań
          </div>
        ) : (
          <div className="space-y-3">
            {meetings
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((meeting) => {
                const meetingDate = new Date(meeting.date);
                const dateStr = meetingDate.toLocaleDateString("pl-PL", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                const timeStr = meetingDate.toLocaleTimeString("pl-PL", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={meeting.id}
                    className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {meeting.title}
                      </h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {timeStr}
                      </span>
                    </div>
                    {meeting.description && (
                      <p className="text-gray-600 mb-2">
                        {meeting.description}
                      </p>
                    )}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{dateStr}</span>
                      <span>
                        Uczestnicy: {meeting.userMeetings?.length || 0}/
                        {meeting.maxParticipants}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
