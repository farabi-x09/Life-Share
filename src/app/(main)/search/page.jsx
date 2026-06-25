"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Droplet, Loader2, User } from "lucide-react";
import Image from "next/image";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchPage() {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  
  const [searchParams, setSearchParams] = useState({ bloodGroup: "", district: "", upazila: "" });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 🌍 লোকেশন ডাটা নিয়ে আসার লজিক
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json")
      .then(res => res.json())
      .then(data => setDistricts(data[2]?.data || data));
    
    fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json")
      .then(res => res.json())
      .then(data => setUpazilas(data[2]?.data || data));
  }, []);

  const handleDistrictChange = (e) => {
    const dName = e.target.value;
    setSearchParams({ ...searchParams, district: dName, upazila: "" });
    const district = districts.find(d => d.name === dName);
    setFilteredUpazilas(district ? upazilas.filter(u => u.district_id === district.id) : []);
  };

  // 🔍 সার্চ করার লজিক (নতুন কোনো API লাগবে না, আগেরটা দিয়েই কাজ হবে)
  // 🔍 সার্চ করার লজিক
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      // 💡 এখানে process.env.NEXT_PUBLIC_BASE_URL যোগ করা হয়েছে যাতে সে সঠিক ব্যাকএন্ড (পোর্ট 5000) থেকে ডাটা আনে
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`);
      
      if (!res.ok) throw new Error("Failed to fetch data");
      
      const allUsers = await res.json();

      // ইউজারদের মধ্যে থেকে সিলেক্ট করা ডাটা অনুযায়ী ফিল্টার করা হচ্ছে
      const filteredDonors = allUsers.filter(user => {
        const matchBlood = searchParams.bloodGroup ? user.bloodGroup === searchParams.bloodGroup : true;
        const matchDistrict = searchParams.district ? user.district === searchParams.district : true;
        const matchUpazila = searchParams.upazila ? user.upazila === searchParams.upazila : true;
        
        // শুধু তাদেরকেই দেখাবে যাদের প্রোফাইলে ব্লাড গ্রুপ দেওয়া আছে
        return matchBlood && matchDistrict && matchUpazila && user.bloodGroup;
      });

      setDonors(filteredDonors);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 min-h-screen bg-gray-50/30">
      
      {/* 🏷️ Header Section */}
      <div className="text-center mb-10 mt-6">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Find Blood Donors</h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto">Select your required blood group and location to find available donors instantly in your area.</p>
      </div>

      {/* 🔎 Search Form */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-red-100/20 max-w-5xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Group</label>
            <select 
              className="w-full p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl font-bold border border-gray-100 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" 
              onChange={(e) => setSearchParams({...searchParams, bloodGroup: e.target.value})}
            >
              <option value="">Any Blood Group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">District</label>
            <select 
              className="w-full p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl font-bold border border-gray-100 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" 
              onChange={handleDistrictChange}
            >
              <option value="">All Districts</option>
              {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upazila</label>
            <select 
              className="w-full p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl font-bold border border-gray-100 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed" 
              onChange={(e) => setSearchParams({...searchParams, upazila: e.target.value})} 
              disabled={!searchParams.district}
            >
              <option value="">All Upazilas</option>
              {filteredUpazilas.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
            </select>
          </div>

          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full p-3.5 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <><Search size={20}/> Search</>}
          </button>
        </div>
      </div>

      {/* 📋 Results Section */}
      <div>
        {!hasSearched ? (
          /* Default State (Before Search) */
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 max-w-3xl mx-auto">
            <Search className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h3 className="text-xl font-black text-gray-400">Search for Donors</h3>
            <p className="text-sm text-gray-400 mt-2">Fill the form above and hit search to see available donors.</p>
          </div>
        ) : loading ? (
           /* Loading State */
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-red-500" />
           </div>
        ) : donors.length === 0 ? (
          /* Empty State (No match found) */
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 max-w-3xl mx-auto">
            <User className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h3 className="text-xl font-black text-gray-400">No Donors Found</h3>
            <p className="text-sm text-gray-400 mt-2">Try changing your search criteria.</p>
          </div>
        ) : (
          /* Results Grid */
          <>
            <h3 className="font-black text-xl text-gray-900 mb-6">Found {donors.length} Donors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div key={donor._id || donor.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  
                  <div className="w-14 h-14 shrink-0 rounded-full bg-red-50 flex flex-col items-center justify-center text-red-600 border border-red-100 overflow-hidden relative">
                    {donor.image ? (
                      <Image src={donor.image} alt={donor.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <span className="font-black text-lg">{donor.bloodGroup}</span>
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{donor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">
                        {donor.bloodGroup}
                      </span>
                      <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                        <MapPin size={12} className="shrink-0"/> {donor.district}, {donor.upazila}
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}