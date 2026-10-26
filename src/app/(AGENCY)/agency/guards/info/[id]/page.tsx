"use client";

import React, { useEffect, useState } from "react";
import { Star, MapPin, Clock, Calendar, Shield, Award, CheckCircle, ArrowLeft } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { INITIAL_GUARDS, getLocalStore } from "@/utils/mockStore";

const Maps = dynamic(() => import("@/components/IndidualMap"), {
  ssr: false,
  loading: () => <p className="p-8 text-gray-500 text-center">Loading tactical map...</p>,
});

export default function GuardInfoPage() {
  const [guard, setGuard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchGuardData = async () => {
      try {
        const response = await fetch("/api/agency/guard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();

        if (data && data.name) {
          setGuard(data);
        } else {
          const { guards } = getLocalStore();
          const matched =
            guards.find((g: any) => g.id === id || String(g.id) === id) || INITIAL_GUARDS[0];
          setGuard(matched);
        }
      } catch {
        const { guards } = getLocalStore();
        const matched =
          guards.find((g: any) => g.id === id || String(g.id) === id) || INITIAL_GUARDS[0];
        setGuard(matched);
      } finally {
        setLoading(false);
      }
    };

    fetchGuardData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const activeGuard = guard || INITIAL_GUARDS[0];
  const reviews = Array.isArray(activeGuard.ratingsReceived) ? activeGuard.ratingsReceived : [];
  const experiences = Array.isArray(activeGuard.prevExperience) ? activeGuard.prevExperience : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/agency/guards"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guards Fleet
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative h-44 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900">
            <div className="absolute -bottom-14 left-8">
              <div className="relative">
                <img
                  src={activeGuard.image || "/assets/logo.png"}
                  alt={activeGuard.name}
                  className="w-32 h-32 rounded-2xl border-4 border-white object-cover shadow-md bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/logo.png";
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow"></div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{activeGuard.name}</h1>
                {activeGuard.verified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Pending Clearance
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {activeGuard.address} • {activeGuard.phone} • {activeGuard.email}
              </p>

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{activeGuard.role}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{activeGuard.shift || "Night"} Shift</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg font-bold">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Guard ID: {activeGuard.badgeId || "GRD-101"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <StarRating rating={activeGuard.rating || 4.8} className="mb-1" />
              <span className="text-xs text-gray-500">
                {reviews.length > 0 ? `${reviews.length} Verified Reviews` : "4.8 Rating (Verified Fleet)"}
              </span>
              <Link
                href={`/agency/guards/attendance/${activeGuard.id}`}
                className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl transition"
              >
                Inspect Attendance History &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Deployment & Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Last Telemetry Ping</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {activeGuard.location?.lastPing || "Just now (Active)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Authorized Post</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {activeGuard.location?.name || "Sector 4 Main Gate Checkpoint"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience & Vetting */}
            {experiences.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Past Experience & Security Vetting</h2>
                <div className="space-y-3">
                  {experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-800">{exp.workPlace}</p>
                        <p className="text-gray-500">Joined: {exp.joiningData}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg">
                        {exp.experinceYears} Years Service
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resident & Client Reviews</h2>
              <div className="space-y-3">
                {reviews.map((review: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-gray-800">{review.author} • {review.location}</span>
                      <StarRating rating={review.rating || 5} size={14} />
                    </div>
                    <p className="text-gray-600 italic">"{review.comment}"</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">{review.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Location Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sticky top-8">
              <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Live Post Coordinates
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Active geofence verification for {activeGuard.name}
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <Maps />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
