"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, Edit, Trash2, CheckCircle, XCircle, Filter, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Loading from "../../loading"; 
import { getSomeDonation } from "@/lib/api/donations"; // 💡 updateDonationStatus ইমপোর্ট করা হলো
import { toast } from "react-toastify"; // 💡 toast ইমপোর্ট করা হলো
import { deleteDonationRequest, updateDonationStatus } from "@/lib/actions/donation_requests";

export default function MyRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await getSomeDonation(session?.user?.email);
        
        if (response) {
          setRequests(Array.isArray(response) ? response : response?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch donation requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.user?.email) fetchRequests();
  }, [session]);

  // 💡 ডাটাবেজে স্ট্যাটাস আপডেট করার লজিক যোগ করা হলো
  const updateStatus = async (id, newStatus) => {
    try {
      // ১. সার্ভারে API কল করা হলো
      await updateDonationStatus(id, { status: newStatus });

      // ২. সফল হলে পেজের UI আপডেট করা হলো
      setRequests(requests.map(req => (req.id || req._id) === id ? { ...req, status: newStatus } : req));
      toast.success(`Request marked as ${newStatus} successfully!`);
      
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

const confirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      // ১. ডাটাবেজে API কল করে ডিলিট করা
      await deleteDonationRequest(requestToDelete);

      // ২. সফল হলে পেজের UI থেকে মুছে ফেলা
      setRequests(requests.filter(req => (req.id || req._id) !== requestToDelete));
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete request. Please try again.");
    } finally {
      // ৩. শেষে ডিলিট কনফার্মেশন মোডালটি বন্ধ করে দেওয়া
      setRequestToDelete(null);
    }
  };

  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter(req => req.status === statusFilter);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); 
  };

  if (loading || !session) return <Loading />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto md:p-0 p-2">
      
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900">My Donation Requests</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Manage and track all your blood donation requests.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 self-start md:self-auto w-full md:w-auto">
          <Filter size={18} className="text-gray-400 ml-2" />
          <select 
            value={statusFilter}
            onChange={handleFilterChange}
            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer outline-none py-1 pr-2 w-full md:w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table / Card Section */}
      <div className="bg-transparent md:bg-white rounded-none md:rounded-3xl shadow-none md:shadow-sm border-none md:border border-gray-100 overflow-hidden">
        {filteredRequests.length > 0 ? (
          <>
            <div className="overflow-x-hidden md:overflow-x-auto md:p-6">
              <table className="w-full text-left border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                    <th className="pb-4">Recipient</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4">Blood</th>
                    <th className="pb-4">Date/Time</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                
                <tbody className="block md:table-row-group">
                  {paginatedRequests.map((req) => (
                    <tr key={req.id || req._id} className="block md:table-row bg-white md:bg-transparent border border-gray-100 md:border-0 md:border-b md:border-gray-50 mb-4 md:mb-0 p-4 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none hover:bg-gray-50/50 transition-colors">
                      
                      <td className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-gray-50 md:border-0">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Recipient</span>
                        <span className="font-bold text-gray-800 text-right md:text-left">{req.recipientName}</span>
                      </td>
                      
                      <td className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-gray-50 md:border-0">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Location</span>
                        <span className="text-sm text-gray-600 text-right md:text-left">{req.district}, {req.upazila}</span>
                      </td>
                      
                      <td className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-gray-50 md:border-0">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Blood Group</span>
                        <span className="font-black text-red-600 text-lg md:text-base">{req.bloodGroup}</span>
                      </td>
                      
                      <td className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-gray-50 md:border-0">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Date/Time</span>
                        <span className="text-sm text-gray-600 text-right md:text-left">
                          {req.donationDate || req.date} 
                          <span className="text-xs text-gray-400 ml-2 md:ml-0 md:block">{req.donationTime || req.time}</span>
                        </span>
                      </td>

                      <td className="flex justify-between items-center md:table-cell py-2 md:py-4 border-b border-gray-50 md:border-0">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Status</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "pending" ? "bg-gray-100 text-gray-600" :
                          req.status === "inprogress" ? "bg-blue-50 text-blue-600" :
                          req.status === "done" ? "bg-green-50 text-green-600" :
                          "bg-red-50 text-red-600"
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      <td className="flex justify-between items-center md:table-cell pt-4 md:py-4 md:border-0">
                        <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Actions</span>
                        <div className="flex justify-end items-center gap-4 md:gap-3">
                          {req.status === "inprogress" && (
                            <>
                              <button onClick={() => updateStatus(req.id || req._id, "done")} title="Mark as Done" className="text-green-600 hover:scale-110 transition-transform"><CheckCircle size={20} className="md:w-[18px] md:h-[18px]"/></button>
                              <button onClick={() => updateStatus(req.id || req._id, "canceled")} title="Cancel Request" className="text-red-600 hover:scale-110 transition-transform"><XCircle size={20} className="md:w-[18px] md:h-[18px]"/></button>
                            </>
                          )}
                          <Link href={`/donation-requests/${req.id || req._id}`} title="View Details" className="text-blue-500 hover:scale-110 transition-transform"><Eye size={20} className="md:w-[18px] md:h-[18px]"/></Link>
                          <Link href={`/dashboard/requests/edit/${req.id || req._id}`} title="Edit Request" className="text-orange-500 hover:scale-110 transition-transform"><Edit size={20} className="md:w-[18px] md:h-[18px]"/></Link>
                          <button onClick={() => setRequestToDelete(req.id || req._id)} title="Delete Request" className="text-gray-400 hover:text-red-600 hover:scale-110 transition-transform">
                            <Trash2 size={20} className="md:w-[18px] md:h-[18px]"/>
                          </button>
                        </div>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 md:px-6 md:py-4 border-t border-gray-100 bg-transparent md:bg-gray-50/50 text-center md:text-left mt-2 md:mt-0">
              <p className="text-xs md:text-sm font-medium text-gray-500">
                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> of <span className="font-bold text-gray-900">{filteredRequests.length}</span> results
              </p>
              
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 md:p-2 rounded-lg border border-gray-200 text-gray-500 bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-xs md:text-sm font-bold transition-all ${
                      currentPage === index + 1 
                        ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
                        : "text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 md:p-2 rounded-lg border border-gray-200 text-gray-500 bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <SearchX className="text-gray-300 w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-base md:text-lg font-black text-gray-900">No requests found</h3>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Try changing your filter to see more results.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {requestToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2">Delete Request</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 leading-relaxed">
              Are you sure you want to delete this donation request? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setRequestToDelete(null)} className="px-5 md:px-6 py-2 md:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-5 md:px-6 py-2 md:py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}