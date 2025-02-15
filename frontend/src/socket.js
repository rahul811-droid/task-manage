import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; 

const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5, 
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server!");
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected from WebSocket server:", reason);
});

export default socket;
