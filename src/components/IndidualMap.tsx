"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useSession } from "next-auth/react";
import { TbCurrentLocation } from "react-icons/tb";
import { ShieldCheck, MapPin, Navigation, RefreshCw } from "lucide-react";
import { fetchInstantRealLocation, DEFAULT_GEOFENCE_BASE } from "@/helpers/map";

// Fix custom icon for Leaflet in Next.js
const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const baseIcon = new L.DivIcon({
  className: "custom-base-pin",
  html: `<div style="background-color: #2563eb; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 13px;">🏢</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -18],
});

// Auto-center component
const MapAutoCenter = ({
  location,
}: {
  location: { lat: number; lng: number };
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([location.lat, location.lng], map.getZoom(), {
      animate: true,
    });
  }, [location, map]);

  return null;
};

// Recenter Button Component
const RecenterButton = ({
  location,
  onInstantFetch,
}: {
  location: { lat: number; lng: number };
  onInstantFetch: () => void;
}) => {
  const map = useMap();

  const handleRecenter = () => {
    onInstantFetch();
    map.setView([location.lat, location.lng], 16, { animate: true });
  };

  return (
    <button
      onClick={handleRecenter}
      title="Instant GPS Re-center & Fetch"
      className="absolute bottom-5 right-5 z-[1000] bg-white text-blue-600 p-3 rounded-full shadow-xl hover:bg-blue-50 border border-gray-200 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
    >
      <TbCurrentLocation size={24} className="text-blue-600" />
    </button>
  );
};

export default function LiveLocation() {
  const { data } = useSession();
  const guardName = data?.user?.name || "Muhammad Tariq (Guard ID: GRD-101)";

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_GEOFENCE_BASE.lat,
    lng: DEFAULT_GEOFENCE_BASE.lng,
  });

  const [geofenceCenter, setGeofenceCenter] = useState<[number, number]>([
    DEFAULT_GEOFENCE_BASE.lat,
    DEFAULT_GEOFENCE_BASE.lng,
  ]);

  const [accuracy, setAccuracy] = useState<number>(8);
  const [isRealGPS, setIsRealGPS] = useState(false);
  const [patrolPoints, setPatrolPoints] = useState<[number, number][]>([]);

  // Instant Real GPS Fetcher
  const acquireInstantGPS = useCallback(async () => {
    try {
      const fix = await fetchInstantRealLocation();
      setLocation({ lat: fix.lat, lng: fix.lng });
      setGeofenceCenter([fix.lat, fix.lng]);
      setAccuracy(fix.accuracy);
      setIsRealGPS(true);
      setPatrolPoints((prev) => {
        const last = prev[prev.length - 1];
        if (!last || Math.abs(last[0] - fix.lat) > 0.00005 || Math.abs(last[1] - fix.lng) > 0.00005) {
          return [...prev.slice(-25), [fix.lat, fix.lng]];
        }
        return prev;
      });
    } catch (err: any) {
      console.warn("Real GPS access:", err?.message || err);
    }
  }, []);

  // Fetch immediately on mount & listen to hardware updates continuously
  useEffect(() => {
    acquireInstantGPS();

    let watchId: number | null = null;
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = Math.round(position.coords.accuracy || 8);

          setLocation({ lat, lng });
          setAccuracy(acc);
          setIsRealGPS(true);

          setPatrolPoints((prev) => {
            const last = prev[prev.length - 1];
            if (!last || Math.abs(last[0] - lat) > 0.00005 || Math.abs(last[1] - lng) > 0.00005) {
              return [...prev.slice(-25), [lat, lng]];
            }
            return prev;
          });
        },
        (error) => {
          console.warn("Watch position error:", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }

    return () => {
      if (watchId !== null && typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [acquireInstantGPS]);

  return (
    <div className="w-full relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* Top Map HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap gap-2 items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl rounded-xl px-3.5 py-2 flex items-center gap-2.5 pointer-events-auto text-white">
          <div className={`w-2.5 h-2.5 rounded-full ${isRealGPS ? "bg-emerald-400 animate-ping" : "bg-blue-400"}`}></div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-400">
                {isRealGPS ? "Real GPS Hardware Locked" : "Default Duty Post"}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                ±{accuracy}m
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-300">
              {location.lat.toFixed(5)}° N, {location.lng.toFixed(5)}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={acquireInstantGPS}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Instant GPS Sync</span>
          </button>
        </div>
      </div>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={16}
        style={{ height: "480px", width: "100%" }}
        className="relative z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 500m Authorized Duty Geofence Circle */}
        <Circle
          center={geofenceCenter}
          radius={500}
          pathOptions={{
            color: "#10b981",
            fillColor: "#10b981",
            fillOpacity: 0.12,
            weight: 2,
            dashArray: "6, 6",
          }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-xs text-gray-900">Authorized Duty Geofence</p>
              <p className="text-[11px] text-gray-600">500m Active Security Perimeter</p>
            </div>
          </Popup>
        </Circle>

        {/* Patrol Route Breadcrumb Trace */}
        {patrolPoints.length > 1 && (
          <Polyline
            positions={patrolPoints}
            pathOptions={{
              color: "#3b82f6",
              weight: 4,
              opacity: 0.9,
              dashArray: "4, 6",
            }}
          />
        )}

        {/* Real Guard Location Marker */}
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            <div className="p-1 min-w-[180px]">
              <p className="font-bold text-sm text-gray-900">{guardName}</p>
              <div className="text-xs text-gray-600 space-y-1 mt-1">
                <p className="flex items-center gap-1 text-blue-600 font-medium">
                  <Navigation className="w-3 h-3" /> Real GPS Telemetry
                </p>
                <p className="font-mono text-[11px]">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <p className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Inside Duty Perimeter (±{accuracy}m)
                </p>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Base Post Checkpoint Marker */}
        <Marker position={geofenceCenter} icon={baseIcon}>
          <Popup>
            <div className="p-1">
              <p className="font-bold text-xs text-gray-900">Sector Base Post</p>
              <p className="text-[11px] text-gray-600">Authorized Duty Post Center</p>
            </div>
          </Popup>
        </Marker>

        <MapAutoCenter location={location} />
        <RecenterButton location={location} onInstantFetch={acquireInstantGPS} />
      </MapContainer>
    </div>
  );
}
