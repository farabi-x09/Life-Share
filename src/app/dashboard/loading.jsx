'use client';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
      <div className="relative w-16 h-16">
        
        {/* Outer Spinner (Clockwise) */}
        <div className="absolute w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        
        {/* Inner Spinner (Counter-Clockwise using scale-x-[-1]) */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-red-50 border-t-red-400 rounded-full animate-spin [scale:-1_1]"></div>
      
      </div>
      
      <h2 className="mt-6 text-xl font-black text-gray-900 animate-pulse">
        Life<span className="text-red-600">Share</span>
      </h2>
      <p className="text-sm font-medium text-gray-400">Loading your dashboard...</p>
    </div>
  );
}