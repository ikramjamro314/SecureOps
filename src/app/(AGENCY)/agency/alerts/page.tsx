"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ShieldAlert, AlertTriangle, Radio, Navigation, CheckCircle } from "lucide-react";
import { getLocalStore, INITIAL_GUARDS, MockIncident } from "@/utils/mockStore";

// Lazy load Leaflet to prevent SSR issues
const Map = dynamic(() => import("../../../../components/MapModel"), { ssr: false });

type OutOfZoneGuard = {
  id: string;
  name: string;
  actualLat: number;
  actualLng: number;
  lat: number;
  lng: number;
  reason: string;
};

const DEFAULT_OUT_OF_ZONE: OutOfZoneGuard[] = [
  {
    id: "65b1234567890abcde100103",
    name: "Zubair Ali Shah (Guard ID: GRD-103)",
    actualLat: 22.7757952,
    actualLng: 86.1468294,
    lat: 22.7600000,
    lng: 86.1400000,
    reason: "Geofence Exit: Outer Perimeter Depot (1.8 km variance)",
  },
  {
    id: "g-99",
    name: "Patrol Scout Unit 4",
    actualLat: 22.7765,
    actualLng: 86.1475,
    lat: 22.7820,
    lng: 86.1550,
    reason: "Trailing unknown freight vehicle outside boundary",
  },
];

export default function RadarScanner() {
  const [outOfZoneUsers, setOutOfZoneUsers] = useState<OutOfZoneGuard[]>(DEFAULT_OUT_OF_ZONE);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState<MockIncident[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await fetch("/api/user/alert");
        if (res.ok) {
          const serverIncidents: MockIncident[] = await res.json();
          if (Array.isArray(serverIncidents) && serverIncidents.length > 0) {
            setEmergencyAlerts(serverIncidents.filter((i) => i.status === "Active"));
            return;
          }
        }
      } catch {
        // Fallback
      }
      const store = getLocalStore();
      setEmergencyAlerts(store.incidents.filter((i: MockIncident) => i.status === "Active"));
    };

    loadAlerts();

    const handleUpdate = () => {
      const updatedStore = getLocalStore();
      setEmergencyAlerts(updatedStore.incidents.filter((i: MockIncident) => i.status === "Active"));
    };

    window.addEventListener("secureops_store_updated", handleUpdate);
    return () => window.removeEventListener("secureops_store_updated", handleUpdate);
  }, []);

  return (
    <div className="flex flex-col items-center pt-8 pb-16 min-h-screen bg-slate-950 text-white px-4 md:px-8">
      <div className="max-w-4xl w-full text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Radio className="w-3.5 h-3.5 animate-spin" /> Continuous 360° Radar Surveillance Active
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Geofence Radar & Perimeter Security Log</h1>
        <p className="text-sm text-slate-400 mt-1">
          Automated acoustic & GPS boundary surveillance tracking unauthorized guard perimeter exits
        </p>
      </div>

      <RadarUI />

      {/* Emergency Incidents Banner if any */}
      {emergencyAlerts.length > 0 && (
        <div className="w-full max-w-2xl mt-8 p-4 bg-red-950/80 border border-red-500/60 rounded-2xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Active Emergency Resident Dispatches ({emergencyAlerts.length})</span>
          </div>
          <div className="space-y-2">
            {emergencyAlerts.map((em) => (
              <div key={em.id} className="p-3 bg-red-900/30 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-red-200">{em.subject}</p>
                  <p className="text-red-300/80">{em.location} • {em.time}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
                  {em.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Radar Security Log */}
      <SecurityLog outOfZoneUsers={outOfZoneUsers} onUserSelect={setSelectedUser} />

      {/* Inspect Map Modal */}
      {selectedUser && <Map user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}

// Radar UI Component with Modern Animation
const RadarUI = () => (
  <div className="relative w-72 h-72 flex items-center justify-center my-4">
    <div className="absolute w-64 h-64 border border-emerald-500/20 rounded-full"></div>
    <div className="absolute w-48 h-48 border border-emerald-500/30 rounded-full"></div>
    <div className="absolute w-32 h-32 border border-emerald-500/40 rounded-full"></div>
    <div className="absolute w-64 h-[1px] bg-emerald-500/30"></div>
    <div className="absolute h-64 w-[1px] bg-emerald-500/30"></div>

    {/* Radar Sweep Line */}
    <div className="absolute w-32 h-32 origin-bottom-right top-4 left-4 bg-gradient-to-br from-emerald-500/40 to-transparent rounded-tl-full animate-radarSweep"></div>

    {/* Pulsing Dots */}
    <div className="absolute top-16 right-20 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
    <div className="absolute top-16 right-20 w-3 h-3 bg-red-500 rounded-full"></div>
    <div className="absolute bottom-20 left-24 w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>

    <style>{`
      @keyframes radarSweep {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .animate-radarSweep {
        animation: radarSweep 4s linear infinite;
        transform-origin: 100% 100%;
      }
    `}</style>
  </div>
);

// Security Log Component
const SecurityLog = ({
  outOfZoneUsers,
  onUserSelect,
}: {
  outOfZoneUsers: OutOfZoneGuard[];
  onUserSelect: (user: any) => void;
}) => (
  <div className="mt-6 w-full max-w-2xl bg-slate-900 p-5 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-xs shadow-2xl">
    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
      <h2 className="text-sm font-bold text-white flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400" />
        Geofence Perimeter Discrepancy Log
      </h2>
      <span className="text-[11px] text-slate-400">Click entry to inspect GPS coordinates</span>
    </div>

    <ul className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
      {outOfZoneUsers.map((user) => (
        <li
          key={user.id}
          className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer border border-slate-700/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          onClick={() => onUserSelect(user)}
        >
          <div>
            <span className="text-red-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              ALERT: {user.name} OUT OF BOUNDS
            </span>
            <p className="text-slate-400 text-[11px] mt-0.5">{user.reason}</p>
          </div>
          <span className="px-2.5 py-1 bg-red-500/10 text-red-300 font-semibold rounded-lg border border-red-500/20 text-[11px] shrink-0 self-start sm:self-auto">
            Inspect Coordinates &rarr;
          </span>
        </li>
      ))}
    </ul>
  </div>
);
