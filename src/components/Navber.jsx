"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import Image from "next/image";
import { Bars, Xmark, ChevronDown, ArrowRightToSquare } from "@gravity-ui/icons";
import { authClient, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const isLoggedIn = !!session;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Donation Requests", href: "/donation-requests" },
  ];

  if (isLoggedIn) navLinks.push({ label: "Funding", href: "/funding" });

  const isActive = (path) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    window.location.href = "/auth/signin";
  };

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <Xmark size={24} /> : <Bars size={24} />}
            </button>
            <Link href="/" className="flex items-center font-black text-xl md:text-2xl text-gray-900">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
              <span className="ml-2 tracking-tight">Life<span className="text-red-600">Share</span></span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  isActive(link.href) ? "text-red-600" : "text-gray-600 hover:text-red-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {isPending ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
            ) : !isLoggedIn ? (
              <Link href="/auth/signin">
                <Button className="bg-red-600 text-white font-bold h-10 px-4 rounded-xl hover:bg-red-700">
                  <ArrowRightToSquare className="w-4 h-4 mr-1" /> Login
                </Button>
              </Link>
            ) : (
              <div className="relative">
                {/* Dropdown Trigger */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-100 bg-gray-50 hover:bg-white transition-all outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-gray-200">
                    <Image src={session?.user?.image || "/default-avatar.png"} alt="User" fill className="object-cover" />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 leading-tight">{session?.user?.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{session?.user?.role || 'Donor'}</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Overlay দিয়ে ফিক্স করা হয়েছে */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="font-bold text-sm text-gray-800 truncate">{session?.user?.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{session?.user?.role}</p>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg">Log Out</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute w-full bg-white border-b border-gray-100 p-6 space-y-4 z-40 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-lg font-black py-2 ${isActive(link.href) ? "text-red-600" : "text-gray-800"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}