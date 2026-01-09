import * as signalR from "@microsoft/signalr";

let connection = null;

export function connectChat(meetingId, token, handlers) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5213/chatHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", handlers.onMessage);
  connection.on("ReceiveHistory", handlers.onHistory);

  return connection
    .start()
    .then(() => connection.invoke("JoinRoom", meetingId));
}

export function sendMessage(meetingId, message) {
  return connection.invoke("SendMessage", meetingId, message);
}

export function disconnectChat() {
  if (connection) connection.stop();
}
