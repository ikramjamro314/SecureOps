"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Building2, Radio, Users, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const HeroSection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role) {
      if (session.user.role === "AGENCY") {
        router.push("/agency/guards");
      } else if (session.user.role === "GUARD") {
        router.push("/guard/dashboard");
      } else if (session.user.role === "POLICE") {
        router.push("/police/dashboard");
      } else if (session.user.role === "USER") {
        router.push("/user/dashboard");
      }
    }
  }, [session, router]);

  const roles = [
    {
      title: "Security Guard",
      subtitle: "Live GPS duty check-in, geofence tracking & emergency alerts response terminal.",
      href: "/guard/dashboard",
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      badge: "On-Duty Patrol",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      accent: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    },
    {
      title: "Security Agency",
      subtitle: "Master attendance muster roll, AI risk predictive radar & guard fleet management.",
      href: "/agency/guards",
      icon: <Building2 className="w-6 h-6 text-indigo-400" />,
      badge: "Fleet Command",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      accent: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    },
    {
      title: "Police Station",
      subtitle: "Emergency incident dispatch, perimeter broadcast alarm & PSARA vetting ledger.",
      href: "/police/dashboard",
      icon: <Radio className="w-6 h-6 text-emerald-400" />,
      badge: "Command Console",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      accent: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    },
    {
      title: "Resident User",
      subtitle: "Tactical neighborhood radar map, 1-tap SOS panic alerts & guard escort hailing.",
      href: "/user/dashboard",
      icon: <Users className="w-6 h-6 text-amber-400" />,
      badge: "Community Radar",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      accent: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    },
  ];

  return (
    <section className="relative bg-slate-900/60 border-b border-slate-800 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Multi-Role Operational Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real-Time Security Intelligence, Distributed Across Roles
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every guard, every shift, every incident: instantly visible, verifiable, and actionable across dedicated role terminals.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all hover:scale-105 active:scale-95 self-start md:self-auto"
          >
            <span>Explore All Roles</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </Link>
        </div>

        {/* 4 Interactive Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className={`group bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${role.accent}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {role.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {role.subtitle}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Enter Terminal</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
