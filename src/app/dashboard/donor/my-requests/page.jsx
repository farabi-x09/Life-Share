"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, Edit, Trash2, CheckCircle, XCircle, Filter, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Loading from "../../loading"; // পাথটা তোমার loading.jsx এর লোকেশন অনুযায়ী ঠিক করে নিও

export default function MyRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Filtering & Pagination States
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      // 💡 টেস্টিং ডামি ডাটা (আসল API বসালে এগুলো মুছে দিও)
      const dummyData = [
        { id: 1, recipientName: "Rahim Uddin", district: "Dhaka", upazila: "Mirpur", bloodGroup: "A+", date: "12 Oct 2026", time: "10:00 AM", status: "pending" },
        { id: 2, recipientName: "Karim Hasan", district: "Sylhet", upazila: "Sadar", bloodGroup: "O+", date: "14 Oct 2026", time: "02:30 PM", status: "inprogress", donorName: "John Doe", donorEmail: "john@example.com" },
        { id: 3, recipientName: "Jashim", district: "Khulna", upazila: "Batiaghata", bloodGroup: "B-", date: "15 Oct 2026", time: "11:00 AM", status: "done", donorName: "Jane Doe", donorEmail: "jane@example.com" },
        { id: 4, recipientName: "Rafiq", district: "Rajshahi", upazila: "Puthia", bloodGroup: "AB+", date: "16 Oct 2026", time: "09:00 AM", status: "canceled" },
        { id: 5, recipientName: "Salam", district: "Dhaka", upazila: "Uttara", bloodGroup: "A-", date: "18 Oct 2026", time: "05:00 PM", status: "pending" },
        { id: 6, recipientName: "Jabbar", district: "Chittagong", upazila: "Hathazari", bloodGroup: "O-", date: "20 Oct 2026", time: "01:00 PM", status: "inprogress", donorName: "Alex", donorEmail: "alex@test.com" },
      ];
      
      setRequests(dummyData); 
      setLoading(false);
    };
    
    if (session) fetchRequests();
  }, [session]);

  const updateStatus = async (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    setRequests(requests.filter(req => req.id !== requestToDelete));
    setRequestToDelete(null);
  };

  // ফিল্টারিং ও পেজিনেশন লজিক
  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter(req => req.status === statusFilter);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // ফিল্টার চেঞ্জ করলে পেজ ১ এ চলে আসবে
  };

  if (loading || !session) return <Loading />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Donation Requests</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage and track all your blood donation requests.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <Filter size={18} className="text-gray-400 ml-2" />
          <select 
            value={statusFilter}
            onChange={handleFilterChange}
            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer outline-none py-1 pr-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRequests.length > 0 ? (
          <>
            <div className="overflow-x-auto p-6">
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
                  {paginatedRequests.map((req) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> of <span className="font-bold text-gray-900">{filteredRequests.length}</span> results
                </p>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                        currentPage === index + 1 
                          ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
                          : "text-gray-500 hover:bg-white border border-transparent hover:border-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <SearchX className="text-gray-300 w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-gray-900">No requests found</h3>
            <p className="text-gray-500 text-sm mt-1">Try changing your filter to see more results.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {requestToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-2">Delete Request</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete this donation request? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setRequestToDelete(null)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}