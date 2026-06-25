"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, Droplet, Clock, SearchX, ArrowRight } from "lucide-react";
import { getDonations } from "@/lib/api/donations";
import { toast } from "react-toastify";

const formatTimeAMPM = (timeStr) => {
  if (!timeStr) return "";
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  
  const [hourString, minute] = timeStr.split(":");
  if (!hourString || !minute) return timeStr;

  let hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; 
  const formattedHour = hour < 10 ? `0${hour}` : hour;

  return `${formattedHour}:${minute} ${ampm}`;
};

export default function PublicDonationRequestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await getDonations("pending");
        
        if (response) {
          const fetchedData = Array.isArray(response) ? response : response?.data || [];
          const pendingOnly = fetchedData.filter(req => req.status === "pending");
          setRequests(pendingOnly);
        }
      } catch (error) {
        console.error("Failed to fetch public requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingRequests();
  }, []);

  const handleViewDetails = (id) => {
    if (session) {
      router.push(`/donation-requests/${id}`); 
    } else {
      toast.error("Please sign in to view detailed information and accept this donation request.");
      // router.push(`/signin?redirect=/donation-requests/${id}`); 
      window.location.href = `/signin?redirect=/donation-requests/${id}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide border border-red-200 shadow-sm shadow-red-50">
            <Droplet size={14} className="animate-pulse" /> Urgent Life Saving Needs
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tighter">
            Open Donation <span className="text-red-600">Requests</span>
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
            People listed below need your help urgently. Review the details and step forward to save a precious life today.
          </p>
        </div>

        {/* Request Cards Grid */}
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {requests.map((req) => (
              <div 
                key={req.id || req._id} 
                className="bg-white rounded-3xl p-7 shadow-sm shadow-gray-100 border border-gray-100 hover:shadow-xl hover:shadow-red-50 hover:border-red-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-white rounded-full -mr-10 -mt-10 blur-xl opacity-80 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Blood Group & Recipient Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-red-600 flex flex-col items-center justify-center text-white border-2 border-red-700 shadow-lg shadow-red-600/30">
                      <Droplet size={18} className="mb-0.5" />
                      <span className="font-black text-2xl leading-none tracking-tight">{req.bloodGroup}</span>
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-1.5 border border-amber-200">
                        Pending
                      </span>
                      <h3 className="font-extrabold text-gray-950 text-xl leading-tight line-clamp-1 tracking-tight">{req.recipientName}</h3>
                    </div>
                  </div>

                  {/* Info List */}
                  <div className="space-y-4 flex-1 mb-8">
                    <div className="flex items-center gap-3.5 text-gray-700">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200/50">
                        <MapPin size={16} className="text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">LOCATION</span>
                        <span className="font-semibold text-gray-900 -mt-0.5">{req.district}, {req.upazila}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3.5 text-gray-700">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200/50">
                        <CalendarDays size={16} className="text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">REQUIRED DATE</span>
                        <span className="font-semibold text-gray-900 -mt-0.5">{req.donationDate || req.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 text-gray-700">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200/50">
                        <Clock size={16} className="text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">TIME</span>
                        
                        <span className="font-semibold text-gray-900 -mt-0.5">{formatTimeAMPM(req.donationTime || req.time)}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleViewDetails(req.id || req._id)}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white transition-all rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 group shadow-lg shadow-red-600/20 active:scale-[0.98]"
                  >
                    View & Step Forward
                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <SearchX className="text-gray-300 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">No Life Saving Needs Found</h3>
            <p className="text-gray-600 font-medium text-base md:text-lg mt-2 max-w-md leading-relaxed">
              Alhamdulillah! There are currently no pending blood donation requests. Please check back later.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}