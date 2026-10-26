"use client";

import React from "react";
import Link from "next/link";
import { Shield, CheckCircle2, ArrowRight, Radio, Compass, Lock } from "lucide-react";

const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900/40 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Tactical Features Visual */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono font-bold text-slate-300">Live Telemetric Protocol</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-3">
                <Compass className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Sub-Meter Hardware GPS Accuracy</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous watch position directly from device sensors, refreshing in real-time without stale caching.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">500m Sector Geofence Perimeter</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated attendance verification: only guards physically inside their duty base can check in as Present.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-3">
                <Radio className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Synchronized Emergency Broadcast</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Resident panic alerts instantly trigger notifications across Police dispatch terminals and guard radar maps.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Status: Multi-Dashboard Sync</span>
              <span className="text-blue-400 font-bold">100% Operational</span>
            </div>
          </div>

          {/* Right Column: Mission & Call To Actions */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Mission: Smart Urban Security
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Security Should Be Proactive, Verifiable, and Instant
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Our AI-driven platform eliminates inefficiencies, reduces response times by 40%, and provides total operational transparency. No more blind spots—just accountability, real GPS verification, and rapid crisis response.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero manual logbooks — tamper-proof digital muster roll</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct integration with Local Police stations & PCR units</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant escort requests & live community radar tracking</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/guard/dashboard"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
              >
                <span>Launch Guard Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/feature"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <span>View Full Features</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
