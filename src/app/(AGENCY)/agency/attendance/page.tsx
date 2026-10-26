"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  UserCircle,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
  ShieldCheck,
  MapPin,
  Filter,
} from "lucide-react";
import { getLocalStore, MockAttendance, INITIAL_ATTENDANCE } from "@/utils/mockStore";

const AgencyAttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState<MockAttendance[]>(INITIAL_ATTENDANCE);
  const [filterShift, setFilterShift] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(format(new Date(), "HH:mm:ss"));
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch("/api/agency/attendance");
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setAttendanceList(data);
      } else {
        const { attendance } = getLocalStore();
        setAttendanceList(attendance || INITIAL_ATTENDANCE);
      }
    } catch {
      const { attendance } = getLocalStore();
      setAttendanceList(attendance || INITIAL_ATTENDANCE);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();

    const handleSync = () => {
      const { attendance } = getLocalStore();
      setAttendanceList(attendance);
    };

    window.addEventListener("secureops_store_updated", handleSync);
    return () => window.removeEventListener("secureops_store_updated", handleSync);
  }, []);

  const filtered =
    filterShift === "ALL"
      ? attendanceList
      : attendanceList.filter((a) => a.shift?.toLowerCase() === filterShift.toLowerCase());

  const presentCount = attendanceList.filter((a) => a.present).length;
  const totalCount = attendanceList.length;
  const complianceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header HUD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-7 h-7 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Agency Fleet Attendance & Muster Roll
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Automated GPS timestamping, geofence audit trail, and shift accountability
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <span suppressHydrationWarning>{currentTime || "Live Sync"}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Scheduled</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount} Guards</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Checked-In Present</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{presentCount} On Post</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variances / Absent</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">{totalCount - presentCount}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Geofence Compliance</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">{complianceRate}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-600">Filter Shift:</span>
          {(["ALL", "Morning", "Evening", "Night"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterShift(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterShift === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-base text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Verified Guard Attendance Ledger
            </h2>
            <span className="text-xs text-gray-500">{filtered.length} entries</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3.5 text-left">Guard Name</th>
                    <th className="px-6 py-3.5 text-left">Check-In Time</th>
                    <th className="px-6 py-3.5 text-left">Shift</th>
                    <th className="px-6 py-3.5 text-left">Geofence Location</th>
                    <th className="px-6 py-3.5 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-7 h-7 text-blue-600" />
                          <div>
                            <p className="font-bold text-gray-900">{record.guardName || "Guard"}</p>
                            <p className="font-mono text-xs text-blue-700 font-bold bg-blue-50 w-fit px-1.5 py-0.5 rounded mt-0.5">
                              Guard ID: {record.guardBadgeId || String(record.userId || "").slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                        <span className="font-semibold">{record.checkIn}</span>
                        {record.checkOut && (
                          <span className="text-gray-400 block text-[11px]">
                            Out: {record.checkOut}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold">
                          {record.shift || "Night"} Shift
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{record.location || "Sector 4 Complex"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold ${
                            record.present
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {record.present ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          {record.present ? "Present (Verified)" : "Absent / Late"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyAttendancePage;
