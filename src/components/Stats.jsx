"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { PersonPlus, Heart, ShieldCheck, Flame } from "@gravity-ui/icons";

function Counter({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  
 
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, numericValue, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1], 
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest.toLocaleString());
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [numericValue, isInView]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

export default function StatsSection() {
  const stats = [
    {
      value: "2400",
      suffix: "+",
      label: "Registered Donors",
      description: "Active heroes ready to respond.",
      icon: <PersonPlus className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />,
    },
    {
      value: "870",
      suffix: "",
      label: "Lives Saved",
      description: "Urgent crisis request matches.",
      icon: <Heart className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />,
    },
    {
      value: "64",
      suffix: "",
      label: "Districts Covered",
      description: "Full coverage across Bangladesh.",
      icon: <ShieldCheck className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />,
    },
    {
      value: "24/7",
      suffix: "",
      label: "Emergency Support",
      description: "Round-the-clock rapid team.",
      icon: <Flame className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />,
      isStatic: true,
    },
  ];

  return (
    <section className="w-full bg-white text-gray-900 py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }} 
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-gradient-to-b from-gray-50/50 to-gray-50/10 border-2 border-gray-100 p-8 rounded-3xl hover:bg-white hover:border-red-500/80 hover:shadow-[0_20px_40px_rgba(239,68,68,0.07)] transition-all duration-500 flex flex-col justify-between min-h-[200px]"
            >
              
           
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/[0.02] group-hover:bg-red-500/[0.06] rounded-full blur-2xl transition-all duration-500 z-0" />
              
              <div className="relative z-10 space-y-6">
                
               
                <div className="p-3.5 bg-white border border-gray-200/80 shadow-sm rounded-2xl w-fit group-hover:bg-red-50 group-hover:border-red-200 transition-all duration-300">
                  {stat.icon}
                </div>
                
                <div className="space-y-1">
                  
                  <h3 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                    {stat.isStatic ? (
                      <span>{stat.value}</span>
                    ) : (
                      <Counter value={stat.value} suffix={stat.suffix} />
                    )}
                  </h3>
                  
                 
                  <h4 className="text-sm font-bold text-gray-800 tracking-wide pt-2">
                    {stat.label}
                  </h4>
                  
                
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    {stat.description}
                  </p>
                </div>

              </div>

              
              <span className="absolute top-6 right-8 text-6xl font-black text-gray-200/20 font-mono select-none pointer-events-none group-hover:text-red-500/5 transition-colors duration-500">
                0{idx + 1}
              </span>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}