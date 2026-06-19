


"use client";

import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { HeartFill, Magnifier } from "@gravity-ui/icons";
import { motion } from "framer-motion";

export default function Banner() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section 
      className="relative w-full min-h-[92dvh] flex items-center bg-gray-950 bg-cover bg-center bg-no-repeat overflow-hidden pb-16 sm:pb-0"
      style={{ 
        backgroundImage: "url('/banner_img.jpg')"
      }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-gray-950/95 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/70 sm:to-transparent z-10"></div>

      {/* Main Content Area */}
      <motion.div 
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl text-white space-y-6">
          
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full w-fit backdrop-blur-sm"
          >
            {/* লাইভ ডট এনিমেশন */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              24 Hours Emergency Network
            </span>
          </motion.div>

          {/* Animated Heading */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
            variants={itemVariants}
          >
            Every drop<br />
            <span className="text-white">saves a <span className="text-red-500">life </span> </span>
          </motion.h1>

      
          <motion.p 
            className="text-sm sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl block"
            variants={itemVariants}
          >
            <span className="inline sm:hidden">
              Your small act of kindness can give someone a second chance at life. Become a hero today.
            </span>
            <span className="hidden sm:inline">
              Your small act of kindness can give someone a second chance at life. Connect with local patients, schedule your blood donation, and become a hero in your community today.
            </span>
          </motion.p>

         
          <motion.div 
            className="flex flex-row flex-wrap items-center gap-3 pt-4"
            variants={itemVariants}
          >
            {/* Join as a Donor Button */}
            <Button
              as={Link}
              href="/register"
              className="px-5 sm:px-8 py-5 sm:py-6 bg-red-700 hover:bg-white text-white hover:text-red-700 font-semibold rounded-md shadow-lg transition-all h-auto text-sm sm:text-base w-fit"
            >
              <HeartFill className="scale-90 sm:scale-100" /> Join as Donor
            </Button>

            {/* Search Donors Button */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity, 
                ease: "easeInOut", 
              }}
              className="flex w-fit"
            >
              <Button
                as={Link}
                href="/search"
                variant="bordered"
                className="px-5 sm:px-8 py-5 sm:py-6 border-2 border-red-600 hover:bg-red-600/50 text-white font-semibold rounded-md transition-all h-auto text-sm sm:text-base w-fit"
              >
                <Magnifier className="scale-90 sm:scale-100" /> Search Donors
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none select-none">
        <div className="w-[20px] h-[34px] sm:w-[24px] sm:h-[40px] border-2 border-white/30 rounded-full flex justify-center p-1 backdrop-blur-sm">
          <motion.div 
            animate={{
              y: [0, 10, 0],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 bg-red-500 rounded-full"
          />
        </div>
        <span className="text-[9px] uppercase font-bold tracking-widest text-white/30 font-sans scale-90 sm:scale-100">
          Scroll
        </span>
      </div>

    </section>
  );
}