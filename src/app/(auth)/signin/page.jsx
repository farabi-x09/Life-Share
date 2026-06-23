"use client";

import { useState, Suspense } from "react"; 
import { ArrowRight, Loader2, Eye, EyeOff, Lock, Mail, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";

function SignInForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (response?.error) {
        let msg = response.error.message || "Invalid email or password.";
        setErrorMsg(msg);
        toast.error(msg, { position: "top-right", autoClose: 5000, theme: "light" });
        setIsSubmitting(false);
        return;
      }

      toast.success("Welcome back!", { position: "top-right", autoClose: 1500 });

      setTimeout(() => {
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
      
      {/* Left Side: Image & Text */}
      <div className="w-full md:w-1/2 h-64 md:h-auto bg-red-600 relative overflow-hidden flex flex-col justify-end p-8">
        <Image 
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop"
          alt="Blood Donation"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6 fill-white" />
            <span className="text-xl font-black">LifeShare</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Find Donors.<br />Save Lives.</h1>
          <p className="text-sm text-red-100 font-medium">
            Join our network to connect with voluntary blood donors instantly.
          </p>
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500">Log in to manage your donation requests.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              required placeholder="Email Address"
              className="w-full p-3 pl-10 border-2 border-gray-100 rounded-xl focus:border-red-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
              required placeholder="Password"
              className="w-full p-3 pl-10 pr-10 border-2 border-gray-100 rounded-xl focus:border-red-500 outline-none transition-all"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full p-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New to LifeShare? <Link href="/register" className="text-red-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

// মেইন কম্পোনেন্ট যা এক্সপোর্ট হবে এবং Suspense হ্যান্ডেল করবে
export default function SignIn() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer /> 
      
      <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
        <SignInForm />
      </Suspense>
    </section>
  );
}