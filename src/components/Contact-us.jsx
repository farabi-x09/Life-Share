// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@heroui/react";
// import { Envelope, Pin, ArrowRight } from "@gravity-ui/icons";

// export default function ContactUs() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(false);

//     try {
//       // ফিক্সড: এখানে শুধু আপনার ইউনিক আইডি টোকেনটি থাকবে
//       const FORMSPREE_ID = "xdavreba"; 
      
//       const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify({
//           Name: formData.fullName,
//           Email: formData.email,
//           Subject: formData.subject,
//           Message: formData.message,
//         }),
//       });

//       if (response.ok) {
//         setSubmitted(true);
//         setFormData({ fullName: "", email: "", subject: "", message: "" });
//         setTimeout(() => setSubmitted(false), 5000);
//       } else {
//         setError(true);
//       }
//     } catch (err) {
//       setError(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
//   };

//   const contactDetails = [
//     {
//       icon: <Envelope className="h-5 w-5 text-red-500" />,
//       title: "Emergency Call",
//       value: "+880 1570203520",
//       subText: "Available 24/7 for blood requests",
//     },
//     {
//       icon: <Envelope className="h-5 w-5 text-red-500" />,
//       title: "Email Support",
//       value: "farabiahmed2005@gmail.com",
//       subText: "Response within 1-2 hours",
//     },
//     {
//       icon: <Pin className="h-5 w-5 text-red-500" />,
//       title: "Main Office",
//       value: "Dhaka, Bangladesh",
//       subText: "Central Blood Network Center",
//     },
//   ];

//   return (
//     <section className="w-full bg-white text-gray-900 py-24 border-t border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
//           {/* Left Column: Contact Info */}
//           <div className="lg:col-span-2 space-y-8">
//             <div className="space-y-3">
//               <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
//                 CONTACT US
//               </span>
//               <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-gray-900">
//                 Get in Touch with Our Network
//               </h2>
//               <p className="text-base text-gray-600 font-normal leading-relaxed">
//                 Have questions or need emergency blood support? Reach out to us, and our team will assist you instantly.
//               </p>
//             </div>

//             <div className="space-y-4">
//               {contactDetails.map((info, idx) => (
//                 <div key={idx} className="flex gap-4 p-4 bg-gray-50/50 border border-gray-200/60 rounded-xl hover:border-red-500/30 hover:shadow-md transition-all duration-300">
//                   <div className="p-3 bg-red-50 border border-red-100 rounded-lg h-fit">
//                     {info.icon}
//                   </div>
//                   <div>
//                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{info.title}</h4>
//                     <p className="text-base font-bold text-gray-900 mt-0.5">{info.value}</p>
//                     <p className="text-xs text-gray-500 mt-0.5 font-normal">{info.subText}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Column: Contact Form */}
//           <motion.div 
//             className="lg:col-span-3 bg-gray-50/30 border-2 border-gray-200/80 p-8 sm:p-10 rounded-2xl relative overflow-hidden shadow-sm"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-100px" }}
//           >
//             {/* সাকসেস মেসেজ */}
//             {submitted && (
//               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-xl text-center">
//                 🎉 Thank you! Your email has been sent successfully straight to our inbox.
//               </motion.div>
//             )}

//             {/* এরর মেসেজ */}
//             {error && (
//               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-semibold rounded-xl text-center">
//                 ❌ Something went wrong! Please check your Formspree ID or try again.
//               </motion.div>
//             )}

//             <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <motion.div variants={itemVariants} className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Full Name</label>
//                   <input 
//                     type="text" 
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                     placeholder="John Doe"
//                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm"
//                   />
//                 </motion.div>

//                 <motion.div variants={itemVariants} className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Email Address</label>
//                   <input 
//                     type="email" 
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="john@example.com"
//                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm"
//                   />
//                 </motion.div>
//               </div>

//               <motion.div variants={itemVariants} className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">Subject</label>
//                 <input 
//                   type="text" 
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   required
//                   placeholder="Blood emergency request / Inquiry"
//                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm"
//                 />
//               </motion.div>

//               <motion.div variants={itemVariants} className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">Message</label>
//                 <textarea 
//                   rows="4" 
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   required
//                   placeholder="Type your message here..."
//                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm resize-none"
//                 ></textarea>
//               </motion.div>

//               <motion.div variants={itemVariants} className="pt-2">
//                 <Button
//                   type="submit"
//                   isLoading={isSubmitting}
//                   className="w-full sm:w-auto px-8 py-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all h-auto text-base flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? "Sending..." : "Send Message"} <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </motion.div>
//             </form>
//           </motion.div>

//         </div>

//       </div>
//     </section>
//   );
// }

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Envelope, Pin, ArrowRight } from "@gravity-ui/icons";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    try {
      const FORMSPREE_ID = "xdavreba"; 
      
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: formData.fullName,
          Email: formData.email,
          Subject: formData.subject,
          Message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ fullName: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  const contactDetails = [
    {
      icon: <Envelope className="h-5 w-5 text-red-500" />,
      title: "Emergency Call",
      value: "+880 1570203520",
      subText: "Available 24/7 for blood requests",
    },
    {
      icon: <Envelope className="h-5 w-5 text-red-500" />,
      title: "Email Support",
      value: "farabiahmed2005@gmail.com",
      subText: "Response within 1-2 hours",
    },
    {
      icon: <Pin className="h-5 w-5 text-red-500" />,
      title: "Main Office",
      value: "Dhaka, Bangladesh",
      subText: "Central Blood Network Center",
    },
  ];

  return (
    <section className="w-full bg-white text-gray-900 py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
                CONTACT US
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-gray-900">
                Get in Touch with Our Network
              </h2>
              <p className="text-base text-gray-600 font-normal leading-relaxed">
                Have questions or need emergency blood support? Reach out to us, and our team will assist you instantly.
              </p>
            </div>

            <div className="space-y-4">
              {contactDetails.map((info, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50/50 border border-gray-200/60 rounded-xl hover:border-red-500/30 hover:shadow-md transition-all duration-300">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg h-fit">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{info.title}</h4>
                    <p className="text-base font-bold text-gray-900 mt-0.5">{info.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-normal">{info.subText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            className="lg:col-span-3 bg-gray-50/30 border-2 border-gray-200/80 p-8 sm:p-10 rounded-2xl relative overflow-hidden shadow-sm"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* সাকসেস মেসেজ */}
            {submitted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-xl text-center">
                🎉 Thank you! Your email has been sent successfully straight to our inbox.
              </motion.div>
            )}

            {/* এরর মেসেজ */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-semibold rounded-xl text-center">
                ❌ Something went wrong! Please check your Formspree ID or try again.
              </motion.div>
            )}

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Blood emergency request / Inquiry"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-normal text-sm resize-none"
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                {/* নিখুঁত ব্লিংকিং এবং স্মুথ পালস ইফেক্ট বাটন কন্টেইনার */}
                <motion.div
                  animate={!isSubmitting ? {
                    opacity: [1, 0.5, 1], // টেক্সট এবং বাটন একসাথে স্মুথলি ব্লিংক করবে
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full sm:w-fit rounded-xl"
                >
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto px-8 py-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 active:scale-98 transition-all h-auto text-base flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}