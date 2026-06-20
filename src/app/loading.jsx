"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50/70 backdrop-blur-sm">
     
      <div className="relative flex items-center justify-center mb-4">
     
        <Loader2 className="w-16 h-16 text-red-600 animate-spin" strokeWidth={1.5} />
        
       
        <div className="absolute w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shadow-sm animate-pulse">
          <span className="text-red-600 text-[10px] font-black tracking-tighter">LS</span>
        </div>
      </div>

     
      <div className="text-center space-y-1">
        <h3 className="text-base font-bold text-gray-800 tracking-wide animate-pulse">
          Loading LifeShare
        </h3>
        <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Please wait a moment...
        </p>
      </div>

    
      <div className="w-32 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 bg-red-600 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" 
             style={{ width: "40%" }} />
      </div>

    
      <style jsx>{`
        @keyframes loading {
          0% { left: -40%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}