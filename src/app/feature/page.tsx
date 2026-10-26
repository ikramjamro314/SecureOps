"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  MapPin,
  Activity,
  Lock,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Bell,
  Map,
  LayoutDashboard,
  ArrowLeft,
  ArrowRight,
  Radio,
  Cpu,
  Users,
  Building2
} from "lucide-react";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
                SecureOps
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-6 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                Team
              </Link>
              <span className="text-blue-400 font-bold">Features</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>

            <Link
              href="/guard/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-16 pb-24 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-Driven Tactical Security Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Enterprise Security Solutions & Telemetry
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From automated sub-meter GPS geofencing to Police PSARA verification and AI risk forecasts, SecureOps synchronizes your entire security fleet.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs font-mono text-slate-400">
            <span className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">● 500m Active Geofences</span>
            <span className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">● Live Hardware GPS</span>
            <span className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">● Multi-Dashboard Sync</span>
          </div>
        </div>
      </div>

      {/* Quick Dashboard Switcher Bento Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white tracking-tight">Direct Access Role Terminals</h2>
          <p className="text-xs text-slate-400 mt-1">Jump directly into any authorized dashboard view</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/guard/dashboard"
            className="group bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base">Guard Terminal</h3>
            <p className="text-xs text-slate-400 mt-1">Live patrol breadcrumbs, geofence check-in, and emergency alert feed.</p>
          </Link>

          <Link
            href="/agency/guards"
            className="group bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base">Agency Fleet</h3>
            <p className="text-xs text-slate-400 mt-1">Master attendance muster roll, AI risk radar, and guard rosters.</p>
          </Link>

          <Link
            href="/police/dashboard"
            className="group bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base">Police Command</h3>
            <p className="text-xs text-slate-400 mt-1">Incident dispatch, emergency perimeter broadcast, and PSARA vetting.</p>
          </Link>

          <Link
            href="/user/dashboard"
            className="group bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base">Resident Radar</h3>
            <p className="text-xs text-slate-400 mt-1">Neighborhood radar map, 1-click SOS broadcast, and guard escort hails.</p>
          </Link>
        </div>
      </div>

      {/* Features Grid with Enhanced Design */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 mb-4 shadow">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="border-t border-slate-800 bg-slate-950 py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Experience Total Security Control?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Explore live role dashboards with pre-seeded data, real-time telemetry, and synchronized alert broadcasts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/guard/dashboard"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <span>Explore Guard Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 text-slate-300 font-semibold border border-slate-800 hover:border-slate-700 hover:text-white rounded-xl transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Security Guard Database & Dossiers",
    description: "Maintain structured records of all security personnel, including biometric identification, background history, and police verification status.",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: "Instant Live GPS Hardware Tracking",
    description: "Track guards in real-time with sub-meter device coordinates, zero-cache instant fixes, and continuous breadcrumb patrol trace.",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    title: "AI Deployment & Incident Risk Radar",
    description: "Predict high-risk security zones using heuristic intelligence, calculating reliability scores and fatigue variance.",
    icon: <Activity className="w-6 h-6" />,
  },
  {
    title: "Geofencing & Boundary Verification",
    description: "Automatically enforce 500m authorized security perimeters with live alert broadcasts when out-of-position variance occurs.",
    icon: <Lock className="w-6 h-6" />,
  },
  {
    title: "Master Muster Roll Attendance",
    description: "Tamper-proof shift check-in and check-out logs verified by hardware GPS coordinates and synced into agency ledgers.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    title: "Emergency SOS Broadcast Network",
    description: "Instant panic alerts broadcasted directly to local police dispatch, nearby patrol units, and community security command.",
    icon: <AlertTriangle className="w-6 h-6" />,
  },
];

export default FeaturesPage;