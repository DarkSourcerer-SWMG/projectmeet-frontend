import { useEffect, useState } from "react";
import { getMeetings } from "../api";
import MeetingCard from "../components/MeetingCard";
import AddMeetingModal from "../components/AddMeetingModal";

export default function Meetings() {
  const [showAdd, setShowAdd] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMeetings = () => {
    setLoading(true);
    getMeetings()
      .then(setMeetings)
      .catch(() => setError("Nie udało się pobrać spotkań"))
      .finally(() => setLoading(false));
  };

  useEffect(loadMeetings, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Ładowanie spotkań...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Spotkania projektowe
      </h1>
      <button
        onClick={() => {
          console.log("CLICK ADD");
          setShowAdd(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        + Dodaj spotkanie
      </button>

      {meetings.length === 0 ? (
        <p className="text-gray-600">Brak dostępnych spotkań</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} onDeleted={loadMeetings} />
          ))}
        </div>
      )}
      {showAdd && (
        <AddMeetingModal
          onClose={() => setShowAdd(false)}
          onCreated={loadMeetings}
        />
      )}
    </div>
  );
}
