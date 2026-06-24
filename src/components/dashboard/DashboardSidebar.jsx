// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutGrid, User, Droplets, PenTool, LogOut, Home, Menu, X } from "lucide-react";
// import { useSession, authClient } from "@/lib/auth-client";
// import Image from "next/image";

// const DashboardSidebar = () => {
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     await authClient.signOut();
//     window.location.href = "/";
//   };

//   const isActive = (path) => pathname === path;

//   const getNavLinkClass = (path) => 
//     `flex items-center gap-3 font-bold p-3 rounded-xl transition-all duration-200 ${
//       isActive(path) 
//         ? "bg-red-600 text-white" 
//         : "text-gray-500 hover:text-red-600 hover:bg-red-50"
//     }`;

//   const closeSidebar = () => setIsOpen(false);

//   return (
//     <>
//       {/* 📱 Mobile Top Header */}
//       <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-gray-100 sticky top-0 z-40 w-full shadow-sm">
//         <Link href="/" className="flex items-center">
//             <Image src="/logo.png" width={24} height={24} alt="Logo" />
//             <h1 className="text-lg font-black text-gray-900 ml-2">Life<span className="text-red-600">Share</span></h1>
//         </Link>
//         <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600 hover:text-red-600 bg-gray-50 rounded-lg active:scale-95 transition-all">
//           <Menu size={24} />
//         </button>
//       </div>

//       {/* 📱 Mobile Overlay Backdrop */}
//       {isOpen && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-all"
//           onClick={closeSidebar}
//         />
//       )}

//       {/* 🖥️ Main Sidebar  */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col p-6 shadow-2xl md:shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
//         {/* Logo & Close Button */}
//         <div className="flex items-center justify-between mb-12">
//           <Link href="/" className="flex items-center" onClick={closeSidebar}>
//               <Image src="/logo.png" width={30} height={30} alt="Logo" />
//               <h1 className="text-xl font-black text-gray-900 ml-2">Life<span className="text-red-600">Share</span></h1>
//           </Link>
//           <button onClick={closeSidebar} className="md:hidden p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//             <X size={24} />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex-1 space-y-8 overflow-y-auto">
//           <div>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
//             <div className="space-y-1">
//                <Link href="/" className={getNavLinkClass("/")} onClick={closeSidebar}>
//                   <Home size={20} /> Home
//               </Link>
//               <Link href="/dashboard/donor" className={getNavLinkClass("/dashboard/donor")} onClick={closeSidebar}>
//                   <LayoutGrid size={20} /> Dashboard
//               </Link>
//               <Link href="/dashboard/donor/profile" className={getNavLinkClass("/dashboard/donor/profile")} onClick={closeSidebar}>
//                   <User size={20} /> My Profile
//               </Link>
//             </div>
//           </div>

//           <div>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Donations</p>
//             <div className="space-y-1">
//               <Link href="/dashboard/donor/my-requests" className={getNavLinkClass("/dashboard/donor/my-requests")} onClick={closeSidebar}>
//                   <Droplets size={20} /> My Requests
//               </Link>
//               <Link href="/dashboard/donor/create-request" className={getNavLinkClass("/dashboard/donor/create-request")} onClick={closeSidebar}>
//                   <PenTool size={20} /> Create Request
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* User Info & Logout */}
//         <div className="mt-6 pt-6 border-t border-gray-100">
//           <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4 border border-gray-100">
//             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden border border-red-200 shrink-0">
//                {session?.user?.image ? (
//                  <Image src={session.user.image} width={40} height={40} alt="User" className="w-full h-full object-cover" />
//                ) : (
//                  session?.user?.name?.charAt(0)
//                )}
//             </div>
//             <div className="overflow-hidden">
//               <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.name || "User"}</p>
//               <p className="text-xs text-gray-500 truncate">{session?.user?.role || "Donor"}</p>
//             </div>
//           </div>
          
//           <button 
//             onClick={handleLogout} 
//             className="w-full flex items-center gap-2 text-gray-500 font-bold py-2 px-4 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all"
//           >
//             <LogOut size={20} /> Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default DashboardSidebar;




"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, User, Droplets, PenTool, LogOut, Home, Menu, X, Users, ClipboardList } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import Image from "next/image";

const DashboardSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 💡 ইউজারের রোল বের করা হচ্ছে (ডিফল্ট: donor)
  const userRole = session?.user?.role || "donor";
  
  // 💡 কন্ডিশনাল লজিক: কে কোন মেনু দেখবে
  const showAllRequests = userRole === "admin" || userRole === "volunteer";
  const showManageUsers = userRole === "admin";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const isActive = (path) => pathname === path;

  const getNavLinkClass = (path) => 
    `flex items-center gap-3 font-bold p-3 rounded-xl transition-all duration-200 ${
      isActive(path) 
        ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
        : "text-gray-500 hover:text-red-600 hover:bg-red-50"
    }`;

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* 📱 Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-gray-100 sticky top-0 z-40 w-full shadow-sm">
        <Link href="/" className="flex items-center">
            <Image src="/logo.png" width={24} height={24} alt="Logo" />
            <h1 className="text-lg font-black text-gray-900 ml-2">Life<span className="text-red-600">Share</span></h1>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600 hover:text-red-600 bg-gray-50 rounded-lg active:scale-95 transition-all">
          <Menu size={24} />
        </button>
      </div>

      {/* 📱 Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-all"
          onClick={closeSidebar}
        />
      )}

      {/* 🖥️ Main Sidebar  */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col p-6 shadow-2xl md:shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center" onClick={closeSidebar}>
              <Image src="/logo.png" width={30} height={30} alt="Logo" />
              <h1 className="text-xl font-black text-gray-900 ml-2">Life<span className="text-red-600">Share</span></h1>
          </Link>
          <button onClick={closeSidebar} className="md:hidden p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-8 overflow-y-auto">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
            <div className="space-y-1">
               <Link href="/" className={getNavLinkClass("/")} onClick={closeSidebar}>
                  <Home size={20} /> Home
              </Link>
              <Link href="/dashboard/donor" className={getNavLinkClass("/dashboard/donor")} onClick={closeSidebar}>
                  <LayoutGrid size={20} /> Dashboard
              </Link>
              <Link href="/dashboard/donor/profile" className={getNavLinkClass("/dashboard/donor/profile")} onClick={closeSidebar}>
                  <User size={20} /> My Profile
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Donations</p>
            <div className="space-y-1">
              <Link href="/dashboard/donor/my-requests" className={getNavLinkClass("/dashboard/donor/my-requests")} onClick={closeSidebar}>
                  <Droplets size={20} /> My Requests
              </Link>
              <Link href="/dashboard/donor/create-request" className={getNavLinkClass("/dashboard/donor/create-request")} onClick={closeSidebar}>
                  <PenTool size={20} /> Create Request
              </Link>
            </div>
          </div>

          {/* 💡 Admin & Volunteer Section */}
          {(showAllRequests || showManageUsers) && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Administration</p>
              <div className="space-y-1">
                
                {/* এই লিংকটি Admin এবং Volunteer দুজনেই দেখবে */}
                {showAllRequests && (
                  <Link href="/dashboard/admin/all-requests" className={getNavLinkClass("/dashboard/admin/all-requests")} onClick={closeSidebar}>
                      <ClipboardList size={20} /> All Requests
                  </Link>
                )}

                {/* এই লিংকটি শুধুমাত্র Admin দেখবে */}
                {showManageUsers && (
                  <Link href="/dashboard/admin/all-users" className={getNavLinkClass("/dashboard/admin/all-users")} onClick={closeSidebar}>
                      <Users size={20} /> Manage Users
                  </Link>
                )}
                
              </div>
            </div>
          )}

        </div>

        {/* User Info & Logout */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold overflow-hidden border border-red-200 shrink-0">
               {session?.user?.image ? (
                 <Image src={session.user.image} width={40} height={40} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <span className="uppercase">{session?.user?.name?.charAt(0) || "U"}</span>
               )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate capitalize">{session?.user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-2 text-gray-500 font-bold py-2 px-4 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;