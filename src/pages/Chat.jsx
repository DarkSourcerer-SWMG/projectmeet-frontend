import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMeetings } from "../api";

function Chat() {
  const { meetingid } = useParams();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [meetingName, setMeetingName] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMeetingName = async () => {
      try {
        const meetings = await getMeetings();
        const meeting = meetings.find((m) => m.id === parseInt(meetingid));
        if (meeting) {
          setMeetingName(meeting.title);
        }
      } catch (err) {
        console.error("Błąd podczas pobierania nazwy spotkania:", err);
      }
    };
    fetchMeetingName();
  }, [meetingid]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token from localStorage:", token);

    if (!token) {
      console.error("❌ No token found in localStorage!");
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5213/chatHub?access_token=${token}`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("✅ SignalR connected");
        setIsConnected(true);

        const parsedMeetingId = parseInt(meetingid, 10);
        console.log(`📍 Calling JoinRoom with meetingId: ${parsedMeetingId}`);

        connection
          .invoke("JoinRoom", parsedMeetingId)
          .then(() => {
            console.log("✅ JoinRoom succeeded");
          })
          .catch((err) => {
            console.error("❌ JoinRoom error:", err);
          });

        connection.on("ReceiveHistory", (history) => {
          console.log("📜 Received chat history:", history);
          setMessages(history);
        });

        connection.on("ReceiveMessage", (user, message, sentAt) => {
          console.log("💬 Received message:", { user, message, sentAt });
          setMessages((prev) => [...prev, { user, message, sentAt }]);
        });
      })
      .catch((err) => {
        console.error("❌ SignalR error:", err);
        setIsConnected(false);
      });

    setConnection(connection);

    return () => {
      setIsConnected(false);
      connection.stop();
    };
  }, [meetingid]);

  const sendMessage = async () => {
    if (!connection || !text.trim()) return;

    const parsedMeetingId = parseInt(meetingid, 10);
    try {
      await connection.invoke("SendMessage", parsedMeetingId, text);
      setText("");
    } catch (err) {
      console.error("❌ Send message error:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          {meetingName || `Meeting #${meetingid}`}
        </h1>
        <p
          className={`text-sm mt-1 ${
            isConnected ? "text-green-600" : "text-red-600"
          }`}
        >
          {isConnected ? "✅ Connected" : "❌ Disconnected"}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Brak wiadomości. Zacznij rozmowę!
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-blue-600">{m.user}</span>
                {m.sentAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(m.sentAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <p className="text-gray-800 mt-1 break-words">{m.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg p-4">
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Wpisz wiadomość... (Enter to send, Shift+Enter for new line)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !text.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              isConnected && text.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Wyślij
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
