"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  User, MapPin, Building2, Droplet, Calendar,
  Clock, FileText, Send, AlertTriangle, Loader2
} from "lucide-react";
import Loading from "../../loading";
import { createDonationRequest } from "@/lib/actions/donation_requests";
import { toast } from "react-toastify";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateRequestPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Geo Data States
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [geoLoading, setGeoLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    recipientName: "",
    district: "",
    upazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  // Fetch Geo Data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const [dRes, uRes] = await Promise.all([
          fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json"),
          fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json"),
        ]);
        const dJson = await dRes.json();
        const uJson = await uRes.json();
        setDistricts(dJson[2]?.data || dJson);
        setAllUpazilas(uJson[2]?.data || uJson);
      } catch (err) {
        console.error("Failed to fetch geo data", err);
      } finally {
        setGeoLoading(false);
      }
    };
    fetchGeoData();
  }, []);

  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    setFormData(prev => ({ ...prev, district: selectedName, upazila: "" }));

    const found = districts.find(d => d.name === selectedName);
    if (found) {
      setFilteredUpazilas(allUpazilas.filter(u => u.district_id === found.id).map(u => u.name));
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newRequestData = {
      ...formData,
      requesterName: session?.user?.name,
      requesterEmail: session?.user?.email,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await createDonationRequest(newRequestData);

      
      if (response) {
        
        toast.success("Donation request created successfully!");

        
        e.target.reset();

       
        setTimeout(() => {
          router.push("/dashboard/donor/my-requests");
        }, 1500);
      }
    }
    catch (error) {
      console.error("Failed to create request:", error);
      toast.error("Something went wrong while creating the request!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return <Loading />;

  
  if (session?.user?.status === "blocked") {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-red-50 border-2 border-red-200 rounded-3xl text-center">
        <AlertTriangle className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-black text-red-700 mb-2">Account Blocked</h2>
        <p className="text-red-600 font-medium">
          You are currently blocked and cannot create any new donation requests. Please contact support for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Create Donation Request</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Fill out the form below to request blood. A donor will connect with you soon.</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">

        {/* Section 1: Requester Info (Read Only) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
            <User size={16} /> Requester Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Requester Name</label>
              <input type="text" readOnly value={session?.user?.name || ""} className="w-full bg-gray-50 border border-gray-100 text-gray-500 font-medium rounded-xl px-4 py-3 cursor-not-allowed outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Requester Email</label>
              <input type="email" readOnly value={session?.user?.email || ""} className="w-full bg-gray-50 border border-gray-100 text-gray-500 font-medium rounded-xl px-4 py-3 cursor-not-allowed outline-none" />
            </div>
          </div>
        </div>

        {/* Section 2: Recipient & Blood Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
            <Droplet size={16} /> Recipient Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Name *</label>
              <input required type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="e.g. Abul Kalam" className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl px-4 py-3 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Blood Group *</label>
              <select required name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl px-4 py-3 outline-none transition-all appearance-auto cursor-pointer">
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Location Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
            <MapPin size={16} /> Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Recipient District *</label>
              <select
                required
                disabled={geoLoading}
                value={formData.district}
                onChange={handleDistrictChange}
                className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base outline-none transition-all appearance-auto cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed truncate"
              >
                <option value="">{geoLoading ? "Loading..." : "Select District"}</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Upazila *</label>
              <select
                required
                disabled={!formData.district}
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base outline-none transition-all appearance-auto cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed truncate"
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Hospital Name *</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="e.g. Dhaka Medical College" className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl pl-11 pr-4 py-3 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Address Line *</label>
              <input required type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} placeholder="e.g. Zahir Raihan Rd, Dhaka" className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl px-4 py-3 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Section 4: Date & Time */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
            <Clock size={16} /> Date & Time
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Donation Date *</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="date" name="donationDate" value={formData.donationDate} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl pl-11 pr-4 py-3 outline-none transition-all cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Donation Time *</label>
              <div className="relative">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="time" name="donationTime" value={formData.donationTime} onChange={handleChange} className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl pl-11 pr-4 py-3 outline-none transition-all cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Request Message */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-50 pb-2">
            <FileText size={16} /> Additional Information
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Request Message *</label>
            <textarea required name="requestMessage" value={formData.requestMessage} onChange={handleChange} rows={4} placeholder="Why do you need blood? Provide detailed information..." className="w-full bg-white border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-900 font-medium rounded-xl px-4 py-3 outline-none transition-all resize-none"></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            {submitting ? "Submitting Request..." : "Request Blood"}
          </button>
        </div>

      </form>
    </div>
  );
}