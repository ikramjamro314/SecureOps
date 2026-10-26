"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  MapPin,
  Clock,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  PhoneCall,
  Radio,
  AlertCircle,
} from "lucide-react";
import { getLocalStore, saveLocalStore, MockIncident, INITIAL_INCIDENTS } from "@/utils/mockStore";

function IncidentDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [incident, setIncident] = useState<MockIncident>(INITIAL_INCIDENTS[0]);
  const [actionNotice, setActionNotice] = useState("");

  useEffect(() => {
    const { incidents } = getLocalStore();
    const matched = incidents.find((i: MockIncident) => i.id === id || i.incidentID === id) || incidents[0];
    if (matched) {
      setIncident(matched);
    }
  }, [id]);

  const handleUpdateStatus = (newStatus: "Active" | "Dispatched" | "Resolved") => {
    const { incidents } = getLocalStore();
    const updated = incidents.map((inc: MockIncident) =>
      inc.id === incident.id ? { ...inc, status: newStatus } : inc
    );

    saveLocalStore({ incidents: updated });
    setIncident({ ...incident, status: newStatus });
    setActionNotice(`Dispatch updated: Status set to ${newStatus}`);
    setTimeout(() => setActionNotice(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white p-6 md:p-8">
          <Link
            href="/police/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-100 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dispatch Feed
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl">
                <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-red-200 font-bold">
                  Official Police Alert
                </span>
                <h1 className="text-2xl font-bold">{incident.subject}</h1>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
              {incident.incidentID}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {actionNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionNotice}</span>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-sm">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Reporting Party:</span>
              <span className="font-bold text-gray-800">{incident.from}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> Incident Location:
              </span>
              <span className="font-bold text-gray-800">{incident.location}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Time of Call:
              </span>
              <span className="font-semibold text-gray-800">
                {incident.received} • {incident.time}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Current Dispatch Status:</span>
              <span
                className={`px-3 py-1 rounded-full font-bold text-xs ${
                  incident.status === "Active"
                    ? "bg-red-100 text-red-800"
                    : incident.status === "Dispatched"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {incident.status}
              </span>
            </div>
          </div>

          {/* Details Narrative */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Emergency Message Log:
            </h3>
            <p className="p-4 bg-amber-50/80 rounded-2xl text-sm text-gray-800 border border-amber-200/60 leading-relaxed">
              "{incident.message}"
            </p>
          </div>

          {incident.suspectDescription && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Investigative Notes / Suspect Details:
              </h3>
              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                {incident.suspectDescription}
              </p>
            </div>
          )}

          {/* Action Button Controls */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {incident.status !== "Dispatched" && (
              <button
                onClick={() => handleUpdateStatus("Dispatched")}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Navigation className="w-4 h-4" /> Dispatch Patrol Unit
              </button>
            )}

            {incident.status !== "Resolved" && (
              <button
                onClick={() => handleUpdateStatus("Resolved")}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Case Resolved
              </button>
            )}

            <button
              onClick={() =>
                alert("Radio Alert broadcasted to all security guards in Sector 4 geofence.")
              }
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition flex items-center justify-center gap-1.5 sm:col-span-2"
            >
              <Radio className="w-4 h-4 text-red-600" /> Broadcast Perimeter Lock to Sector Guards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IncidentDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white">Loading Incident Details...</div>}>
      <IncidentDetailContent />
    </Suspense>
  );
}
