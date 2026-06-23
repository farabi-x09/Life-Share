

// "use client";

// import React, { useState, useEffect } from "react";
// import { useSession } from "@/lib/auth-client";
// import { CreditCard, DollarSign, CalendarDays, User, X, HeartHandshake } from "lucide-react";
// import Loading from "../../loading"; 
// import { toast } from "react-toastify";

// export default function FundingPage() {
//   const { data: session, isPending } = useSession();
//   const [loading, setLoading] = useState(true);
//   const [funds, setFunds] = useState([]); 
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [customAmount, setCustomAmount] = useState("");

//   useEffect(() => {
//     // 💡 ডাটাবেজ থেকে রিয়েল ডাটা ফেচ করা
//     const fetchFunds = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/funds`);
//         const data = await response.json();
//         setFunds(data);
//       } catch (error) {
//         console.error("Failed to fetch funds:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFunds();

//     const query = new URLSearchParams(window.location.search);
//     if (query.get("success")) {
//       toast.success("Payment successful! Thank you for your contribution. ❤️");
//     }
//     if (query.get("canceled")) {
//       toast.error("Payment canceled. You can try again later.");
//     }
//   }, []);

//   if (isPending || loading) return <Loading />;

//   if (session === null) {
//     if (typeof window !== "undefined") window.location.href = "/signin";
//     return null;
//   }

//   // ডেট ফরম্যাট করার ফাংশন
//   const formatDate = (isoString) => {
//     if (!isoString) return "N/A";
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(isoString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 relative">
      
//       {/* Header & Give Fund Button */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-black text-gray-900">Funding & Donations</h1>
//           <p className="text-sm text-gray-500 font-medium mt-1">Support our organization to help more people in need.</p>
//         </div>

//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center justify-center w-full md:w-auto gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
//         >
//           <HeartHandshake size={20} />
//           Give Fund
//         </button>
//       </div>

//       {/* Funds Table */}
//       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
//           <h2 className="text-lg font-bold text-gray-900">Recent Funds</h2>
//         </div>
        
//         {/* 💡 overflow-x-auto দেওয়া হয়েছে যাতে মোবাইলে টেবিল স্ক্রল করা যায় */}
//         <div className="overflow-x-auto w-full">
//           <table className="w-full text-left border-collapse min-w-[500px]">
//             <thead>
//               <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100 bg-white">
//                 <th className="p-4 md:p-6 font-bold tracking-wider">Donor</th>
//                 <th className="p-4 md:p-6 font-bold tracking-wider">Fund Amount</th>
//                 <th className="p-4 md:p-6 font-bold tracking-wider">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {funds.map((fund) => (
//                 <tr key={fund._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  
//                   {/* 💡 নামের নিচে ইমেইল বসানো হয়েছে */}
//                   <td className="p-4 md:p-6 align-middle">
//                     <div className="flex items-center gap-3 md:gap-4">
//                       <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//                         <User size={20} />
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-bold text-gray-900 text-sm md:text-base capitalize">
//                           {fund.userName && fund.userName !== "undefined" ? fund.userName : "Anonymous Donor"}
//                         </span>
//                         <span className="text-xs text-gray-500 font-medium mt-0.5 max-w-[150px] md:max-w-[250px] truncate" title={fund.userEmail}>
//                           {fund.userEmail}
//                         </span>
//                       </div>
//                     </div>
//                   </td>
                  
//                   <td className="p-4 md:p-6 align-middle">
//                     <span className="inline-flex items-center font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm md:text-base border border-green-100">
//                       <DollarSign size={16} className="-ml-1" />
//                       {fund.price}
//                     </span>
//                   </td>
                  
//                   <td className="p-4 md:p-6 align-middle whitespace-nowrap">
//                     <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-600">
//                       <CalendarDays size={16} className="text-gray-400 shrink-0" />
//                       {formatDate(fund.date)}
//                     </div>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {funds.length === 0 && (
//             <div className="text-center py-16 px-4">
//               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
//                 <DollarSign size={24} className="text-gray-300" />
//               </div>
//               <h3 className="text-lg font-bold text-gray-900">No funds found</h3>
//               <p className="text-gray-500 font-medium text-sm mt-1">Be the first to donate and support our cause!</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
//           <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative">
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 bg-gray-50 hover:bg-gray-100 rounded-full">
//               <X size={20} />
//             </button>
//             <div className="text-center mb-6 mt-2">
//               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
//                 <DollarSign size={28} strokeWidth={2.5} />
//               </div>
//               <h3 className="text-xl font-black text-gray-900">Enter Amount</h3>
//               <p className="text-sm text-gray-500 mt-1">How much would you like to donate?</p>
//             </div>

//             <form action="/api/checkout-session" method="POST" className="space-y-5">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <span className="text-gray-500 font-bold text-lg">$</span>
//                 </div>
//                 <input type="number" name="price" min="1" required placeholder="0.00" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
//                   className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
//               </div>
//               <input type="hidden" name="title" value="Donation to Blood Bank" />
//               <input type="hidden" name="productId" value="prod_12345" />
//               <button type="submit" className="w-full py-4 bg-[#0f172a] hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
//                 Proceed to Pay <CreditCard size={18} />
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


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
    if (query.get("success")) {
      toast.success("Payment successful! Thank you for your contribution. ❤️");
    }
    if (query.get("canceled")) {
      toast.error("Payment canceled. You can try again later.");
    }
  }, []);

  if (isPending || loading) return <Loading />;

  if (session === null) {
    if (typeof window !== "undefined") window.location.href = "/signin";
    return null;
  }

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  return (
    // 💡 overflow-hidden যোগ করা হয়েছে যাতে স্ক্রিনের বাইরে কিছু না যায়
    <div className="space-y-6 w-full max-w-6xl mx-auto p-4 md:p-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900">Funding & Donations</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Support our organization to help more people in need.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-full md:w-auto gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
        >
          <HeartHandshake size={20} />
          Give Fund
        </button>
      </div>

      {/* Funds Table */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 w-full">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl md:rounded-t-3xl">
          <h2 className="text-lg font-bold text-gray-900">Recent Funds</h2>
        </div>
        
        {/* 💡 এই ডিভটাই হলো আসল রেস্পন্সিভ ম্যাজিক! */}
        <div className="block w-full overflow-x-auto">
          {/* 💡 min-w-[600px] দেওয়া হয়েছে যাতে ছোট স্ক্রিনে চাপাচাপি না করে স্ক্রল তৈরি করে */}
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100 bg-white">
                <th className="px-4 py-4 md:px-6 md:py-5 font-bold tracking-wider">Donor Name</th>
                <th className="px-4 py-4 md:px-6 md:py-5 font-bold tracking-wider">Fund Amount</th>
                <th className="px-4 py-4 md:px-6 md:py-5 font-bold tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((fund) => (
                <tr key={fund._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  
                  <td className="px-4 py-4 md:px-6 md:py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm md:text-base capitalize">
                          {fund.userName && fund.userName !== "undefined" ? fund.userName : "Anonymous Donor"}
                        </span>
                        <span className="text-xs text-gray-500 font-medium mt-0.5">
                          {fund.userEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 md:px-6 md:py-5">
                    <span className="inline-flex items-center font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm md:text-base border border-green-100">
                      <DollarSign size={16} className="-ml-1" />
                      {fund.price}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 md:px-6 md:py-5">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-600">
                      <CalendarDays size={16} className="text-gray-400 shrink-0" />
                      {formatDate(fund.date)}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          
          {funds.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <DollarSign size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No funds found</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">Be the first to donate and support our cause!</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 bg-gray-50 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
            <div className="text-center mb-6 mt-2">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <DollarSign size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Enter Amount</h3>
              <p className="text-sm text-gray-500 mt-1">How much would you like to donate?</p>
            </div>

            <form action="/api/checkout-session" method="POST" className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold text-lg">$</span>
                </div>
                <input type="number" name="price" min="1" required placeholder="0.00" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
              </div>
              <input type="hidden" name="title" value="Donation to Blood Bank" />
              <input type="hidden" name="productId" value="prod_12345" />
              <button type="submit" className="w-full py-4 bg-[#0f172a] hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
                Proceed to Pay <CreditCard size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}