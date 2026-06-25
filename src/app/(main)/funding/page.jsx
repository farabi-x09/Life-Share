


"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { CreditCard, DollarSign, CalendarDays, User, X, HeartHandshake } from "lucide-react";
import Loading from "../../loading";
import { toast } from "react-toastify";

export default function FundingPage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/funds`);
        const data = await response.json();
        setFunds(data);
      } catch (error) {
        console.error("Failed to fetch funds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) toast.success("Payment successful! Thank you for your contribution. ❤️");
    if (query.get("canceled")) toast.error("Payment canceled. You can try again later.");
  }, []);

  if (isPending || loading) return <Loading />;
  if (session === null) {
    if (typeof window !== "undefined") window.location.href = "/signin";
    return null;
  }

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900">Funding & Donations</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Support our organization to help more people in need.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-full md:w-auto gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95">
          <HeartHandshake size={20} /> Give Fund
        </button>
      </div>

      {/* Funds Section */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Recent Funds</h2>
        </div>

        {/* 🖥️ Desktop: Table View */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100 bg-white">
                <th className="px-6 py-5">Donor Name</th>
                <th className="px-6 py-5">Fund Amount</th>
                <th className="px-6 py-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><User size={18} /></div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm capitalize">{fund.userName !== "undefined" ? fund.userName : "Anonymous Donor"}</p>
                      <p className="text-xs text-gray-500">{fund.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-black text-green-600 bg-green-50/50 w-32">
                    <span className="flex items-center"><DollarSign size={14} className="mr-0.5" /> {fund.price}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600 font-medium">{formatDate(fund.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile: Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {funds.map((fund) => (
            <div key={fund._id} className="border border-gray-100 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User size={18} /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{fund.userName !== "undefined" ? fund.userName : "Anonymous Donor"}</p>
                  <p className="text-xs text-gray-500 truncate">{fund.userEmail}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="flex items-center font-black text-green-600 text-sm">
                    <DollarSign size={14} className="mr-0.5" /> {fund.price}
                </span>
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><CalendarDays size={14}/> {formatDate(fund.date)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {funds.length === 0 && (
          <div className="text-center py-16 px-4">
            <h3 className="text-lg font-bold">No funds found</h3>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full"><X size={20} /></button>
            <h3 className="text-xl font-black mb-4">Enter Amount</h3>
            <form action="/api/checkout-session" method="POST" className="space-y-4">
              <input type="number" name="price" required placeholder="Enter amount" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-xl font-bold text-xl" />
              <input type="hidden" name="title" value="Donation" />
              <button type="submit" className="w-full py-4 bg-[#0f172a] text-white font-bold rounded-xl">Pay Now</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}