"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Shield,
  Sparkles,
  AlertTriangle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { INITIAL_GUARDS, getLocalStore, MockGuard } from "@/utils/mockStore";
import { getHotspotAnalysis } from "@/utils/aiEngine";

const MetricsPage = () => {
  const [guardData, setGuardData] = useState<MockGuard[]>(INITIAL_GUARDS);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const hotspots = getHotspotAnalysis();

  useEffect(() => {
    const fetchGuardData = async () => {
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
          setGuardData(guards);
        }
      } catch {
        const { guards } = getLocalStore();
        setGuardData(guards);
      }
    };
    fetchGuardData();
  }, []);

  const generateSuggestion = async (guard: MockGuard) => {
    const gId = String(guard.id);

    if (suggestions[gId]) {
      setExpandedCard(expandedCard === gId ? null : gId);
      return;
    }

    setLoading((prev) => ({ ...prev, [gId]: true }));

    try {
      const response = await fetch("/api/agency/suggestions", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ guardId: guard.id }),
      });

      const resData = await response.json();
      setSuggestions((prev) => ({ ...prev, [gId]: resData }));
      setExpandedCard(gId);
    } catch (err) {
      console.error("AI fetch error:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [gId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header HUD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Security Intelligence & Predictive Deployment
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Heuristic incident deterrence modeling, fatigue risk assessment, and optimal shift allocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" /> AI Engine Active (v2.4)
            </span>
          </div>
        </div>

        {/* Hotspots Radar Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Incident Risk Forecast & Hotspot Radar
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Predictive incident probability based on 90-day historical telemetry and patrol records
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotspots.map((hs, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-100 bg-slate-50/80 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-900">{hs.zone}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      hs.riskLevel === "CRITICAL"
                        ? "bg-rose-100 text-rose-800"
                        : hs.riskLevel === "MODERATE"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {hs.riskLevel} RISK
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{hs.incidentForecast}</p>
                <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500 pt-2 border-t border-gray-200">
                  <span>Guards Deployed: {hs.activeGuards}</span>
                  <span className="text-blue-600">AI Target: {hs.recommendedGuards}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guards AI Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardData.map((guard) => {
            const gId = String(guard.id);
            const isExpanded = expandedCard === gId;
            const suggestion = suggestions[gId];
            const isLoading = loading[gId];

            return (
              <div
                key={guard.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 transition hover:shadow-md flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Guard Header */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-lg shadow-inner">
                      {guard.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{guard.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-gray-400">
                          {String(guard.id).slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                          {guard.shift || "Night"} Shift
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Specs */}
                  <div className="space-y-2 mb-4 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{guard.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{guard.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{guard.address}</span>
                    </div>
                  </div>

                  {/* AI Suggestion Box */}
                  <div className="mt-4">
                    <button
                      onClick={() => generateSuggestion(guard)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-900 rounded-xl font-bold text-xs flex items-center justify-between border border-indigo-200/80 transition"
                    >
                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        )}
                        <span>AI Deployment & Risk Intelligence</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                      )}
                    </button>

                    {isExpanded && suggestion && (
                      <div className="mt-3 p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3 animate-fadeIn text-xs">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <span className="text-gray-600 font-medium">Reliability Index</span>
                          <span className="font-bold text-indigo-800">
                            {suggestion.reliabilityIndex || 92}% Score
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <span className="text-gray-600 font-medium">Fatigue Level</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              suggestion.fatigueRisk === "ELEVATED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {suggestion.fatigueRisk || "LOW"}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-500 text-[11px] block">
                            Recommended Deployment Zone:
                          </span>
                          <p className="font-bold text-gray-900 mt-0.5">
                            {suggestion.recommendation || suggestion.predicted_bestSuitedFor || "Sector 4 Main Access Gate"}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-indigo-100">
                          <p className="text-indigo-950 text-[11px] leading-relaxed">
                            {suggestion.aiSummary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href={`/agency/guards/info/${guard.id}`}
                    className="w-full text-center py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition"
                  >
                    View Dossier
                  </Link>
                  <Link
                    href={`/agency/guards/attendance/${guard.id}`}
                    className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-sm"
                  >
                    Attendance
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;
