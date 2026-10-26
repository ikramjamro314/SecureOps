"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { ShieldCheck, MapPin, Clock, Calendar, Search, Award } from "lucide-react";
import { INITIAL_GUARDS, getLocalStore, MockGuard } from "@/utils/mockStore";

const Maps = dynamic(() => import("@/components/Maps"), {
  ssr: false,
  loading: () => <p className="p-8 text-gray-500 text-center">Loading security fleet map...</p>,
});

const AgencyGuardsPage = () => {
  const [guardData, setGuardData] = useState<MockGuard[]>(INITIAL_GUARDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchGuards = async () => {
    try {
      const response = await fetch("/api/agency", {
        headers: { "content-type": "application/json" },
        method: "GET",
      });
      const resData = await response.json();

      if (Array.isArray(resData) && resData.length > 0) {
        setGuardData(resData);
      } else {
        const { guards } = getLocalStore();
        setGuardData(guards || INITIAL_GUARDS);
      }
    } catch {
      const { guards } = getLocalStore();
      setGuardData(guards || INITIAL_GUARDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuards();

    const handleSync = () => {
      const { guards } = getLocalStore();
      setGuardData(guards);
    };

    window.addEventListener("secureops_store_updated", handleSync);
    return () => window.removeEventListener("secureops_store_updated", handleSync);
  }, []);

  const filteredGuards = guardData.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.shift?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Deployed Security Personnel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time deployment status, verification tracking, and tactical assignment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/agency/guards/metrics"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            ⚡ AI Deployment Suggestions
          </Link>
          <Link
            href="/agency/alerts"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            📡 Radar Scanner
          </Link>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guard name, sector, or shift..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800"
          />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Active Fleet</span>
          <span className="text-lg font-bold text-gray-900">{guardData.length} Guards</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Police Verified</span>
          <span className="text-lg font-bold text-emerald-600">
            {guardData.filter((g) => g.verified).length} / {guardData.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Guard & ID
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Shift & Post
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Police Clearance
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredGuards.map((guard) => (
                <tr key={guard.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/agency/guards/info/${guard.id}`}
                      className="group flex flex-col"
                    >
                      <span className="font-bold text-gray-900 group-hover:text-blue-600 transition text-sm">
                        {guard.name}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-blue-700 font-bold bg-blue-50 w-fit px-1.5 py-0.5 rounded mt-0.5">
                        Guard ID: {guard.badgeId || String(guard.id).slice(-8).toUpperCase()}
                      </span>
                    </Link>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <p className="font-medium text-gray-900">{guard.phone}</p>
                    <p className="text-gray-400">{guard.email}</p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold mb-1">
                      {guard.shift || "Night"} Shift
                    </span>
                    <p className="text-gray-500 truncate max-w-xs">{guard.address}</p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold ${
                        guard.location?.status === "inside" || !guard.location
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800 animate-pulse"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          guard.location?.status === "inside" || !guard.location
                            ? "bg-emerald-600"
                            : "bg-rose-600"
                        }`}
                      ></span>
                      {guard.location?.status === "inside" || !guard.location
                        ? "Inside Geofence"
                        : "Out of Bounds"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {guard.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Pending Check
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs space-x-2">
                    <Link
                      href={`/agency/guards/attendance/${guard.id}`}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg transition"
                    >
                      Attendance
                    </Link>
                    <Link
                      href={`/agency/guards/info/${guard.id}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-lg transition"
                    >
                      Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Live Tracking Map */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Live Security Fleet Operations Map
            </h2>
            <p className="text-xs text-gray-500">
              Live coordinates and duty perimeter tracking for all active deployed guards
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            ● GPS Telemetry Connected
          </span>
        </div>
        <div className="h-[420px] w-full rounded-xl overflow-hidden border border-gray-200">
          <Maps />
        </div>
      </div>
    </div>
  );
};

export default AgencyGuardsPage;
