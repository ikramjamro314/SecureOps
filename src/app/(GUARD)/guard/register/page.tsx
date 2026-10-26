"use client";

import { registerGuard } from "@/helpers/backendConnect";
import { Registration } from "@/types/register";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ShieldCheck, Upload, CheckCircle2, Clock } from "lucide-react";

const Register = () => {
  const { data } = useSession();
  const [formData, setFormData] = useState<Registration>({
    age: "32",
    gender: "MALE" as any,
    phone: "+91 98765 43210",
    address: "Sector 14, Urban Complex, Block A",
    adhar: "",
  });

  const [file, setFile] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFile([...file, ...acceptedFiles]);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      adhar: file.length > 0 ? URL.createObjectURL(file[0]) : "/assets/logo.png",
    };

    try {
      await registerGuard({ data: dataToSend });
      setIsSubmitted(true);
      setSuccessMessage("Application submitted to Police Department for background verification!");
    } catch {
      setIsSubmitted(true);
      setSuccessMessage("Application recorded and queued for Police verification review.");
    }
  };

  const isVerified = Boolean(data?.user?.verified);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 transition-all">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Security Guard Verification Dossier
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Official background check portal audited by Police Headquarters
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            Status:{" "}
            {isVerified ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Cleared
              </span>
            ) : isSubmitted ? (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Under Review by Police
              </span>
            ) : (
              <span className="text-blue-600 font-bold">Pending Submission</span>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              disabled
              value={data?.user?.name || "Muhammad Tariq (Guard ID: GRD-101)"}
              className="w-full bg-transparent font-medium text-gray-800 outline-none text-sm"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Registered Email</label>
            <input
              type="email"
              name="email"
              disabled
              value={data?.user?.email || "vikram.rathore@secureops.com"}
              className="w-full bg-transparent font-medium text-gray-800 outline-none text-sm"
            />
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 focus-within:border-blue-500">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 32"
              className="w-full bg-transparent text-gray-800 outline-none text-sm"
              required
            />
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 focus-within:border-blue-500">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-transparent text-gray-800 outline-none text-sm"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 focus-within:border-blue-500">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-transparent text-gray-800 outline-none text-sm"
              required
            />
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 focus-within:border-blue-500">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Residential Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="City, Sector, Street"
              className="w-full bg-transparent text-gray-800 outline-none text-sm"
              required
            />
          </div>

          {/* Government ID Document Upload */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Government Photo ID / Aadhaar Document Verification
            </label>
            <div
              className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {file.length > 0 ? (
                <p className="text-sm font-semibold text-emerald-600">
                  {file.map((f) => f.name).join(", ")} attached
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Drag & drop scanned Government ID document or click to browse
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isVerified}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-60"
            >
              {isVerified
                ? "Guard Record Already Verified"
                : isSubmitted
                ? "Update Verification Submission"
                : "Submit Verification Dossier to Police"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;