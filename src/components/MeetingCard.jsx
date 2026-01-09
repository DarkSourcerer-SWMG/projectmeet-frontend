import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddParticipantModal from "./AddParticipantModal";
import { deleteMeeting } from "../api";

export default function MeetingCard({ meeting }) {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć to spotkanie?")) return;
    setDeleting(true);
    try {
      await deleteMeeting(meeting.id);
      window.location.reload();
    } catch (e) {
      alert("Nie udało się usunąć spotkania");
    }
    setDeleting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{meeting.title}</h2>

        <p className="text-gray-500 text-sm mt-1">
          {new Date(meeting.date).toLocaleString()}
        </p>

        <p className="text-gray-600 mt-3">
          {meeting.description || "Brak opisu"}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Max uczestników: {meeting.maxParticipants}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => navigate(`/chat/${meeting.id}`)}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Chat
        </button>

        <button
          onClick={() => setShowAdd(true)}
          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          Dodaj uczestnika
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
          disabled={deleting}
        >
          {deleting ? "Usuwanie..." : "Usuń"}
        </button>
      </div>

      {showAdd && (
        <AddParticipantModal
          meetingId={meeting.id}
          onClose={() => setShowAdd(false)}
          onAdded={() => window.location.reload()}
        />
      )}
    </div>
  );
}
