"use client";

import Link from "next/link";
import { useState, useEffect, FC } from "react";
import { Shield, ArrowRight, LayoutDashboard, Radio, Building2, Users } from "lucide-react";

interface NavigationItem {
    title: string;
    path: string;
    icon?: string;
}

const PreHero: FC = () => {
    const [state, setState] = useState<boolean>(false);

    const navigation: NavigationItem[] = [
        { title: "Features", path: "/feature" },
        { title: "Team", path: "/about" },
        { title: "Guard", path: "/guard/dashboard" },
        { title: "Agency", path: "/agency/guards" },
        { title: "Police", path: "/police/dashboard" },
        { title: "Resident", path: "/user/dashboard" },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".menu-btn") && !target.closest(".mobile-nav")) {
                setState(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const Brand: FC = () => (
        <div className="flex items-center justify-between py-4 md:block">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                        Secure<span className="text-blue-400">Ops</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase -mt-1">
                        Tactical Intelligence
                    </span>
                </div>
            </Link>
            <div className="md:hidden">
                <button
                    className="menu-btn p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    onClick={() => setState(!state)}
                    aria-label="Toggle Navigation"
                >
                    {state ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-950 text-white border-b border-slate-900 relative overflow-hidden">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none"></div>

            <header className="relative z-30">
                <div className={`md:hidden ${state ? "mx-4 pb-4" : "hidden"}`}>
                    <Brand />
                </div>
                <nav className={`pb-4 md:text-sm ${state ? "mobile-nav absolute z-30 top-0 inset-x-0 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl mx-3 mt-3 p-4 shadow-2xl md:relative md:bg-transparent md:border-0 md:p-0 md:m-0" : ""}`}>
                    <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
                        <Brand />
                        <div className={`flex-1 items-center mt-6 md:mt-0 md:flex ${state ? "block" : "hidden"}`}>
                            <ul className="flex-1 justify-end items-center space-y-4 md:flex md:space-x-8 md:space-y-0">
                                {navigation.map((item, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={item.path}
                                            className="block text-slate-300 hover:text-white font-medium text-sm transition-colors py-1 md:py-0"
                                            onClick={() => setState(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-2 md:pt-0">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-1.5 py-2.5 px-5 text-white font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 duration-150 rounded-xl shadow-lg shadow-blue-600/25 md:inline-flex"
                                        onClick={() => setState(false)}
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        <span>Select Role</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <section className="relative">
                <div className="relative z-10 max-w-screen-xl mx-auto px-4 pt-20 pb-28 md:px-8">
                    <div className="space-y-6 max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                            Real-Time Multi-Dashboard Operational System
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-black tracking-tight leading-tight">
                            Smart Security Operations & Telemetry Platform
                        </h1>

                        <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
                            One unified ecosystem connecting Guards, Security Agencies, Police Command, and Residents with live GPS hardware verification, 500m geofencing, and AI predictive deployment.
                        </p>

                        <div className="pt-6 flex flex-col items-center gap-4">
                            <Link
                                href="/login"
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-base transition-all duration-200 shadow-2xl shadow-blue-500/30 inline-flex items-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <span>Get Started (Explore Dashboards)</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                                <Link
                                    href="/guard/dashboard"
                                    className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500 transition-all text-xs font-semibold flex items-center gap-1.5 shadow"
                                >
                                    <Shield className="w-3.5 h-3.5 text-blue-400" /> Guard Dashboard
                                </Link>
                                <Link
                                    href="/agency/guards"
                                    className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500 transition-all text-xs font-semibold flex items-center gap-1.5 shadow"
                                >
                                    <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Agency Fleet
                                </Link>
                                <Link
                                    href="/police/dashboard"
                                    className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500 transition-all text-xs font-semibold flex items-center gap-1.5 shadow"
                                >
                                    <Radio className="w-3.5 h-3.5 text-emerald-400" /> Police Command
                                </Link>
                                <Link
                                    href="/user/dashboard"
                                    className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-amber-600 text-slate-300 hover:text-white border border-slate-800 hover:border-amber-500 transition-all text-xs font-semibold flex items-center gap-1.5 shadow"
                                >
                                    <Users className="w-3.5 h-3.5 text-amber-400" /> Resident Radar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PreHero;