"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Fixed Gravity UI imports: X changed to Xmark
import { Envelope, Compass, Xmark, LogoFacebook, LogoGithub, LogoLinkedin } from "@gravity-ui/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#111827] text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Grid Layer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
              <Image src="/logo.png" alt="Life Share Logo" width={40} height={40} className="rounded-full" />
              <span className="tracking-tight">Life <span className="text-red-500">Share</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              A modern and secure blood donation platform connecting donors and recipients directly to help save lives efficiently.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/donation-requests" className="hover:text-red-500 transition-colors">Donation Requests</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-red-500 transition-colors">Search Donors</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/funding" className="hover:text-red-500 transition-colors">Funding Support</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-3 text-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Contact Us</h3>
            <div className="flex items-center gap-2.5 text-gray-400">
              <span className="text-red-500 font-bold text-xs border border-red-500/30 rounded scale-90 select-none">TEL</span>
              <span>+880 15070203520</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-400">
              <Envelope className="h-4 w-4 text-red-500 shrink-0" />
              <span className="truncate">support@lifeshare.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-400">
              <Compass className="h-4 w-4 text-red-500 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

        </div>

        {/* Bottom Layer: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Life Share. All rights reserved.
          </p>

          {/* Social Icons Layout */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/farabi76o" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-all"
            >
              <LogoFacebook className="h-4 w-4" />
            </a>
            
            {/* Using Xmark to perfectly represent the rebranded X symbol */}
            <a 
              href="https://www.linkedin.com/in/farabi-ahmed13/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-all"
            >
              <LogoLinkedin className="h-4 w-4" />
            </a>

            <a 
              href="https://github.com/farabi-x09" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-all"
            >
              <LogoGithub className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}