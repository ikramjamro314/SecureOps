"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, Clock, MapPin, ChevronRight, CheckCircle2, Navigation } from "lucide-react";
import { getLocalStore, saveLocalStore, MockIncident, INITIAL_INCIDENTS } from "@/utils/mockStore";

const PoliceDashboard = () => {
  const [incidents, setIncidents] = useState<MockIncident[]>(INITIAL_INCIDENTS);
  const [filter, setFilter] = useState<"ALL" | "Active" | "Dispatched" | "Resolved">("ALL");

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

    const handleSync = () => {
      const store = getLocalStore();
      setIncidents(store.incidents);
    };
    window.addEventListener("secureops_store_updated", handleSync);
    return () => window.removeEventListener("secureops_store_updated", handleSync);
  }, []);

  const filtered =
    filter === "ALL" ? incidents : incidents.filter((i) => i.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Police Dispatch Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Police Emergency Incident Dispatch Dashboard
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Real-time incoming SOS reports, resident alert broadcasts, and security guard incident logs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/police/verification"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              🛡️ Guard Clearances ({getLocalStore().guards.filter((g: any) => !g.verified).length} Pending)
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Active Urgent SOS</span>
            <span className="text-xl font-bold text-red-600">
              {incidents.filter((i: MockIncident) => i.status === "Active").length} Incidents
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Units Dispatched</span>
            <span className="text-xl font-bold text-blue-600">
              {incidents.filter((i: MockIncident) => i.status === "Dispatched").length} In Progress
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Resolved Today</span>
            <span className="text-xl font-bold text-emerald-600">
              {incidents.filter((i: MockIncident) => i.status === "Resolved").length} Cases
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["ALL", "Active", "Dispatched", "Resolved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                filter === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab === "ALL" ? `All Incidents (${incidents.length})` : tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3.5 text-left">Incident Ref</th>
                  <th className="px-6 py-3.5 text-left">Reporter</th>
                  <th className="px-6 py-3.5 text-left">Classification & Details</th>
                  <th className="px-6 py-3.5 text-left">Location</th>
                  <th className="px-6 py-3.5 text-left">Status</th>
                  <th className="px-6 py-3.5 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filtered.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-gray-800">
                      <Link
                        href={`/police/dashboard/incident?id=${incident.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {incident.incidentID}
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      <span className="font-semibold text-gray-800 block truncate max-w-xs">
                        {incident.from}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {incident.received} • {incident.time}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-700 max-w-xs">
                      <span className="font-bold text-gray-900 block">{incident.subject}</span>
                      <p className="text-gray-500 truncate mt-0.5">{incident.message}</p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{incident.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${
                          incident.status === "Active"
                            ? "bg-red-100 text-red-800"
                            : incident.status === "Dispatched"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <Link
                        href={`/police/dashboard/incident?id=${incident.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition"
                      >
                        <span>Dispatch & Audit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;