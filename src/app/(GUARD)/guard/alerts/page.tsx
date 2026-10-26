"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Flame,
  Heart,
  ShieldAlert,
  MapPin,
  Clock,
  Radio,
  CheckCircle,
  PhoneCall,
  Navigation,
} from "lucide-react";
import { getLocalStore, saveLocalStore, MockIncident } from "@/utils/mockStore";

export default function GuardAlertsPage() {
  const [incidents, setIncidents] = useState<MockIncident[]>([]);
  const [filter, setFilter] = useState<"ALL" | "Active" | "Dispatched" | "Resolved">("ALL");
  const [activeMessage, setActiveMessage] = useState("");

  const loadIncidents = async () => {
    try {
      const res = await fetch("/api/user/alert");
      if (res.ok) {
        const serverIncidents: MockIncident[] = await res.json();
        if (Array.isArray(serverIncidents) && serverIncidents.length > 0) {
          const store = getLocalStore();
          const merged = [...store.incidents];
          serverIncidents.forEach((si) => {
            if (!merged.some((m) => m.id === si.id || m.incidentID === si.incidentID)) {
              merged.unshift(si);
            }
          });
          setIncidents(merged);
          saveLocalStore({ incidents: merged });
          return;
        }
      }
    } catch {
      // Fallback to local store
    }

    const store = getLocalStore();
    setIncidents(store.incidents);
  };

  useEffect(() => {
    loadIncidents();

    const handleUpdate = () => {
      const store = getLocalStore();
      setIncidents(store.incidents);
    };
    window.addEventListener("secureops_store_updated", handleUpdate);
    return () => window.removeEventListener("secureops_store_updated", handleUpdate);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: "Active" | "Dispatched" | "Resolved") => {
    const updated = incidents.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc));
    setIncidents(updated);
    saveLocalStore({ incidents: updated });
    setActiveMessage(`Incident updated: Marked as ${newStatus}`);
    setTimeout(() => setActiveMessage(""), 4000);
  };

  const filteredIncidents =
    filter === "ALL" ? incidents : incidents.filter((inc) => inc.status === filter);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "HIGH":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getIncidentIcon = (type: string) => {
    if (type.includes("Fire")) return <Flame className="w-5 h-5 text-red-600" />;
    if (type.includes("Medical")) return <Heart className="w-5 h-5 text-rose-600" />;
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header HUD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-red-600 animate-pulse" />
              <h1 className="text-2xl font-bold text-gray-900">
                Guard Incident Response Terminal
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Live SOS dispatches from residents, geofence perimeter alerts, and police bulletins
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <Radio className="w-3.5 h-3.5 animate-spin" /> Radio Channel 4 Active
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {activeMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between animate-fadeIn">
            <span>{activeMessage}</span>
            <button onClick={() => setActiveMessage("")} className="text-emerald-700 font-bold">
              ×
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(["ALL", "Active", "Dispatched", "Resolved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab === "ALL" ? `All Alerts (${incidents.length})` : tab}
            </button>
          ))}
        </div>

        {/* Incidents Feed */}
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">All Clear in Sector 4</h3>
              <p className="text-sm text-gray-500 mt-1">
                No alerts matching the selected filter. Perimeter is currently stable.
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                        {getIncidentIcon(incident.type)}
                      </span>
                      <span className="font-bold text-lg text-gray-900">{incident.subject}</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPriorityStyle(
                          incident.priority
                        )}`}
                      >
                        {incident.priority}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          incident.status === "Active"
                            ? "bg-red-100 text-red-700"
                            : incident.status === "Dispatched"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        Status: {incident.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">{incident.message}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{incident.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span>
                          {incident.received} • {incident.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-gray-700">
                        <span>ID: {incident.incidentID}</span>
                      </div>
                    </div>

                    {incident.suspectDescription && (
                      <div className="text-xs text-gray-600 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-lg">
                        <strong className="text-amber-900">Report Details: </strong>
                        {incident.suspectDescription}
                      </div>
                    )}
                  </div>

                  {/* Action Controls */}
                  <div className="flex lg:flex-col gap-2 shrink-0 self-end lg:self-center">
                    {incident.status === "Active" && (
                      <button
                        onClick={() => handleUpdateStatus(incident.id, "Dispatched")}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Accept & Dispatch
                      </button>
                    )}

                    {incident.status === "Dispatched" && (
                      <button
                        onClick={() => handleUpdateStatus(incident.id, "Resolved")}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Secured
                      </button>
                    )}

                    <button
                      onClick={() =>
                        alert(`Requesting immediate Police reinforcement for ${incident.incidentID}`)
                      }
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs font-semibold rounded-xl border border-gray-200 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Police Backup
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}