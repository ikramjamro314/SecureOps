"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldAlert, Users, Award, ArrowRight } from "lucide-react";

interface Stat {
  data: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const StatsSection: React.FC = () => {
  const stats: Stat[] = [
    {
      data: "$350B+",
      title: "Security Market by 2030",
      desc: "Rapid transformation towards automated physical security.",
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    },
    {
      data: "70%",
      title: "Surge in Smart Security",
      desc: "Societies demanding GPS telemetric proof of guard presence.",
      icon: <Award className="w-5 h-5 text-indigo-400" />,
    },
    {
      data: "$10B+",
      title: "Lost in Manual Inefficiencies",
      desc: "Paper logbooks & ghost guards eliminated by automated geofencing.",
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
    },
    {
      data: "25%",
      title: "Guards Misallocated",
      desc: "AI deployment radar optimizes high-risk perimeter coverage.",
      icon: <Users className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-white border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Why SecureOps?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Eliminating Ghost Shifts & Communication Blackouts
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Traditional physical security relies on unverifiable paper rosters and slow phone calls. SecureOps replaces outdated protocols with sub-meter live hardware GPS, automated 500m geofencing, and centralized police dispatch.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/feature"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
              >
                <span>Explore Full Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <span>Meet Engineering Team</span>
              </Link>
            </div>
          </div>

          {/* Right Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">{item.data}</h4>
                  <p className="text-sm font-bold text-slate-200 mt-1">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;
