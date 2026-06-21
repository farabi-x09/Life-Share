"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function DashboardHome() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchRequests = async () => {
     
      setLoading(false);
    };
    if (session) fetchRequests();
  }, [session]);

  const updateStatus = async (id, newStatus) => {
   
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <h1 className="text-2xl font-black text-gray-900">Welcome back, {session?.user?.name}</h1>

      {/* Recent Requests Section (Hidden if empty) */}
      {requests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-black text-lg mb-4">Recent Donation Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase font-bold">
                  <th className="pb-4">Recipient</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Blood</th>
                  <th className="pb-4">Date/Time</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-t border-gray-50">
                    <td className="py-4 font-bold">{req.recipientName}</td>
                    <td className="py-4 text-sm">{req.district}, {req.upazila}</td>
                    <td className="py-4 font-black text-red-600">{req.bloodGroup}</td>
                    <td className="py-4 text-sm">{req.date} {req.time}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-[10px] font-bold uppercase">
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 flex gap-2">
                      {req.status === "inprogress" && (
                        <>
                          <button onClick={() => updateStatus(req.id, "done")} className="text-green-600"><CheckCircle size={18}/></button>
                          <button onClick={() => updateStatus(req.id, "canceled")} className="text-red-600"><XCircle size={18}/></button>
                        </>
                      )}
                      <Link href={`/dashboard/requests/${req.id}`}><Eye size={18}/></Link>
                      <Link href={`/dashboard/requests/edit/${req.id}`}><Edit size={18}/></Link>
                      <button className="text-gray-400"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Link href="/dashboard/my-donation-requests">
              <Button className="w-full bg-gray-900 text-white font-bold">View My All Requests</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}