"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Rocket, Heart, Persons } from "@gravity-ui/icons";

export default function Featured() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };
// someone&apos;s




  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  const features = [
    {
      title: "Secure & Private",
      description: "Your personal and medical details are fully encrypted and only shared with verified medical contacts.",
      
      icon: <ShieldCheck className="h-6 w-6 text-red-500 transition-colors duration-300 group-hover:text-red-600" />,
    },
    {
      title: "Real-time Alerts",
      description: "Get instant notifications on your phone or dashboard the exact moment a matching recipient requests blood.",
      icon: <Rocket className="h-6 w-6 text-red-500 transition-colors duration-300 group-hover:text-red-600" />,
    },
    {
      title: "Direct Connection",
      description: "No middlemen or complex paperwork. Connect directly with the recipient or hospital coordinator in seconds.",
      icon: <Persons className="h-6 w-6 text-red-500 transition-colors duration-300 group-hover:text-red-600" />,
    },
    {
      title: "Impact Tracker",
      description: "Track your successful blood donations, see how many lives you saved, and manage your next donation windows.",
      icon: <Heart className="h-6 w-6 text-red-500 transition-colors duration-300 group-hover:text-red-600" />,
    },
  ];

  return (
    <section className="w-full bg-white text-gray-900 py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Grid: Left Info & Right Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Left Column - Heading & Content */}
          <div className="space-y-5 lg:pr-6">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
              OUR FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-gray-900">
              Why Choose Our Blood Platform?
            </h2>
            <p className="text-base text-gray-600 leading-relaxed font-normal">
              We bridges the gap between donors and patients with an intuitive, super-fast, and deeply safe digital network designed to save lives instantly.
            </p>
          </div>

          {/* Right Column - 4 Grid Feature Cards */}
          <motion.div 
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
               
                className="group bg-gray-50/50 border-2 border-gray-200/80 p-6 rounded-2xl hover:bg-red-55/30 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
              >
               
                <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl w-fit mb-5 group-hover:bg-red-100/70 group-hover:border-red-400/50 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}