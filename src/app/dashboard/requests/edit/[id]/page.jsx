"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";

// 💡 তোমার প্রজেক্টের সঠিক API পাথগুলো এখানে ইমপোর্ট করা হলো
import { getRequestById } from "@/lib/api/donations"; 
import { updateDonationStatus } from "@/lib/actions/donation_requests";

export default function EditRequestPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientName: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    hospitalName: "",
    fullAddress: "",
    donationDate: "",
    donationTime: "",
    requestMessage: ""
  });

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const data = await getRequestById(requestId);
        if (data) {
          setFormData({
            recipientName: data.recipientName || "",
            bloodGroup: data.bloodGroup || "",
            district: data.district || "",
            upazila: data.upazila || "",
            hospitalName: data.hospitalName || "",
            fullAddress: data.fullAddress || "",
            donationDate: data.donationDate || data.date || "",
            donationTime: data.donationTime || data.time || "",
            requestMessage: data.requestMessage || ""
          });
        } else {
          toast.error("Request not found!");
          router.push("/dashboard/donor/my-requests");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load request details.");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) fetchRequestDetails();
  }, [requestId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDonationStatus(requestId, formData);
      toast.success("Request updated successfully!");
      
      // আপডেট হওয়ার পর ড্যাশবোর্ডে ফেরত পাঠানো হবে
      router.push("/dashboard/donor/my-requests"); 
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update request.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:p-0 p-4">
      
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Request</h1>
          <p className="text-sm text-gray-500 font-medium">Update the details of your donation request.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Name</label>
              <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white">
                <option value="">Select Group</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upazila / Area</label>
              <input type="text" name="upazila" value={formData.upazila} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hospital / Clinic Name</label>
              <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Donation Date</label>
              <input type="date" name="donationDate" value={formData.donationDate} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Donation Time</label>
              <input type="time" name="donationTime" value={formData.donationTime} onChange={handleChange} required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Hospital Address</label>
            <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Message / Reason (Optional)</label>
            <textarea name="requestMessage" value={formData.requestMessage} onChange={handleChange} rows="4"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all disabled:opacity-70">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}