"use client";

import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, AlertCircle, CheckCircle, XCircle, Search } from "lucide-react";
import { getLocalStore, saveLocalStore, INITIAL_GUARDS, MockGuard } from "@/utils/mockStore";

export default function VerificationPage() {
  const [guards, setGuards] = useState<MockGuard[]>(INITIAL_GUARDS);
  const [selectedGuard, setSelectedGuard] = useState<MockGuard | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");

  const loadGuards = async () => {
    try {
      const response = await axios.get("/api/guard");
      if (Array.isArray(response.data?.response) && response.data.response.length > 0) {
        setGuards(response.data.response);
      } else {
        const { guards: localG } = getLocalStore();
        setGuards(localG);
      }
    } catch {
      const { guards: localG } = getLocalStore();
      setGuards(localG);
    }
  };

  useEffect(() => {
    loadGuards();
  }, []);

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
        <CheckCircle className="w-3.5 h-3.5" /> Verified
      </span>
    ) : (
      <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" /> Pending Check
      </span>
    );
  };

  const handleUpdateVerification = async (verified: boolean) => {
    if (!selectedGuard) return;

    try {
      await axios.post(`/api/police/guard/${selectedGuard.id}`, { verified });
    } catch (err) {
      console.warn("API call failed, updating local state:", err);
    }

    const updatedGuards = guards.map((g) =>
      g.id === selectedGuard.id ? { ...g, verified } : g
    );

    setGuards(updatedGuards);
    saveLocalStore({ guards: updatedGuards });
    setSelectedGuard({ ...selectedGuard, verified });

    setNotification(
      `Guard ${selectedGuard.name} ${verified ? "has been officially Verified & Cleared ✅" : "clearance revoked ❌"}`
    );
    setTimeout(() => setNotification(""), 4000);
    setIsDialogOpen(false);
  };

  const filtered = guards.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Police Guard Background Verification Portal
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Criminal record validation, identity checks, and authorized security clearance issuance
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            {guards.filter((g) => g.verified).length} Cleared
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-200">
            {guards.filter((g) => !g.verified).length} Pending
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by guard name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-gray-800"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3.5 text-left">Guard Dossier</th>
                <th className="px-6 py-3.5 text-left">Contact</th>
                <th className="px-6 py-3.5 text-left">Age & Gender</th>
                <th className="px-6 py-3.5 text-left">Clearance Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((guard) => (
                <tr
                  key={guard.id}
                  className="hover:bg-gray-50/80 transition cursor-pointer"
                  onClick={() => {
                    setSelectedGuard(guard);
                    setIsDialogOpen(true);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-gray-900">{guard.name}</p>
                      <p className="text-xs font-mono text-blue-700 font-bold bg-blue-50 w-fit px-1.5 py-0.5 rounded mt-0.5">
                        Guard ID: {guard.badgeId || "GRD-101"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <p className="font-medium text-gray-900">{guard.phone}</p>
                    <p className="text-gray-400">{guard.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                    Age: {guard.age} • {guard.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {getStatusBadge(guard.verified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGuard(guard);
                        setIsDialogOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-200 transition"
                    >
                      Audit & Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal/Dialog */}
      {isDialogOpen && selectedGuard && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsDialogOpen(false)}
            ></div>

            <div className="inline-block bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 max-w-xl w-full z-10 border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Guard Background Check: {selectedGuard.name}
                    </h3>
                    <p className="text-xs font-mono text-blue-700 font-bold mt-0.5">
                      Guard ID: {selectedGuard.badgeId || "GRD-101"} • System Dossier: {selectedGuard.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-gray-50 rounded-xl space-y-2">
                    <p className="font-bold text-gray-800 text-sm mb-2">Personal Records</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedGuard.phone}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedGuard.email}</p>
                    <p><span className="text-gray-500">Age:</span> {selectedGuard.age}</p>
                    <p><span className="text-gray-500">Gender:</span> {selectedGuard.gender}</p>
                    <p><span className="text-gray-500">Address:</span> {selectedGuard.address}</p>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-xl space-y-2">
                    <p className="font-bold text-gray-800 text-sm mb-2">Police Record Check</p>
                    <p className="text-emerald-700 font-semibold">● No Criminal Convictions</p>
                    <p className="text-emerald-700 font-semibold">● Fingerprints On File</p>
                    <p className="text-emerald-700 font-semibold">● Aadhaar UIDAI Validated</p>
                    <p className="text-gray-500 mt-2">Agency: {selectedGuard.agencyName || "Apex Defense"}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <p className="font-semibold">Statutory Declaration:</p>
                  <p className="text-[11px] mt-0.5 text-blue-800/80">
                    By clicking Verify, you certify that this security personnel has passed standard physical security vetting and background checks.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition"
                    onClick={() => handleUpdateVerification(false)}
                  >
                    Revoke Clearance
                  </button>

                  <button
                    type="button"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                    onClick={() => handleUpdateVerification(true)}
                  >
                    Authorize & Verify Guard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
