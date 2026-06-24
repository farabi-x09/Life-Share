
// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "@/lib/auth-client";
// import Link from "next/link";
// import { Eye, Edit, Trash2, CheckCircle, XCircle, Syringe, MapPin, CalendarDays, Droplet } from "lucide-react"; 
// import Loading from "../loading"; 
// import { getSomeDonation} from "@/lib/api/donations"; // 💡 updateDonationStatus ইমপোর্ট করা হলো
// import { toast } from "react-toastify"; // 💡 toast ইমপোর্ট করা হলো
// import { deleteDonationRequest, updateDonationStatus } from "@/lib/actions/donation_requests";

// export default function DashboardHome() {
//   const { data: session } = useSession();
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [requestToDelete, setRequestToDelete] = useState(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
//         const response = await getSomeDonation(session?.user?.email);
        
//         if (response) {
//           setRequests(Array.isArray(response) ? response : response?.data || []);
//         }
//       } catch (error) {
//         console.error("Failed to fetch recent requests:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (session?.user?.email) {
//         fetchRequests();
//     }
//   }, [session]);

//   // 💡 ডাটাবেজ এবং UI আপডেট করার লজিক যোগ করা হলো
//   const updateStatus = async (id, newStatus) => {
//     try {
//       // সার্ভারে API কল করা হলো
//       await updateDonationStatus(id, { status: newStatus });

//       // সফল হলে পেজের UI আপডেট করা হলো
//       setRequests((prevRequests) => 
//         prevRequests.map(req => 
//           (req.id || req._id) === id ? { ...req, status: newStatus } : req
//         )
//       );
//       toast.success(`Request marked as ${newStatus} successfully!`);
      
//     } catch (error) {
//       console.error("Failed to update status", error);
//       toast.error("Failed to update status. Please try again.");
//     }
//   };

//  const confirmDelete = async () => {
//     if (!requestToDelete) return;

//     try {
//       // ১. ডাটাবেজে API কল করে ডিলিট করা
//       await deleteDonationRequest(requestToDelete);

//       // ২. সফল হলে পেজের UI থেকে মুছে ফেলা
//       setRequests(requests.filter(req => (req.id || req._id) !== requestToDelete));
//       toast.success("Request deleted successfully!");
//     } catch (error) {
//       console.error("Failed to delete", error);
//       toast.error("Failed to delete request. Please try again.");
//     } finally {
//       // ৩. শেষে ডিলিট কনফার্মেশন মোডালটি বন্ধ করে দেওয়া
//       setRequestToDelete(null);
//     }
//   };

//   if (loading || !session) return <Loading />;

//   return (
//     <div className="space-y-8 max-w-5xl mx-auto md:p-0 p-2">
      
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-red-50 to-white p-6 md:p-8 rounded-3xl border border-red-100">
//         <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
//           Hello, <span className="text-red-600">{session?.user?.name?.split(" ")[0] || "Donor"}</span>!
//         </h1>
//         <p className="text-gray-600 font-medium mt-2 text-sm md:text-base">Manage your activities and help save lives today.</p>
//       </div>

//       {requests.length > 0 ? (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <h3 className="font-black text-xl text-gray-900">Recent Requests</h3>
//           </div>

//           <div className="grid grid-cols-1 gap-4">
//             {requests.slice(0, 3).map((req) => (
//               <div 
//                 key={req.id || req._id} 
//                 className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
//               >
                
//                 {/* 1. Blood Group & Recipient Info */}
//                 <div className="flex items-start md:items-center gap-4 md:w-1/3">
//                   <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-50 flex flex-col items-center justify-center text-red-600 border border-red-100">
//                     <Droplet size={16} className="mb-0.5 opacity-50" />
//                     <span className="font-black text-lg leading-none">{req.bloodGroup}</span>
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-gray-900 text-lg leading-tight">{req.recipientName}</h4>
//                     <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1.5">
//                       <MapPin size={12} className="text-gray-400" /> 
//                       {req.district}, {req.upazila}
//                     </p>
//                   </div>
//                 </div>

//                 {/* 2. Date, Time & Donor Info */}
//                 <div className="flex flex-col gap-2 md:w-1/3 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
//                   <div className="flex items-center gap-2 text-sm text-gray-700">
//                     <CalendarDays size={14} className="text-gray-400" />
//                     <span className="font-semibold">{req.donationDate || req.date}</span>
//                     <span className="text-gray-400 text-xs font-medium">({req.donationTime || req.time})</span>
//                   </div>
                  
//                   {/* Donor Info */}
//                   {["inprogress", "done"].includes(req.status) && req.donorName ? (
//                     <div className="text-xs pt-2 border-t border-gray-200/60 mt-1">
//                       <span className="text-gray-400 font-medium">Donor:</span> <span className="font-bold text-gray-800">{req.donorName}</span>
//                     </div>
//                   ) : (
//                     <div className="text-xs pt-2 border-t border-gray-200/60 mt-1 text-gray-400 italic">
//                       No donor assigned yet
//                     </div>
//                   )}
//                 </div>

//                 {/* 3. Status & Actions */}
//                 <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:w-1/4">
                  
//                   <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
//                     req.status === "pending" ? "bg-gray-100 text-gray-600" :
//                     req.status === "inprogress" ? "bg-blue-50 text-blue-600" :
//                     req.status === "done" ? "bg-green-50 text-green-600" :
//                     "bg-red-50 text-red-600"
//                   }`}>
//                     {req.status}
//                   </span>

//                   <div className="flex items-center gap-3">
//                     {req.status === "inprogress" && (
//                       <>
//                         <button onClick={() => updateStatus(req.id || req._id, "done")} title="Mark as Done" className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors"><CheckCircle size={18}/></button>
//                         <button onClick={() => updateStatus(req.id || req._id, "canceled")} title="Cancel Request" className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><XCircle size={18}/></button>
//                       </>
//                     )}
//                     <Link href={`/donation-requests/${req.id || req._id}`} title="View Details" className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Eye size={18}/></Link>
//                     <Link href={`/dashboard/requests/edit/${req.id || req._id}`} title="Edit Request" className="text-orange-500 hover:bg-orange-50 p-1.5 rounded-lg transition-colors"><Edit size={18}/></Link>
//                     <button onClick={() => setRequestToDelete(req.id || req._id)} title="Delete Request" className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
//                       <Trash2 size={18}/>
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="pt-2">
//             <Link href="/dashboard/donor/my-requests">
//               <button className="w-full py-3.5 bg-white border border-gray-200 hover:border-gray-800 hover:bg-gray-800 transition-all rounded-xl text-gray-800 hover:text-white font-bold text-sm tracking-widest uppercase shadow-sm">
//                 View Full History
//               </button>
//             </Link>
//           </div>
//         </div>
//       ) : (
//         /* Empty State */
//         <div className="flex flex-col items-center justify-center mt-10">
//           <div className="w-full py-20 px-6 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-8">
//             <Syringe className="text-gray-300 w-12 h-12 mb-4 -rotate-45" strokeWidth={1.5} />
//             <h3 className="text-xl font-black text-gray-400">No Recent Requests</h3>
//           </div>
          
//           <Link href="/dashboard/donor/my-requests">
//             <button className="px-8 py-3.5 bg-[#0f172a] hover:bg-gray-800 transition-all rounded-xl text-white font-bold text-sm tracking-widest uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
//               View All Requests
//             </button>
//           </Link>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {requestToDelete && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
//             <h3 className="text-xl font-black text-gray-900 mb-2">Delete Request</h3>
//             <p className="text-sm text-gray-500 mb-8 leading-relaxed">
//               Are you sure you want to delete this donation request? This action cannot be undone.
//             </p>
//             <div className="flex items-center gap-3 justify-end">
//               <button 
//                 onClick={() => setRequestToDelete(null)} 
//                 className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={confirmDelete} 
//                 className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all"
//               >
//                 Yes, Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, Edit, Trash2, CheckCircle, XCircle, Syringe, MapPin, CalendarDays, Droplet, Users, DollarSign, Droplets } from "lucide-react"; 
import Loading from "../loading"; 
import { getSomeDonation } from "@/lib/api/donations";
import { toast } from "react-toastify"; 
import { deleteDonationRequest, updateDonationStatus } from "@/lib/actions/donation_requests";

export default function DashboardHome() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalFunding: 0, totalRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const role = session?.user?.role;

        if (role === 'admin' || role === 'volunteer') {
          // অ্যাডমিন বা ভলান্টিয়ারের জন্য স্ট্যাটাস ফেচিং
          const [usersRes, fundsRes, reqRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`).then(r => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/funds`).then(r => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests`).then(r => r.json()),
          ]);
          const totalFunding = fundsRes.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
          setStats({ totalUsers: usersRes.length, totalFunding, totalRequests: reqRes.length });
        } else {
          // ডোনারের জন্য তার নিজস্ব রিকোয়েস্ট ফেচিং
          const response = await getSomeDonation(session?.user?.email);
          setRequests(Array.isArray(response) ? response : response?.data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.email) fetchData();
  }, [session]);

  const isAdminOrVolunteer = session?.user?.role === 'admin' || session?.user?.role === 'volunteer';

  // ডাটাবেজ এবং UI আপডেট করার লজিক
  const updateStatus = async (id, newStatus) => {
    try {
      await updateDonationStatus(id, { status: newStatus });
      setRequests((prevRequests) => 
        prevRequests.map(req => 
          (req.id || req._id) === id ? { ...req, status: newStatus } : req
        )
      );
      toast.success(`Request marked as ${newStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    try {
      await deleteDonationRequest(requestToDelete);
      setRequests(requests.filter(req => (req.id || req._id) !== requestToDelete));
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete request. Please try again.");
    } finally {
      setRequestToDelete(null);
    }
  };

  if (loading || !session) return <Loading />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto md:p-0 p-2">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-50 to-white p-6 md:p-8 rounded-3xl border border-red-100">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Hello, <span className="text-red-600">{session?.user?.name?.split(" ")[0] || (isAdminOrVolunteer ? "Admin" : "Donor")}</span>!
        </h1>
        <p className="text-gray-600 font-medium mt-2 text-sm md:text-base">
          {isAdminOrVolunteer ? "Manage your platform activities here." : "Manage your activities and help save lives today."}
        </p>
      </div>

      {/* Admin/Volunteer View */}
      {isAdminOrVolunteer ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
            <Users className="text-blue-500" size={32} />
            <div><p className="text-xs font-bold text-gray-400 uppercase">Total Donors</p><h2 className="text-2xl font-black">{stats.totalUsers}</h2></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
            <DollarSign className="text-green-500" size={32} />
            <div><p className="text-xs font-bold text-gray-400 uppercase">Total Funding</p><h2 className="text-2xl font-black">${stats.totalFunding}</h2></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
            <Droplets className="text-red-500" size={32} />
            <div><p className="text-xs font-bold text-gray-400 uppercase">Total Requests</p><h2 className="text-2xl font-black">{stats.totalRequests}</h2></div>
          </div>
        </div>
      ) : (
        /* Donor View (হুবহু তোমার আগের কোড) */
        requests.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-xl text-gray-900">Recent Requests</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {requests.slice(0, 3).map((req) => (
                <div 
                  key={req.id || req._id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  
                  {/* 1. Blood Group & Recipient Info */}
                  <div className="flex items-start md:items-center gap-4 md:w-1/3">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-50 flex flex-col items-center justify-center text-red-600 border border-red-100">
                      <Droplet size={16} className="mb-0.5 opacity-50" />
                      <span className="font-black text-lg leading-none">{req.bloodGroup}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{req.recipientName}</h4>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1.5">
                        <MapPin size={12} className="text-gray-400" /> 
                        {req.district}, {req.upazila}
                      </p>
                    </div>
                  </div>

                  {/* 2. Date, Time & Donor Info */}
                  <div className="flex flex-col gap-2 md:w-1/3 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarDays size={14} className="text-gray-400" />
                      <span className="font-semibold">{req.donationDate || req.date}</span>
                      <span className="text-gray-400 text-xs font-medium">({req.donationTime || req.time})</span>
                    </div>
                    
                    {/* Donor Info */}
                    {["inprogress", "done"].includes(req.status) && req.donorName ? (
                      <div className="text-xs pt-2 border-t border-gray-200/60 mt-1">
                        <span className="text-gray-400 font-medium">Donor:</span> <span className="font-bold text-gray-800">{req.donorName}</span>
                      </div>
                    ) : (
                      <div className="text-xs pt-2 border-t border-gray-200/60 mt-1 text-gray-400 italic">
                        No donor assigned yet
                      </div>
                    )}
                  </div>

                  {/* 3. Status & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:w-1/4">
                    
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      req.status === "pending" ? "bg-gray-100 text-gray-600" :
                      req.status === "inprogress" ? "bg-blue-50 text-blue-600" :
                      req.status === "done" ? "bg-green-50 text-green-600" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {req.status}
                    </span>

                    <div className="flex items-center gap-3">
                      {req.status === "inprogress" && (
                        <>
                          <button onClick={() => updateStatus(req.id || req._id, "done")} title="Mark as Done" className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors"><CheckCircle size={18}/></button>
                          <button onClick={() => updateStatus(req.id || req._id, "canceled")} title="Cancel Request" className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><XCircle size={18}/></button>
                        </>
                      )}
                      <Link href={`/donation-requests/${req.id || req._id}`} title="View Details" className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Eye size={18}/></Link>
                      <Link href={`/dashboard/requests/edit/${req.id || req._id}`} title="Edit Request" className="text-orange-500 hover:bg-orange-50 p-1.5 rounded-lg transition-colors"><Edit size={18}/></Link>
                      <button onClick={() => setRequestToDelete(req.id || req._id)} title="Delete Request" className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <Link href="/dashboard/donor/my-requests">
                <button className="w-full py-3.5 bg-white border border-gray-200 hover:border-gray-800 hover:bg-gray-800 transition-all rounded-xl text-gray-800 hover:text-white font-bold text-sm tracking-widest uppercase shadow-sm">
                  View Full History
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* Empty State */
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
        )
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