

// "use client";

// import React from "react";
// import { Button } from "@heroui/react";
// import Link from "next/link";
// import { HeartFill, Magnifier } from "@gravity-ui/icons";
// import { motion } from "framer-motion";

// export default function Banner() {
  
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -30 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { type: "spring", stiffness: 100, damping: 15 },
//     },
//   };

//   return (
//     <section 
//       className="relative w-full min-h-[91vh] flex items-center bg-gray-950 bg-cover bg-center bg-no-repeat overflow-hidden"
//       style={{ 
//         backgroundImage: "url('/banner_img.jpg')"
//       }}
//     >
//       {/* Dark Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent z-10"></div>

//       {/* Main Content Area */}
//       <motion.div 
//         className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-20"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <div className="max-w-2xl text-white space-y-6">
          
       
//           <motion.div 
//             variants={itemVariants}
//             className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full w-fit backdrop-blur-sm"
//           >
//             {/* লাইভ ডট এনিমেশন */}
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
//             </span>
            
//             <span className="text-xs font-bold uppercase tracking-wider text-red-400">
//               24 Hours Emergency Network
//             </span>
//           </motion.div>

//           {/* Animated Heading */}
//           <motion.h1 
//             className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
//             variants={itemVariants}
//           >
//             Every drop<br />
//             <span className="text-white">saves a <span className="text-red-500">life </span> </span>
//           </motion.h1>

//           {/* Animated Paragraph */}
//           <motion.p 
//             className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl"
//             variants={itemVariants}
//           >
//             Your small act of kindness can give someone a second chance at life. Connect with local patients, schedule your blood donation, and become a hero in your community today.
//           </motion.p>

//           {/* Buttons Layout */}
//           <motion.div 
//             className="flex flex-wrap items-center gap-4 pt-4"
//             variants={itemVariants}
//           >
//             {/* Join as a Donor Button */}
//             <Button
//               as={Link}
//               href="/register"
//               className="px-8 py-6 bg-red-700 hover:bg-white text-white hover:text-red-700 font-semibold rounded-md shadow-lg transition-all h-auto text-base"
//             >
//               <HeartFill /> Join as a Donor
//             </Button>

//             {/* Search Donors Button wrapped in motion.div for Infinite Float Effect */}
//             <motion.div
//               animate={{
//                 y: [0, -10, 0],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity, 
//                 ease: "easeInOut", 
//               }}
//             >
//               <Button
//                 as={Link}
//                 href="/search"
//                 variant="bordered"
//                 className="px-8 py-6 border-2 border-red-600 hover:bg-red-600/50 text-white font-semibold rounded-md transition-all h-auto text-base"
//               >
//                 <Magnifier /> Search Donors
//               </Button>
//             </motion.div>
//           </motion.div>

//         </div>
//       </motion.div>
//     </section>
//   );
// }


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
    // ফিক্সড: min-h-[100dvh] দেওয়া হয়েছে যা মোবাইলের ব্রাউজার বারের জন্য পারফেক্ট। 
    // এছাড়া bg-gray-950 কে স্ট্রংলি লেয়ার্ড করা হয়েছে যেন ব্যাকগ্রাউন্ড ইমেজের নিচেও কালো টোন থাকে।
    <section 
      className="relative w-full min-h-[91dvh] flex items-center bg-gray-950 bg-cover bg-center bg-no-repeat overflow-hidden pb-16 sm:pb-0"
      style={{ 
        backgroundImage: "url('/banner_img.jpg')"
      }}
    >
      {/* ফিক্সড ওভারলে: এটিকে ডাইরেক্ট সলিড ব্ল্যাক থেকে ট্রান্সপারেন্ট গ্রেডিয়েন্ট টোনে নিচেও এক্সটেন্ড করা হয়েছে */}
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
            <span className="text-white">saves a <span className="text-red-500">Life </span> </span>
          </motion.h1>

          {/* Animated Paragraph */}
          <motion.p 
            className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed max-w-xl"
            variants={itemVariants}
          >
            Your small act of kindness can give someone a second chance at life. Connect with local patients, schedule your blood donation, and become a hero in your community today.
          </motion.p>

          {/* Buttons Layout */}
          <motion.div 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            variants={itemVariants}
          >
            {/* Join as a Donor Button */}
            <Button
              as={Link}
              href="/register"
              className="px-8 py-6 bg-red-700 hover:bg-white text-white hover:text-red-700 font-semibold rounded-md shadow-lg transition-all h-auto text-base"
            >
              <HeartFill /> Join as a Donor
            </Button>

            {/* Search Donors Button wrapped in motion.div for Infinite Float Effect */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity, 
                ease: "easeInOut", 
              }}
              className="flex"
            >
              <Button
                as={Link}
                href="/search"
                variant="bordered"
                className=" sm:w-auto px-8 py-6 border-2 border-red-600 hover:bg-red-600/50 text-white font-semibold rounded-md transition-all h-auto text-base"
              >
                <Magnifier /> Search Donors
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* 🖱️ রেস্পন্সিভ লাইভ মাউস স্ক্রোল আইকন */}
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