


"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams, usePathname } from "next/navigation";
import { 
  Droplet, MapPin, Building2, Calendar, Clock, 
  User, Mail, Heart, X, Loader2, Info, ArrowLeft
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { getRequestById } from "@/lib/api/donations";
import { updateDonationStatus } from "@/lib/actions/donation_requests";

const formatTimeAMPM = (timeStr) => {
  if (!timeStr) return "";
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
  const [hourString, minute] = timeStr.split(":");
  if (!hourString || !minute) return timeStr;
  let hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; 
  return `${hour < 10 ? `0${hour}` : hour}:${minute} ${ampm}`;
};

export default function RequestDetailsPage() {
  // const { data: session } = useSession();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname(); 
  const requestId = params?.id;

  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  
useEffect(() => {
  if (isPending) return; 

  if (session === null) {
    toast.error("Please sign in to view this page.");
    // window.location.href = `/signin?redirect=${pathname}`;
    // normal
    window.location.href = `/signin`;
    return;
  }

  const fetchDetails = async () => {
    if (!session || !requestId) return; 
    
    try {
      setLoading(true);
      const responseData = await getRequestById(requestId);
      if (responseData) {
        setRequestData(responseData); 
      } else {
        toast.error("Failed to load details");
      }
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [requestId, session, pathname, isPending]); 
  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    setConfirming(true);

    try {
      const updatePayload = {
        status: "inprogress",
        donorName: session?.user?.name,
        donorEmail: session?.user?.email
      };

     
      await updateDonationStatus(requestId, updatePayload);

      await new Promise(resolve => setTimeout(resolve, 1500));

      setRequestData(prev => ({ ...prev, ...updatePayload }));
      setIsModalOpen(false);
      toast.success("Donation request accepted successfully.");

    } catch (error) {
      console.error("Failed to confirm donation", error);
      toast.error("Something went wrong!");
    } finally {
      setConfirming(false);
    }
  };

//  i need a  tost when done doen


  // Fayil-er nicher dike jekhane loading check kora hoyeche:
if (loading || isPending || !session) { //  isPending jog kora holo
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" />
    </div>
  );
}
  if (!requestData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <Info className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Request Not Found</h2>
        <p className="text-gray-500 mt-2">This donation request might have been removed or does not exist.</p>
        <Link href="/donation-requests" className="mt-6 text-red-600 hover:underline font-medium">
          Go back to requests
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* 1. Profile / Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-red-50 text-red-600 flex flex-col items-center justify-center border border-red-100">
            <Droplet size={28} className="mb-1" strokeWidth={2.5} />
            <span className="font-bold text-2xl leading-none">{requestData?.bloodGroup || "N/A"}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{requestData?.recipientName || "Unknown"}</h1>
              <span className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wide rounded-md border ${
                requestData?.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                requestData?.status === "inprogress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-green-50 text-green-700 border-green-200"
              }`}>
                {requestData?.status || "Unknown"}
              </span>
            </div>
            <p className="text-gray-500 flex items-center gap-2">
              <User size={16} className="text-gray-400" /> Requested by {requestData?.requesterName || "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 2. Location Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="text-gray-400" size={18} /> Location Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Hospital / Clinic</p>
                <p className="text-gray-900 font-medium flex items-start gap-2">
                  <Building2 size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  {requestData?.hospitalName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Area</p>
                <p className="text-gray-900 font-medium">{requestData?.upazila}, {requestData?.district}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Address</p>
                <p className="text-gray-900 font-medium">{requestData?.fullAddress || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* 3. Schedule & Contact Card */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Calendar className="text-gray-400" size={18} /> Date & Time
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Required Date</p>
                  <p className="text-gray-900 font-medium">{requestData?.donationDate || requestData?.date || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Time</p>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    {formatTimeAMPM(requestData?.donationTime || requestData?.time)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Mail className="text-gray-400" size={18} /> Contact Email
              </h2>
              <p className="text-gray-900 font-medium">{requestData?.requesterEmail || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* 4. Message Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Patient's Note / Reason</h2>
          <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-red-500">
            <p className="text-gray-700 leading-relaxed">
              {requestData?.requestMessage || "No message provided."}
            </p>
          </div>
        </div>

        {/* 5. Action Button */}
        {requestData?.status === "pending" && (
          <div className="pt-2 pb-10">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto md:min-w-[300px] mx-auto py-4 px-8 bg-red-600 hover:bg-red-700 text-white transition-colors rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-sm"
            >
              <Heart size={20} />
              Accept Request & Donate
            </button>
          </div>
        )}
      </div>

      {/* Clean Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={20} />
            </button>

            <div className="mb-6 pt-2">
              <h2 className="text-xl font-bold text-gray-900">Confirm Donation</h2>
              <p className="text-gray-500 text-sm mt-1">
                Your information will be shared with the requester to coordinate the donation.
              </p>
            </div>

            <form onSubmit={handleConfirmDonation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  readOnly 
                  value={session?.user?.name || ""} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 outline-none cursor-not-allowed" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input 
                  type="email" 
                  readOnly 
                  value={session?.user?.email || ""} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 outline-none cursor-not-allowed" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={confirming}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {confirming ? <Loader2 size={18} className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}