"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Send, CheckCircle2, Heart } from "lucide-react";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 4000);
  };

  const navSections = [
    {
      title: "Core Platform",
      links: [
        { name: "Platform Features", href: "/feature" },
        { name: "Meet Our Team", href: "/about" },
        { name: "Role Selector Portal", href: "/login" },
        { name: "System Architecture", href: "/feature" },
      ],
    },
    {
      title: "Role Portals",
      links: [
        { name: "Guard Duty Terminal", href: "/guard/dashboard" },
        { name: "Agency Fleet Directory", href: "/agency/guards" },
        { name: "Police Dispatch Command", href: "/police/dashboard" },
        { name: "Resident Safety Radar", href: "/user/dashboard" },
      ],
    },
    {
      title: "Security Operations",
      links: [
        { name: "Muster Roll Attendance", href: "/agency/attendance" },
        { name: "Police PSARA Vetting", href: "/police/verification" },
        { name: "Emergency SOS Dispatch", href: "/user/alert" },
        { name: "Vetted Agencies Browser", href: "/user/agency" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Top Newsletter & Brand Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-12 border-b border-slate-800/80">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Secure<span className="text-blue-400">Ops</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Real-time security telemetry, sub-meter GPS geofencing, and multi-portal operational dispatch for modern residential complexes.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! You are subscribed to SecureOps Security Bulletins.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for security updates..."
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 SecureOps - Intelligent Urban Security Management. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
            <Link href="/feature" className="hover:text-slate-300 transition-colors">
              Features
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Team
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
