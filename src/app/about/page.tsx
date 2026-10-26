"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, User, Shield, Sparkles, ArrowLeft, Camera } from "lucide-react";

/**
 * =========================================================================
 * 📧 HOW TO CONFIGURE CONTACT EMAIL:
 * Change the `CONTACT_EMAIL` constant below to your desired team/support email.
 * This will automatically update the "Email Us" button at the bottom of the page.
 * =========================================================================
 */
const CONTACT_EMAIL = "halepoto2003@gmail.com";

/**
 * =========================================================================
 * 📸 HOW TO ADD TEAM MEMBER PICTURES:
 * 1. Place your image files into the project's `public/team/` folder:
 *    - Adeel Sehto      ->  public/team/adeel.jpg (or .png)
 *    - Safiullah Halepoto ->  public/team/safiullah.jpg (or .png)
 *    - Mehtab Ali       ->  public/team/mehtab.jpg (or .png)
 *
 * 2. If the image path matches the `image` field below, it will render automatically.
 * 3. If no image exists yet or it fails to load, the elegant placeholder avatar
 *    with the member's initials will be shown automatically.
 * =========================================================================
 */
interface TeamMember {
  name: string;
  role: string;
  initials: string;
  image: string;
  placeholderHint: string;
  bio: string;
  skills: string[];
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Adeel Sahto",
    role: "Backend Developer",
    initials: "AS",
    image: "/team/adeel.jpg",
    placeholderHint: "public/team/adeel.jpg",
    bio: "Architecting resilient RESTful APIs, NextAuth security pipelines, MongoDB telemetry collections, and real-time backend operational services.",
    skills: ["Node.js", "Next.js APIs", "MongoDB", "Auth & Security"],
  },
  {
    name: "Safiullah Halepoto",
    role: "Frontend Developer",
    initials: "SH",
    image: "/team/safiullah.jpg",
    placeholderHint: "public/team/safiullah.jpg",
    bio: "Engineering high-performance client dashboards, real-time Leaflet patrol radar mapping, live geofence verification UI, and responsive design systems.",
    skills: ["React & Next.js", "TypeScript", "Tailwind CSS", "Leaflet Maps"],
  },
  {
    name: "Mehtab Ali",
    role: "Requirements Analyst & Documentation Lead",
    initials: "MA",
    image: "/team/mehtab.jpg",
    placeholderHint: "public/team/mehtab.jpg",
    bio: "Leading security stakeholder requirement discovery, end-user workflow specifications, system documentation, and executive project presentations.",
    skills: ["Requirements Gathering", "System Workflow", "Presentations", "Documentation"],
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1">
      {/* Photo / Placeholder Container */}
      <div className="relative w-full h-72 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col items-center justify-center border-b border-slate-800 overflow-hidden">
        {/* If image loads successfully */}
        {!imageError && member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-center"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Sleek Styled Placeholder */
          <div className="flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-purple-500/20 border-2 border-dashed border-slate-700 flex items-center justify-center shadow-inner">
                <span className="text-3xl font-black text-blue-400 tracking-wider">
                  {member.initials}
                </span>
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/80">
              Photo Placeholder
            </span>
            <p className="text-[10px] text-slate-500 font-mono mt-1.5">
              {member.placeholderHint}
            </p>
          </div>
        )}

        {/* Subtle Decorative Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Member Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            {member.role}
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            {member.name}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed mt-2.5">
            {member.bio}
          </p>
        </div>

        {/* Skill Badges */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
            Core Specialization
          </p>
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-sm font-black shadow-lg shadow-blue-500/20">
                SO
              </span>
              <span>SecureOps</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-6 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-blue-400 font-bold">Team</span>
              <Link href="/feature" className="hover:text-white transition-colors">
                Features
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 w-full flex-1">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meet The Project Creators</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Project Development Team
          </h1>

          <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The dedicated team designing, engineering, and delivering the SecureOps automated security and incident management platform.
          </p>
        </div>

        {/* Team Grid: Exactly 3 Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TEAM_MEMBERS.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </main>

      {/* Contact Section: Only Email Us */}
      <section className="bg-slate-900/60 border-t border-slate-800/80 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Have Questions or Need Support?
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Get in touch with the development team for technical inquiries, system demonstrations, or feedback.
          </p>

          <div className="pt-2 flex justify-center">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}