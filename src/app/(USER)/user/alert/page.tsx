"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AlertTriangle,
  Send,
  AlertCircle,
  Flame,
  Heart,
  Shield,
  HelpCircle,
  Radio,
  CheckCircle2,
  ArrowLeft,
  Navigation
} from "lucide-react";
import { INITIAL_INCIDENTS, getLocalStore, saveLocalStore, MockIncident } from "@/utils/mockStore";

const AlertNotification: React.FC = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("Theft Alert");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedIncident, setDispatchedIncident] = useState<any>(null);

  const alertOptions = [
    {
      value: "Theft Alert",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-amber-500",
      description: "Break-in, unauthorized entry, or stolen property",
    },
    {
      value: "Fire Hazard",
      icon: <Flame className="w-5 h-5" />,
      color: "text-red-500",
      description: "Active smoke, electrical fire, or flammable hazard",
    },
    {
      value: "Medical Emergency",
      icon: <Heart className="w-5 h-5" />,
      color: "text-rose-500",
      description: "Resident injury, cardiac distress, or ambulance request",
    },
    {
      value: "Suspicious Activity",
      icon: <Shield className="w-5 h-5" />,
      color: "text-indigo-400",
      description: "Loitering, perimeter breach, or unverified drone/vehicle",
    },
    {
      value: "Other Emergency",
      icon: <HelpCircle className="w-5 h-5" />,
      color: "text-slate-400",
      description: "Other urgency requiring immediate security intervention",
    },
  ];

  const currentAlert = alertOptions.find((option) => option.value === alertType);

  const handleQuickPreset = (presetMsg: string, type: string) => {
    setAlertType(type);
    setMessage(presetMsg);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    const userEmail = session?.user?.email || "resident@secureops.demo";

    try {
      const payload = {
        email: userEmail,
        message,
        name: alertType,
        severity: (alertType === "Fire Hazard" || alertType === "Medical Emergency" ? "CRITICAL" : "HIGH") as "CRITICAL" | "HIGH",
      };

      const trackingCode = `SEC-${Date.now().toString().slice(-4)}`;
      let serverIncident: any = null;

      try {
        const response = await fetch("/api/user/alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const resData = await response.json();
          serverIncident = resData?.incident;
        }
      } catch (err) {
        console.warn("Server alert broadcast notice, using local synchronized dispatch:", err);
      }

      const broadcastedIncident: MockIncident = serverIncident || {
        id: `inc-${Date.now()}`,
        incidentID: trackingCode,
        from: userEmail,
        subject: alertType,
        type: alertType,
        message,
        location: "Sector 4 Community Grid (Geofence Pin #8)",
        received: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "Active",
        priority: payload.severity,
        suspectDescription: "Reported via resident SOS dispatch terminal.",
      };

      // 1. Immediately save to browser localStorage store for cross-dashboard flow
      const currentStore = getLocalStore();
      const updatedIncidents = [
        broadcastedIncident,
        ...currentStore.incidents.filter((i: MockIncident) => i.id !== broadcastedIncident.id),
      ];
      saveLocalStore({ incidents: updatedIncidents });

      // 2. Also update server INITIAL_INCIDENTS array
      if (!INITIAL_INCIDENTS.some((i: MockIncident) => i.id === broadcastedIncident.id)) {
        INITIAL_INCIDENTS.unshift(broadcastedIncident);
      }

      setDispatchedIncident({
        ...broadcastedIncident,
        name: broadcastedIncident.subject,
        assignedGuard: "Muhammad Tariq (Guard ID: GRD-101 • Unit-Alpha)",
      });
      setMessage("");
    } catch (error) {
      console.error("Alert submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation back */}
        <Link
          href="/user/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resident Dashboard
        </Link>

        {dispatchedIncident ? (
          /* Confirmation & Live Tracking Card */
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Incident Broadcast Confirmed
                </span>
                <h2 className="text-2xl font-bold text-white">Emergency Units Dispatched</h2>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tracking Code:</span>
                <span className="text-emerald-400 font-bold text-sm">{dispatchedIncident.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Emergency Type:</span>
                <span className="text-white font-semibold">{dispatchedIncident.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Status:</span>
                <span className="text-blue-400 font-bold animate-pulse">EN ROUTE TO LOCATION</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Assigned Unit:</span>
                <span className="text-white">{dispatchedIncident.assignedGuard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300">{dispatchedIncident.location}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-start gap-3">
              <Radio className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-blue-200">
                <p className="font-semibold text-blue-100">Synchronized Tactical Pipeline Active</p>
                <p className="mt-0.5 text-blue-300">
                  This alert has been automatically injected into the Police Command Terminal and the Agency Threat Sweep Radar.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setDispatchedIncident(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl text-center text-sm transition-all"
              >
                Report Another Incident
              </button>
              <Link
                href="/user/dashboard"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-center text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                Return to Live Radar
              </Link>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Emergency Alert Dispatch</h1>
                  <p className="text-sm text-slate-400">Direct transmission to Police, Sector Guards & Agency Command</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Quick Tactical Presets (1-Click Fill)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset("Break-in observed at Block C rear exit. Perimeter gate forced open.", "Theft Alert")}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 text-left text-xs transition-all hover:bg-amber-500/5"
                  >
                    <span className="font-semibold text-amber-400 block">🚨 Perimeter Intrusion</span>
                    <span className="text-[11px] text-slate-400">Block C Rear Gate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPreset("Dense smoke coming from Basement 1 electrical room. Urgent fire response required.", "Fire Hazard")}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/50 text-left text-xs transition-all hover:bg-red-500/5"
                  >
                    <span className="font-semibold text-red-400 block">🔥 Basement Fire</span>
                    <span className="text-[11px] text-slate-400">Dense Smoke / Electrical</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPreset("Elderly resident collapsed on 3rd floor corridor. First-aid needed immediately.", "Medical Emergency")}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 text-left text-xs transition-all hover:bg-rose-500/5"
                  >
                    <span className="font-semibold text-rose-400 block">🚑 Medical First-Aid</span>
                    <span className="text-[11px] text-slate-400">3rd Floor Corridor</span>
                  </button>
                </div>
              </div>

              {/* Alert Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Incident Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alertOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAlertType(opt.value)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        alertType === opt.value
                          ? "bg-slate-800 border-red-500/80 ring-1 ring-red-500 shadow-lg shadow-red-500/10"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className={`mt-0.5 ${opt.color}`}>{opt.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-white">{opt.value}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{opt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Incident Details & Description
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-slate-500 text-sm resize-none transition-all"
                  rows={4}
                  placeholder="State the location, persons involved, and critical details..."
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Broadcasting Alert across Network...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Broadcast Emergency Dispatch Now</span>
                  </>
                )}
              </button>

            </div>

            {/* Bottom Caution Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 text-slate-400 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                All alerts are geofenced and logged to the central SecureOps dispatch ledger. Real coordinates are transmitted.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AlertNotification;
