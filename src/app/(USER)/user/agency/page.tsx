"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Building2,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  PhoneCall,
  UserCheck,
  Star,
  ArrowLeft,
  X
} from "lucide-react";
import AgencyCard from "@/components/AgencyCard";
import { INITIAL_AGENCIES } from "@/utils/mockStore";

function Page() {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingAgency, setBookingAgency] = useState<any | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState("Residential Patrol Guard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/guardData", {
          headers: { "content-type": "application/json" },
          method: "GET",
        });
        const resData: any[] = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setData(resData);
        } else {
          setData(INITIAL_AGENCIES);
        }
      } catch (err) {
        setData(INITIAL_AGENCIES);
      }
    };

    fetchData();
  }, []);

  const filteredAgencies = data.filter((agency) =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingAgency) return;
    setBookingSuccess(`Deployment request submitted to ${bookingAgency.name}! A supervisor will dispatch the duty roster.`);
    setTimeout(() => {
      setBookingAgency(null);
      setBookingSuccess(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/user/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Resident Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Vetted Security Agencies & Fleets
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Select verified agencies, book perimeter patrols, and submit feedback for active guards.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search agency or service..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Security Vetting Guarantee Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Government PSARA Licensed</p>
              <p className="text-[11px] text-slate-400">100% Police Background Checked</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">24/7 Geofenced Monitoring</p>
              <p className="text-[11px] text-slate-400">Live GPS Patrol Telemetry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PhoneCall className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Rapid Dispatch Guarantee</p>
              <p className="text-[11px] text-slate-400">Under 4 min response time</p>
            </div>
          </div>
        </div>

        {/* Agency List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredAgencies.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
              <Building2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">No security agencies match your criteria</p>
            </div>
          ) : (
            filteredAgencies.map((agency) => (
              <div
                key={agency.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white">{agency.name}</h2>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED FLEET
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">{agency.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingAgency(agency)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Calendar className="w-4 h-4" /> Request Guard Coverage
                  </button>
                </div>

                {/* Associated Guards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Active Deployed Guards ({agency.users?.length || 0})
                    </h3>
                    <span className="text-xs text-slate-500">Live Roster</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {agency.users && agency.users.map((guard: any) => (
                      <div
                        key={guard.id}
                        className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold">
                            {guard.name ? guard.name[0] : "G"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{guard.name}</p>
                            <p className="text-xs text-slate-400">{guard.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                              {guard.role}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                            <UserCheck className="w-3.5 h-3.5" /> Active Patrol
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Booking Coverage */}
        {bookingAgency && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setBookingAgency(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Request Security Coverage</h3>
                  <p className="text-xs text-slate-400">{bookingAgency.name}</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{bookingSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Coverage Type
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Residential Patrol Guard">Residential Patrol Guard (12-hour Shift)</option>
                      <option value="Event Rapid Security">Event Rapid Security Escort</option>
                      <option value="Perimeter Night Watch">Perimeter Night Watch (CCTV + Foot Patrol)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Service Address / Unit Number
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue="Apartment 402, Block C, Sector 4 Community"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Required Start Date
                    </label>
                    <input
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingAgency(null)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Page;
