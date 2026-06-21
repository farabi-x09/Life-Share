"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import Link from "next/link";
// 💡 Syringe আইকনটি ইমপোর্ট করা হয়েছে
import { Eye, Edit, Trash2, CheckCircle, XCircle, Syringe } from "lucide-react"; 
import Loading from "../loading"; 

export default function DashboardHome() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      // 💡 এখানে API কল হবে। আপাতত টেস্টিংয়ের জন্য এম্পটি অ্যারে [] রাখছি যাতে তুমি নতুন ডিজাইনটা দেখতে পাও
      // const res = await fetch('/api/requests');
      // const data = await res.json();
      // setRequests(data);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    
    if (session) {
        fetchRequests();
    }
  }, [session]);

  const updateStatus = async (id, newStatus) => {
    console.log(`Updating status for ${id} to ${newStatus}`);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    setRequests(requests.filter(req => req.id !== requestToDelete));
    setRequestToDelete(null);
  };

  if (loading || !session) return <Loading />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
     
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Hello, <span className="text-red-600">{session?.user?.name?.split(" ")[0] || "Donor"}</span>!
        </h1>
        <p className="text-gray-500 font-medium mt-2">Manage your activities and help save lives today.</p>
      </div>

      {requests.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative">
          <h3 className="font-black text-lg mb-4">Recent Donation Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                  <th className="pb-4">Recipient</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Blood</th>
                  <th className="pb-4">Date/Time</th>
                  <th className="pb-4">Donor Info</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 3).map((req) => (
                  <tr key={req.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-800">{req.recipientName}</td>
                    <td className="py-4 text-sm text-gray-600">{req.district}, {req.upazila}</td>
                    <td className="py-4 font-black text-red-600">{req.bloodGroup}</td>
                    <td className="py-4 text-sm text-gray-600">{req.date} <br/> <span className="text-xs text-gray-400">{req.time}</span></td>
                    <td className="py-4 text-sm">
                      {req.status === "inprogress" && req.donorName ? (
                        <div>
                          <p className="font-bold text-gray-800">{req.donorName}</p>
                          <p className="text-xs text-gray-500">{req.donorEmail}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        req.status === "pending" ? "bg-gray-100 text-gray-600" :
                        req.status === "inprogress" ? "bg-blue-50 text-blue-600" :
                        req.status === "done" ? "bg-green-50 text-green-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 flex items-center gap-3">
                      {req.status === "inprogress" && (
                        <>
                          <button onClick={() => updateStatus(req.id, "done")} title="Mark as Done" className="text-green-600 hover:scale-110 transition-transform"><CheckCircle size={18}/></button>
                          <button onClick={() => updateStatus(req.id, "canceled")} title="Cancel Request" className="text-red-600 hover:scale-110 transition-transform"><XCircle size={18}/></button>
                        </>
                      )}
                      <Link href={`/dashboard/requests/${req.id}`} title="View Details" className="text-blue-500 hover:scale-110 transition-transform"><Eye size={18}/></Link>
                      <Link href={`/dashboard/requests/edit/${req.id}`} title="Edit Request" className="text-orange-500 hover:scale-110 transition-transform"><Edit size={18}/></Link>
                      <button onClick={() => setRequestToDelete(req.id)} title="Delete Request" className="text-gray-400 hover:text-red-600 hover:scale-110 transition-transform">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Link href="/dashboard/donor/my-requests">
              <button className="w-full py-3 bg-[#0f172a] hover:bg-gray-800 transition-colors rounded-xl text-white font-bold text-sm tracking-wide shadow-md">
                VIEW ALL REQUESTS
              </button>
            </Link>
          </div>
        </div>
      ) : (
        /* 💡 নতুন Empty State ডিজাইন (যখন কোনো রিকোয়েস্ট থাকবে না) */
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-full py-20 px-6 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-8">
            <Syringe className="text-gray-300 w-12 h-12 mb-4 -rotate-45" strokeWidth={1.5} />
            <h3 className="text-xl font-black text-gray-400">No Recent Requests</h3>
          </div>
          
          <Link href="/dashboard/donor/my-requests">
            <button className="px-8 py-3.5 bg-[#0f172a] hover:bg-gray-800 transition-all rounded-xl text-white font-bold text-sm tracking-widest uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              View All Requests
            </button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {requestToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-2">Delete Request</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete this donation request? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setRequestToDelete(null)} 
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}