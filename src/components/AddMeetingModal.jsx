console.log("MODAL RENDER");

import { useState } from "react";
import { createMeeting } from "../api";

export default function AddMeetingModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    maxParticipants: 5,
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT", form);
    await createMeeting({
      ...form,
      date: new Date(form.date).toISOString(),
    });
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Dodaj spotkanie</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Tytuł"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="date"
            required
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />

          <input
            type="number"
            name="maxParticipants"
            min="1"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
            value={form.maxParticipants}
          />

          <textarea
            name="description"
            placeholder="Opis"
            className="w-full border px-3 py-2 rounded"
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Anuluj
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
