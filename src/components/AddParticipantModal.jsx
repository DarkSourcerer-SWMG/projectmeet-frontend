import { useState, useEffect } from "react";
import { addParticipantByEmail, getUsers } from "../api";

export default function AddParticipantModal({ meetingId, onClose, onAdded }) {
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        setError("Błąd podczas pobierania użytkowników");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleSelectUser = (user) => {
    setEmail(user.email);
    setSearchQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Podaj poprawny email");
      return;
    }

    setLoading(true);
    try {
      await addParticipantByEmail(email, meetingId);
      setSuccess("Użytkownik dodany");
      onAdded && onAdded();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.message || "Błąd podczas dodawania uczestnika");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Dodaj uczestnika</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wyszukaj użytkownika
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wpisz nazwę lub email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loadingUsers ? (
            <div className="text-center py-4 text-gray-500">
              Ładowanie użytkowników...
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition"
                >
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-4 text-gray-500">
              Brak wyników dla "{searchQuery}"
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-200 last:border-b-0 transition"
                >
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email do dodania
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="użytkownik@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Anuluj
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Dodawanie..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
