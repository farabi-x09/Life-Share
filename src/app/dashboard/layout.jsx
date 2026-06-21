// src/app/dashboard/layout.js

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }) {
  return (
    
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      
      <DashboardSidebar />
      
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
        {children}
        <ToastContainer></ToastContainer>
      </main>
    </div>
  );
}