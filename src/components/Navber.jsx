"use client";

import React, { useState } from "react";
import Link from "next/link"; 
import { usePathname } from "next/navigation";
import { Button, Avatar } from "@heroui/react";
import Image from "next/image";

import { Bars, Xmark, ChevronDown, ArrowRightToSquare } from "@gravity-ui/icons";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const pathname = usePathname();

  // Mock Authentication States
  const isLoggedIn = false; 
  const user = {
    name: "Rahat Karim",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    role: "donor"
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Donation Requests", href: "/donation-requests" },
  ];

  if (isLoggedIn) {
    navLinks.push({ label: "Funding", href: "/funding" });
  }

  const isActive = (path) => pathname === path;

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left Side: Mobile Menu Button + Logo */}
          <div className="flex items-center ">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <Xmark className="h-6 w-6" /> : <Bars className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center  font-bold text-2xl  text-gray-900">
              <Image src="/logo.png" alt="Life Share Logo" width={50} height={50} className="rounded-full" />
              <span className="tracking-tight">Life<span className="text-red-600">Share</span></span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) 
                    ? "text-red-600 font-semibold" 
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions Cluster */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
               <Link href="/login">
                <Button   className="bg-red-600 text-white font-medium hover:bg-red-700 shadow-md transition-all">
                 <ArrowRightToSquare></ArrowRightToSquare> Login
                </Button>
                 </Link>
              </>
            ) : (
             
              <div className="relative">
               
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all focus:outline-none text-left select-none cursor-pointer"
                >
                  <Avatar
                    size="sm"
                    src={user.avatar}
                    name={user.name}
                    className="w-8 h-8 shrink-0"
                  />
                  <div className="hidden md:flex flex-col">
                    <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
                    <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">{user.role}</span>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-gray-400 hidden md:block shrink-0 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

              
                {isDropdownOpen && (
                  <>
                  
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    
                   
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 transform origin-top-right transition-all duration-150 ease-out">
                     
                      <div className="px-4 py-3 border-b border-gray-100 mb-1">
                        <p className="font-semibold text-[11px] text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="font-bold text-sm text-gray-800 truncate">{user.name}</p>
                      </div>

                   
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      >
                        Dashboard
                      </Link>
                      
                      <Link 
                        href="/dashboard/my-donation-requests" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      >
                        My Requests
                      </Link>

                      <hr className="border-gray-100 my-1" />

                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                         
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sidebar/Drawer Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block w-full text-lg py-2 ${
                isActive(link.href) ? "text-red-600 font-bold" : "text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="flex flex-col gap-2 pt-4">
              <Button as={Link} href="/login" variant="bordered" className="w-full border-gray-300">
                Login
              </Button>
              <Button as={Link} href="/register" className="w-full bg-red-600 text-white">
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}