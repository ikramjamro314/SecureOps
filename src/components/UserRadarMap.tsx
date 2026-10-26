"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Shield, Radio, Navigation, CheckCircle2, AlertTriangle, Send, RefreshCw, Compass } from "lucide-react";
import { INITIAL_GUARDS } from "@/utils/mockStore";
import { fetchInstantRealLocation, DEFAULT_GEOFENCE_BASE } from "@/helpers/map";

const residentIcon = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const guardIcon = new L.DivIcon({
  className: "custom-guard-pin",
  html: `<div style="background-color: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 14px;">🛡️</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

export default function UserRadarMap() {
  const [userLocation, setUserLocation] = useState<[number, number]>([
    DEFAULT_GEOFENCE_BASE.lat,
    DEFAULT_GEOFENCE_BASE.lng,
  ]);
  const [accuracy, setAccuracy] = useState<number>(10);
  const [isRealGPS, setIsRealGPS] = useState(false);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);

  const [escortStatus, setEscortStatus] = useState<string | null>(null);
  const [radioMsg, setRadioMsg] = useState("");
  const [radioLogs, setRadioLogs] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "Dispatch", text: "Perimeter Sector 4 secured. 3 patrol units active.", time: "10:14 AM" }
  ]);

  // Instant real location acquisition
  const acquireInstantLocation = useCallback(async () => {
    setIsFetchingGPS(true);
    try {
      const fix = await fetchInstantRealLocation();
      setUserLocation([fix.lat, fix.lng]);
      setAccuracy(fix.accuracy);
      setIsRealGPS(true);
    } catch (err: any) {
      console.warn("User radar real GPS notice:", err?.message || err);
    } finally {
      setIsFetchingGPS(false);
    }
  }, []);

  // Fetch immediately on mount & listen to real hardware continuous updates
  useEffect(() => {
    acquireInstantLocation();

    let watchId: number | null = null;
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setAccuracy(Math.round(pos.coords.accuracy || 8));
          setIsRealGPS(true);
        },
        (err) => {
          console.warn("Watch position notice:", err.message);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId !== null && typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [acquireInstantLocation]);

  // Compute nearby guards dynamically around the resident's REAL hardware coordinates
  const nearbyGuards = INITIAL_GUARDS.slice(0, 4).map((g, idx) => {
    const latOffset = (idx === 0 ? 0.0018 : idx === 1 ? -0.0022 : idx === 2 ? 0.0012 : -0.0016);
    const lngOffset = (idx === 0 ? 0.0024 : idx === 1 ? 0.0016 : idx === 2 ? -0.0028 : -0.0019);
    const lat = userLocation[0] + latOffset;
    const lng = userLocation[1] + lngOffset;
    const distanceMeters = Math.round(Math.sqrt(latOffset * latOffset + lngOffset * lngOffset) * 111000);
    return {
      ...g,
      lat,
      lng,
      distanceMeters,
      etaMins: Math.max(1, Math.round(distanceMeters / 75)),
    };
  });

  const handleRequestEscort = (guard: any) => {
    setEscortStatus(`Dispatching ${guard.name}...`);
    setTimeout(() => {
      setEscortStatus(`En Route! Guard ${guard.name} is heading to your real GPS coordinates (ETA ~${guard.etaMins} mins).`);
      setRadioLogs((prev) => [
        ...prev,
        {
          sender: guard.name,
          text: `Roger that. I have locked your real coordinates (${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}) and am moving to your location now.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  const handleSendRadio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!radioMsg.trim()) return;
    const userText = radioMsg;
    setRadioMsg("");
    setRadioLogs((prev) => [
      ...prev,
      {
        sender: "You",
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setTimeout(() => {
      setRadioLogs((prev) => [
        ...prev,
        {
          sender: "Sector Patrol",
          text: `Copy transmission from coordinates (${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}): "${userText}". Maintaining visual surveillance.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="relative w-full h-[540px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Top HUD Bar with Real GPS status */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/80 shadow-lg text-white pointer-events-auto flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRealGPS ? "bg-emerald-400 animate-ping" : "bg-blue-400"}`}></div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isRealGPS ? "Real GPS Hardware Locked" : "Community Radar"}
              </p>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                ±{accuracy}m
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300">
              {userLocation[0].toFixed(5)}° N, {userLocation[1].toFixed(5)}° E • {nearbyGuards.length} Patrol Units in Range
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {escortStatus && (
            <div className="bg-blue-600/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-white shadow-lg flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-semibold">{escortStatus}</span>
            </div>
          )}

          <button
            onClick={acquireInstantLocation}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGPS ? "animate-spin" : ""}`} />
            <span>Instant GPS Sync</span>
          </button>
        </div>
      </div>

      {/* Main Map */}
      <MapContainer
        center={userLocation}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={userLocation} />

        {/* Resident Location */}
        <Marker position={userLocation} icon={residentIcon}>
          <Popup>
            <div className="p-1">
              <p className="font-bold text-gray-900 flex items-center gap-1 text-sm">
                <Navigation className="w-4 h-4 text-blue-600" /> Your Current Physical Position
              </p>
              <p className="text-xs font-mono text-gray-600 mt-1">
                {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)} (±{accuracy}m)
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                Secure Geofence Protection Active
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Geofence Perimeter Safe Zone around User */}
        <Circle
          center={userLocation}
          radius={500}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#60a5fa",
            fillOpacity: 0.15,
            dashArray: "6, 6",
            weight: 2,
          }}
        />

        {/* Nearby Patrol Guards */}
        {nearbyGuards.map((g) => (
          <Marker key={g.id} position={[g.lat, g.lng]} icon={guardIcon}>
            <Popup>
              <div className="p-2 min-w-[210px] space-y-2">
                <div className="flex items-center justify-between border-b pb-1">
                  <span className="font-bold text-gray-900 text-sm">{g.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    {g.verified ? "VERIFIED" : "PATROL"}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>📍 Real Distance: <strong className="text-gray-900">{g.distanceMeters}m</strong></p>
                  <p>⏱️ Response ETA: <strong className="text-emerald-700">{g.etaMins} mins</strong></p>
                  <p>🛡️ Shift: <span className="font-medium">{g.shift}</span></p>
                </div>
                <button
                  onClick={() => handleRequestEscort(g)}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 shadow transition-all"
                >
                  <Shield className="w-3.5 h-3.5" /> Request Escort to My Location
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Tactical Radio Bar at bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Live Guard Radio Channel</p>
              <p className="text-xs text-emerald-400 font-medium truncate max-w-xs">
                {radioLogs[radioLogs.length - 1]?.sender}: "{radioLogs[radioLogs.length - 1]?.text}"
              </p>
            </div>
          </div>

          <form onSubmit={handleSendRadio} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={radioMsg}
              onChange={(e) => setRadioMsg(e.target.value)}
              placeholder="Transmit radio message to guards..."
              className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full md:w-64"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition-all"
            >
              <Send className="w-3 h-3" /> Transmit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
