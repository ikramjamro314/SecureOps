"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Bell,
  Building2,
  ArrowRight,
  Shield,
  Activity,
  Radio,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users
} from "lucide-react";
import { INITIAL_INCIDENTS, INITIAL_GUARDS, getLocalStore, MockIncident } from "@/utils/mockStore";

// Dynamic import of Leaflet radar map to guarantee zero SSR issues
const UserRadarMap = dynamic(() => import("@/components/UserRadarMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[540px] w-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-700 animate-pulse">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Initializing Tactical Neighborhood Radar...</p>
    </div>
  ),
});

export default function UserDashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const res = await fetch("/api/user/alert");
        if (res.ok) {
          const serverIncidents = await res.json();
          if (Array.isArray(serverIncidents) && serverIncidents.length > 0) {
            setIncidents(serverIncidents);
            return;
          }
        }
      } catch {
        // Fallback
      }
      const store = getLocalStore();
      setIncidents(store.incidents);
    };

    loadIncidents();
    const handleUpdate = () => {
      const store = getLocalStore();
      setIncidents(store.incidents);
    };
    window.addEventListener("secureops_store_updated", handleUpdate);
    return () => window.removeEventListener("secureops_store_updated", handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Perimeter Geofence Active
              </span>
              <span className="text-xs text-slate-400">Sector 4 Community Grid</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Resident Safety Terminal
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1 max-w-xl">
              Monitor active security patrols in your neighborhood, request immediate guard escort, and report incidents with one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/user/alert"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Bell className="w-5 h-5 animate-pulse" />
              <span>SOS Emergency Alert</span>
            </Link>
          </div>
        </div>

        {/* Tactical Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Guards on Patrol</p>
              <p className="text-2xl font-bold text-white">{INITIAL_GUARDS.length} Units</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Response ETA</p>
              <p className="text-2xl font-bold text-white">~2.4 mins</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Safety Index</p>
              <p className="text-2xl font-bold text-emerald-400">98.4%</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Verified Agencies</p>
              <p className="text-2xl font-bold text-white">3 Verified</p>
            </div>
          </div>
        </div>

        {/* Bento Box Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Alert Bento Box */}
          <Link
            href="/user/alert"
            className="group relative bg-gradient-to-br from-slate-900 to-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl transition-all duration-300 hover:border-red-500/40 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500">
                <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Dispatch Emergency Incident
            </h2>
            <p className="text-slate-400 text-sm">
              Instantly broadcast theft, fire, medical distress, or suspicious activity to active sector guards & police.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-400">
              <span>Trigger Alert</span>
              <span className="w-1 h-1 rounded-full bg-red-400"></span>
              <span className="text-slate-500">Instant Police & Guard Sync</span>
            </div>
          </Link>

          {/* Agencies Bento Box */}
          <Link
            href="/user/agency"
            className="group relative bg-gradient-to-br from-slate-900 to-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400">
                <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Security Agencies & Guards
            </h2>
            <p className="text-slate-400 text-sm">
              Browse government-vetted security agencies, inspect deployed personnel credentials, and submit reviews.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <span>View Security Fleet</span>
              <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
              <span className="text-slate-500">Government Vetted</span>
            </div>
          </Link>
        </div>

        {/* Live Interactive Neighborhood Radar Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                🛡️ Live Patrol Radar & Guards Nearby
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              GEOFENCE: 500m ZONE
            </span>
          </div>

          <UserRadarMap />
        </div>

        {/* Recent Community Incident Feeds */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-lg">Community Incident Ledger</h3>
            </div>
            <span className="text-xs text-slate-400">Synchronized across Police & Guard Dispatch</span>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id || inc.incidentID}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    inc.severity === "CRITICAL" || inc.priority === "CRITICAL"
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{inc.subject || inc.name || inc.type}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {inc.incidentID || inc.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md">{inc.message || inc.description || inc.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    inc.status === "RESOLVED" || inc.status === "Resolved"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}>
                    {inc.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    {inc.time || (inc.createdAt ? new Date(inc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
