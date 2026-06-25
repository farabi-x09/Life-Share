// "use client";

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { Trash2 } from "lucide-react";
// import Image from "next/image";

// export default function AllRequestsPage() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bloodFilter, setBloodFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const fetchRequestsAndUsers = async () => {
//     try {
//       const [reqRes, usersRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests`),
//         fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`)
//       ]);

//       const requestsData = await reqRes.json();
//       const usersData = await usersRes.json();

//       const mergedData = requestsData.map(req => {
//         const matchingUser = usersData.find(user => user.email === req.requesterEmail);
//         return {
//           ...req,
//           image: matchingUser?.image || null
//         };
//       });

//       setRequests(mergedData);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchRequestsAndUsers(); 
//   }, []);

//   const filteredRequests = requests.filter(req => {
//     const matchesBlood = bloodFilter === "all" || req.bloodGroup === bloodFilter;
//     const matchesStatus = statusFilter === "all" || req.status === statusFilter;
//     return matchesBlood && matchesStatus;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'done': return 'bg-green-50 text-green-700 border-green-200';
//       case 'inprogress': return 'bg-blue-50 text-blue-700 border-blue-200';
//       case 'canceled': return 'bg-red-50 text-red-700 border-red-200';
//       default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//     }
//   };

//   const handleStatusUpdate = async (id, status) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });
//     if (res.ok) { 
//       toast.success("Updated!"); 
//       fetchRequestsAndUsers(); 
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this request?")) return;
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests/${id}`, { method: "DELETE" });
//     if (res.ok) { 
//         toast.success("Deleted successfully!"); 
//         fetchRequestsAndUsers(); 
//     }
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-[60vh]">
//       <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
      
//       {/* Header & Filters */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between md:items-center">
//         <h1 className="text-2xl font-black text-gray-900">All Requests</h1>
//         <div className="flex gap-2 flex-wrap">
//             <select onChange={(e) => setBloodFilter(e.target.value)} className="bg-gray-50 border p-2 rounded-xl text-sm font-bold outline-none cursor-pointer flex-1 md:flex-none">
//                 <option value="all">Blood Group</option>
//                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
//             </select>
//             <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border p-2 rounded-xl text-sm font-bold outline-none cursor-pointer flex-1 md:flex-none">
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="inprogress">In Progress</option>
//                 <option value="done">Done</option>
//                 <option value="canceled">Canceled</option>
//             </select>
//         </div>
//       </div>

//       {/* 🖥️ Desktop Table */}
//       <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
//         <div className="overflow-x-auto w-full">
//           <table className="w-full text-left whitespace-nowrap">
//             <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
//               <tr>
//                 <th className="p-5 font-bold">Recipient & Email</th>
//                 <th className="p-5 font-bold">Blood Group</th>
//                 <th className="p-5 font-bold">Location</th>
//                 <th className="p-5 font-bold">Status</th>
//                 <th className="p-5 font-bold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRequests.map((req) => (
//                 <tr key={req._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
//                   <td className="p-5 flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden border border-red-200 shrink-0">
//                       {req.image ? (
//                         <Image src={req.image} alt="User" width={40} height={40} className="w-full h-full object-cover" />
//                       ) : (
//                         <span className="uppercase">{req.recipientName?.charAt(0) || "U"}</span>
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900 capitalize">{req.recipientName}</p>
//                       <p className="text-xs text-gray-500 mt-0.5">{req.requesterEmail}</p>
//                     </div>
//                   </td>
//                   <td className="p-5 font-black text-red-600">{req.bloodGroup}</td>
//                   <td className="p-5 text-sm">{req.district}, {req.upazila}</td>
//                   <td className="p-5">
//                     {/* 💡 এখানে ফিক্সড ওয়াইড (w-[130px]) বসানো হয়েছে */}
//                     <select value={req.status} onChange={(e) => handleStatusUpdate(req._id, e.target.value)} className={`w-[130px] px-3 py-2 rounded-lg text-xs font-bold capitalize border outline-none cursor-pointer ${getStatusColor(req.status)}`}>
//                       <option value="pending">Pending</option>
//                       <option value="inprogress">In Progress</option>
//                       <option value="done">Done</option>
//                       <option value="canceled">Canceled</option>
//                     </select>
//                   </td>
//                   <td className="p-5">
//                     <button onClick={() => handleDelete(req._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
//                       <Trash2 size={18}/>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 📱 Mobile Cards (Bulletproof Version) */}
//       <div className="lg:hidden grid gap-4 w-full">
//         {filteredRequests.map((req) => (
//           <div key={req._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-full overflow-hidden">
            
//             {/* Top Row: User Info & Blood */}
//             <div className="flex justify-between items-center gap-2 mb-4">
//               <div className="flex items-center gap-3 min-w-0">
//                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden border border-red-200 shrink-0">
//                   {req.image ? (
//                     <Image src={req.image} alt="User" width={40} height={40} className="w-full h-full object-cover" />
//                   ) : (
//                     <span className="uppercase text-sm">{req.recipientName?.charAt(0) || "U"}</span>
//                   )}
//                 </div>
//                 <div className="min-w-0">
//                   <p className="font-bold text-gray-900 text-sm truncate">{req.recipientName}</p>
//                   <p className="text-[10px] text-gray-500 truncate">{req.requesterEmail}</p>
//                 </div>
//               </div>
//               <div className="shrink-0 bg-red-50 px-2 py-1 rounded-lg">
//                 <span className="font-black text-red-600 text-[11px]">{req.bloodGroup}</span>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg mb-4">
//               <span className="text-[9px] font-bold text-gray-400 uppercase shrink-0">Loc:</span>
//               <span className="text-[11px] font-bold text-gray-700 truncate">{req.district}, {req.upazila}</span>
//             </div>

//             {/* Actions: Grid Layout */}
//             <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
//               <select 
//                 value={req.status} 
//                 onChange={(e) => handleStatusUpdate(req._id, e.target.value)} 
//                 className={`w-full h-9 px-2 rounded-lg text-[11px] font-bold capitalize border outline-none cursor-pointer ${getStatusColor(req.status)}`}
//               >
//                 <option value="pending">Pending</option>
//                 <option value="inprogress">In Progress</option>
//                 <option value="done">Done</option>
//                 <option value="canceled">Canceled</option>
//               </select>
              
//               <button 
//                 onClick={() => handleDelete(req._id)} 
//                 className="h-9 w-9 flex items-center justify-center bg-red-50 text-red-600 rounded-lg border border-red-100 shrink-0"
//               >
//                 <Trash2 size={16}/>
//               </button>
//             </div>

//           </div>
//         ))}
//       </div>

//       {filteredRequests.length === 0 && !loading && (
//         <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
//           <p className="text-gray-500 font-medium">No requests found.</p>
//         </div>
//       )}

//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function AllRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodFilter, setBloodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // 💡 ডিলিট মোডাল কন্ট্রোল করার জন্য নতুন স্টেট
  const [requestToDelete, setRequestToDelete] = useState(null); 

  const fetchRequestsAndUsers = async () => {
    try {
      const [reqRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests`),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`)
      ]);

      const requestsData = await reqRes.json();
      const usersData = await usersRes.json();

      const mergedData = requestsData.map(req => {
        const matchingUser = usersData.find(user => user.email === req.requesterEmail);
        return {
          ...req,
          image: matchingUser?.image || null
        };
      });

      setRequests(mergedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRequestsAndUsers(); 
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesBlood = bloodFilter === "all" || req.bloodGroup === bloodFilter;
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesBlood && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-50 text-green-700 border-green-200';
      case 'inprogress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'canceled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { 
      toast.success("Updated!"); 
      fetchRequestsAndUsers(); 
    }
  };

  // 💡 বাটন ক্লিক করলে শুধু আইডিটা সেভ করবে মোডাল দেখানোর জন্য
  const handleDeleteClick = (id) => {
    setRequestToDelete(id);
  };

  // 💡 মোডাল থেকে "Yes, Delete" এ ক্লিক করলে এই ফাংশনটি চলবে
  const executeDelete = async () => {
    if (!requestToDelete) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests/${requestToDelete}`, { method: "DELETE" });
    if (res.ok) { 
        toast.success("Deleted successfully!"); 
        fetchRequestsAndUsers(); 
    }
    setRequestToDelete(null); // ডিলিট শেষে মোডাল বন্ধ করে দিবে
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <h1 className="text-2xl font-black text-gray-900">All Requests</h1>
        <div className="flex gap-2 flex-wrap">
            <select onChange={(e) => setBloodFilter(e.target.value)} className="bg-gray-50 border p-2 rounded-xl text-sm font-bold outline-none cursor-pointer flex-1 md:flex-none">
                <option value="all">Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border p-2 rounded-xl text-sm font-bold outline-none cursor-pointer flex-1 md:flex-none">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
            </select>
        </div>
      </div>

      {/* 🖥️ Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="p-5 font-bold">Recipient & Email</th>
                <th className="p-5 font-bold">Blood Group</th>
                <th className="p-5 font-bold">Location</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden border border-red-200 shrink-0">
                      {req.image ? (
                        <Image src={req.image} alt="User" width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <span className="uppercase">{req.recipientName?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 capitalize">{req.recipientName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{req.requesterEmail}</p>
                    </div>
                  </td>
                  <td className="p-5 font-black text-red-600">{req.bloodGroup}</td>
                  <td className="p-5 text-sm">{req.district}, {req.upazila}</td>
                  <td className="p-5">
                    <select value={req.status} onChange={(e) => handleStatusUpdate(req._id, e.target.value)} className={`w-[130px] px-3 py-2 rounded-lg text-xs font-bold capitalize border outline-none cursor-pointer ${getStatusColor(req.status)}`}>
                      <option value="pending">Pending</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </td>
                  <td className="p-5">
                    {/* 💡 এখানে handleDeleteClick ব্যবহার করা হয়েছে */}
                    <button onClick={() => handleDeleteClick(req._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📱 Mobile Cards (Bulletproof Version) */}
      <div className="lg:hidden grid gap-4 w-full">
        {filteredRequests.map((req) => (
          <div key={req._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-full overflow-hidden">
            
            <div className="flex justify-between items-center gap-2 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden border border-red-200 shrink-0">
                  {req.image ? (
                    <Image src={req.image} alt="User" width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    <span className="uppercase text-sm">{req.recipientName?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{req.recipientName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{req.requesterEmail}</p>
                </div>
              </div>
              <div className="shrink-0 bg-red-50 px-2 py-1 rounded-lg">
                <span className="font-black text-red-600 text-[11px]">{req.bloodGroup}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg mb-4">
              <span className="text-[9px] font-bold text-gray-400 uppercase shrink-0">Loc:</span>
              <span className="text-[11px] font-bold text-gray-700 truncate">{req.district}, {req.upazila}</span>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <select 
                value={req.status} 
                onChange={(e) => handleStatusUpdate(req._id, e.target.value)} 
                className={`w-full h-9 px-2 rounded-lg text-[11px] font-bold capitalize border outline-none cursor-pointer ${getStatusColor(req.status)}`}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </select>
              
              {/* 💡 এখানে handleDeleteClick ব্যবহার করা হয়েছে */}
              <button 
                onClick={() => handleDeleteClick(req._id)} 
                className="h-9 w-9 flex items-center justify-center bg-red-50 text-red-600 rounded-lg border border-red-100 shrink-0"
              >
                <Trash2 size={16}/>
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No requests found.</p>
        </div>
      )}

      {/* 💡 Delete Confirmation Modal */}
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
                onClick={executeDelete} 
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