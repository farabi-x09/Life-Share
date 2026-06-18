
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
//       className="relative w-full min-h-[80vh] flex items-center bg-gray-950 bg-cover bg-center bg-no-repeat overflow-hidden"
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
//               className="px-8 py-6 bg-red-600 hover:bg-white text-white hover:text-red-600 font-semibold rounded-md shadow-lg transition-all h-auto text-base"
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
    <section 
      className="relative w-full min-h-[85vh] flex items-center bg-gray-950 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        backgroundImage: "url('/banner_img.jpg')"
      }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent z-10"></div>

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

          {/* Animated Paragraph */}
          <motion.p 
            className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl"
            variants={itemVariants}
          >
            Your small act of kindness can give someone a second chance at life. Connect with local patients, schedule your blood donation, and become a hero in your community today.
          </motion.p>

          {/* Buttons Layout */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 pt-4"
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
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity, 
                ease: "easeInOut", 
              }}
            >
              <Button
                as={Link}
                href="/search"
                variant="bordered"
                className="px-8 py-6 border-2 border-red-600 hover:bg-red-600/50 text-white font-semibold rounded-md transition-all h-auto text-base"
              >
                <Magnifier /> Search Donors
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}