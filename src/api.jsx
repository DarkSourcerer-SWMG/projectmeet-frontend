export async function deleteMeeting(meetingId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/Meetings/${meetingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete meeting");
}
const API_URL = "https://projectmeet-backend.onrender.com/api";

export async function register(data) {
  const res = await fetch(`${API_URL}/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Rejestracja nie powiodła się");
  }

  return json;
}

export async function getMeetings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/Meetings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
}

export async function createMeeting(meeting) {
  const token = localStorage.getItem("token");

  console.log("CREATE MEETING TOKEN:", token);

  const res = await fetch(`${API_URL}/Meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: meeting.title,
      description: meeting.description || "",
      date: new Date(meeting.date).toISOString(),
      maxParticipants: Number(meeting.maxParticipants),
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create meeting");
  }

  return res.json();
}

export async function getUsers() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/Meetings/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function addParticipantByEmail(email, meetingId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/Meetings/addParticipant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, meetingId }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to add participant");
  }

  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) throw new Error("Invalid credentials");
  return res.json(); // { token }
}
