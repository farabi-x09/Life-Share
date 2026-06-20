"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Avatar } from "@heroui/react";
import Image from "next/image";
import { Bars, Xmark, ChevronDown, ArrowRightToSquare } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client"; // 💡 useSession ইমপোর্ট করলাম

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  // 💡 ডায়নামিক সেশন ডাটা
  // const { data: session, isPending } = useSession();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()
  const isLoggedIn = !!session;
  console.log("Current Session:", session); // ডিবাগিং এর জন্য সেশন লগ করছি

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Donation Requests", href: "/donation-requests" },
  ];

  // যদি লগইন থাকে তবেই ফান্ডিং মেনু দেখাবে
  if (isLoggedIn) {
    navLinks.push({ label: "Funding", href: "/funding" });
  }

  const isActive = (path) => pathname === path;

  // 💡 লগ-আউট হ্যান্ডলার
  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/auth/signin";
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <Xmark className="h-6 w-6" /> : <Bars className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center font-bold text-2xl text-gray-900">
              <Image src="/logo.png" alt="Life Share Logo" width={40} height={40} />
              <span className="ml-2 tracking-tight">Life<span className="text-red-600">Share</span></span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-red-600 font-semibold" : "text-gray-600 hover:text-red-600"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="w-8 h-8 rounded-full" />
            ) : !isLoggedIn ? (
              <Link href="/auth/signin">
                <Button className="bg-red-600 text-white font-medium hover:bg-red-700">
                  <ArrowRightToSquare /> Login
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <Image
                  width={32}
                  height={32}
                    alt={session?.user?.name || "User Avatar"} // ডিফল্ট নাম
                    size="sm"
                    
                    src={session?.user?.image || ""} // ইমেজ না থাকলে খালি স্ট্রিং
                    name={session?.user?.name || "User"} // নাম না থাকলে ডিফল্ট
                    className="w-8 h-8 object-cover rounded-full bg-gray-200" // স্টাইলিং
                  />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-sm font-bold text-gray-800 leading-tight">{session.user?.name}</span>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase">{session?.user.role || 'Donor'}</span>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-sm text-gray-800 truncate">{session?.user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{session?.user.email}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:text-red-600">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}