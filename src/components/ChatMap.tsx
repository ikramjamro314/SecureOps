"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSession } from "next-auth/react";

// WebSocket Connection (mock-safe)
let socket: any = {
  on: () => {},
  off: () => {},
  emit: () => {},
};

if (typeof window !== "undefined") {
  try {
    socket = io("ws://localhost:5000", {
      transports: ["websocket"],
      reconnectionAttempts: 1,
      timeout: 2000,
    });
  } catch (err) {
    console.warn("Socket server unavailable, using client state fallback");
  }
}

// Custom Marker Icon helper
const getCustomIcon = () => {
  if (typeof window === "undefined") return undefined as any;
  return new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

// ChatBox Component
const ChatBox = ({ guardId, userId }: { guardId: string; userId: string }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on(`${userId}-chat-${guardId}`, (msg: any) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off(`chat-${userId}-${guardId}`);
    };
  }, [userId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = { sender: "guard", text: message };
    socket.emit("sendMessage", { userId, guardId, message: msg });
    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div className="w-64 p-2 bg-white shadow-md border rounded-lg">
      <div className="h-40 overflow-y-auto border-b p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-1 my-1 rounded-md ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 p-1 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Main Map Component
export default function LiveLocation() {
  const { data } = useSession();
  const userId = data?.user?.id;

  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [users, setUsers] = useState<{ [key: string]: { lat: number; lng: number } }>({});

  useEffect(() => {
    if (!userId) return;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          socket.emit("updateLocation", { userId, lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [userId]);

  useEffect(() => {
    socket.on("broadcastLocation", (data: any) => {
      setUsers(data);
    });

    return () => {
      socket.off("broadcastLocation");
    };
  }, []);

  return (
    <div className="w-full relative">
      <MapContainer
        center={location.lat !== null && location.lng !== null ? [location.lat, location.lng] : [20, 78]}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
        className="relative"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {location.lat !== null && location.lng !== null && (
          <Marker position={[location.lat, location.lng]} icon={getCustomIcon()}>
            <Popup>You are here!</Popup>
          </Marker>
        )}

        {Object.entries(users).map(([id, user]) => (
          <Marker key={id} position={[user.lat, user.lng]} icon={getCustomIcon()}>
            {id === userId ? (
              <Popup>You are here!</Popup>
            ) : (
              <Popup>
                <strong>Guard ID: {id}</strong>
                <ChatBox guardId={id} userId={userId || ""} />
              </Popup>
            )}

          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
