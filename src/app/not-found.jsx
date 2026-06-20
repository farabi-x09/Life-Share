"use client";

import Link from "next/link";
import { ArrowLeft, HeartCrack, HelpCircle } from "lucide-react";


function NotFoundPage() {
  return (
    <section className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-500/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-500/[0.03] blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md text-center relative z-10">
        
        {/* Big Animated Illustration */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-red-50 rounded-full blur-xl opacity-70 animate-pulse" />
          
          <div className="relative w-32 h-32 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-xl shadow-gray-100/40">
            <HeartCrack className="w-14 h-14 text-red-500 animate-[bounce_2s_infinite]" strokeWidth={1.5} />
          </div>
          
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-red-600 border-2 border-white flex items-center justify-center shadow-md">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-3 mb-8">
          <h1 className="text-7xl font-black tracking-tighter text-gray-900">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
            Oops! The page you are looking for doesn&apos;t exist or has been moved to a different drop zone.
          </p>
        </div>

        {/* Interactive Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link 
            href="/"
            className="w-full sm:w-auto p-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.99] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <Link 
            href="/contact"
            className="w-full sm:w-auto p-3 px-6 bg-white border-2 border-gray-200 hover:border-red-500/30 text-gray-700 font-bold rounded-xl text-sm flex items-center justify-center transition-all duration-200"
          >
            Report Issue
          </Link>
        </div>

      </div>
    </section>
  );
}


export default NotFoundPage;