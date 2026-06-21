"use client";

import { useState, useEffect } from "react";
import { UserPlus, ArrowRight, Loader2, Eye, EyeOff, UploadCloud } from "lucide-react"; 
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [districts, setDistricts]               = useState([]);
  const [allUpazilas, setAllUpazilas]           = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [geoLoading, setGeoLoading]             = useState(true);

  const [avatarFile, setAvatarFile]     = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg,  setErrorMsg]        = useState("");
  const [successMsg, setSuccessMsg]     = useState("");

  const capitalize = (str) =>
    str
      ? str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
      : "";

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const [dRes, uRes] = await Promise.all([
          fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json"),
          fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json"),
        ]);

        const dJson = await dRes.json();
        const uJson = await uRes.json();

        const districtRows = dJson[2].data;  
        const upazilaRows  = uJson[2].data;  

        setDistricts([...districtRows].sort((a, b) => a.name.localeCompare(b.name)));
        setAllUpazilas(upazilaRows);
      } catch (err) {
        console.error("Geo data fetch error:", err);
      } finally {
        setGeoLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    setFormData((prev) => ({ ...prev, district: selectedName, upazila: "" }));

    const found = districts.find((d) => d.name === selectedName);
    if (found) {
      const filtered = allUpazilas
        .filter((u) => u.district_id === found.id) 
        .map((u) => u.name)
        .sort((a, b) => a.localeCompare(b));
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const password = formData.password;
    const hasUppercase = /[A-Z]/.test(password); 
    const hasNumber = /[0-9]/.test(password);    

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long!");
      setIsSubmitting(false);
      return;
    }
    if (!hasUppercase) {
      setErrorMsg("Password must contain at least one uppercase letter (A-Z)!");
      setIsSubmitting(false);
      return;
    }
    if (!hasNumber) {
      setErrorMsg("Password must contain at least one number (0-9)!");
      setIsSubmitting(false);
      return;
    }

    if (password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }
    if (!avatarFile) {
      setErrorMsg("Please upload your avatar image.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.bloodGroup) {
      setErrorMsg("Please select your blood group.");
      setIsSubmitting(false);
      return;
    }

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
      const imgFormData = new FormData();
      imgFormData.append("image", avatarFile);

      const imgbbRes  = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: imgFormData,
      });
      const imgbbData = await imgbbRes.json();
      if (!imgbbData.success) throw new Error("ImgBB upload failed");

     
      const response = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: imgbbData.data.url, 
        bloodGroup: formData.bloodGroup,
        district: capitalize(formData.district),
        upazila: capitalize(formData.upazila),
        role: "donor",
        status: "active"
      });

      
      if (response?.error) {
        let msg = response.error.message || "Registration failed.";
        
      
        if (response.error.code === "USER_ALREADY_EXISTS" || msg.toLowerCase().includes("exist")) {
          msg = "This email is already registered! Please use another email or login.";
        }
        
        setErrorMsg(msg);
        toast.error(msg, { position: "top-right", autoClose: 5000, theme: "light" });
        setIsSubmitting(false);
        return; 
      }

     
      console.log("Registration Data:", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: imgbbData.data.url, 
        bloodGroup: formData.bloodGroup,
        district: capitalize(formData.district),
        upazila: capitalize(formData.upazila),
        role: "donor",
        status: "active"
      });

      toast.success("Registration Successful! Welcome to LifeShare.", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });

      setSuccessMsg("Registration Successful! Welcome to LifeShare.");
      setFormData({ name:"", email:"", bloodGroup:"", district:"", upazila:"", password:"", confirmPassword:"" });
      setAvatarFile(null);
      setAvatarPreview(null);
      setFilteredUpazilas([]);
      e.target.reset();

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <section className="min-h-[100dvh] w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <ToastContainer />

      {/* Decorative Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-50/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-50/[0.04] blur-3xl pointer-events-none" />

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white border-2 border-gray-100 rounded-3xl p-5 sm:p-10 shadow-xl shadow-gray-100/50 relative z-10 box-border">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 mb-3.5 shadow-sm">
            <UserPlus className="w-6 h-6 text-red-500" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-1.5">
            Create Donor Account
          </h2>
          <p className="text-sm text-gray-400 font-normal max-w-sm mx-auto leading-relaxed px-2">
            Be the reason for someone&apos;s heartbeat. Register as a proud donor, share the gift of life, and stay ready for the next call.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3 px-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl text-center">
            ❌ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3 px-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl text-center">
            🎉 {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange} 
                required 
                placeholder="John Doe"
                className="w-full p-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-red-500 focus:bg-white transition-all duration-200 box-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
                required 
                placeholder="john@example.com"
                className="w-full p-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-red-500 focus:bg-white transition-all duration-200 box-border"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Upload Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex-shrink-0 bg-red-50 border-2 border-dashed border-red-100 overflow-hidden flex items-center justify-center relative">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="preview" className="w-full h-full object-cover" width={56} height={56} />
                ) : (
                  <UserPlus className="w-5 h-5 text-red-400" />
                )}
              </div>
              
              <label className="w-10 flex-1 flex items-center justify-between p-3 bg-gray-50/50 border-2 border-dashed border-red-200 rounded-xl cursor-pointer hover:border-red-400 hover:bg-white transition-all group box-border">
                <div className="flex items-center gap-2.5 truncate">
                  <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 transition-colors truncate">
                    {avatarFile ? avatarFile.name : "Choose an avatar image"}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase bg-gray-200/60 group-hover:bg-red-600 group-hover:text-white px-2.5 py-1 rounded-md text-gray-600 transition-all ml-2 flex-shrink-0">
                  Browse
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Blood Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Blood Group</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {bloodGroups.map((group) => {
                const isSelected = formData.bloodGroup === group;
                return (
                  <button 
                    key={group} 
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, bloodGroup: group }))}
                    className={`p-2.5 text-sm font-bold rounded-xl transition-all duration-150 border-2 truncate w-full ${
                      isSelected 
                        ? "border-red-600 bg-red-600 text-white shadow-md shadow-red-500/25" 
                        : "border-gray-200 bg-gray-50/50 text-gray-700 hover:border-red-500/50 hover:bg-white"
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>

          {/* District & Upazila Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">District</label>
              <select 
                name="district" 
                value={formData.district}
                onChange={handleDistrictChange} 
                required
                disabled={geoLoading}
                className="w-full p-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-wait box-border"
              >
                <option value="">{geoLoading ? "Loading districts…" : "Select District"}</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Upazila</label>
              <select 
                name="upazila" 
                value={formData.upazila}
                onChange={handleChange} 
                required
                disabled={!formData.district}
                className="w-full p-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed box-border"
              >
                <option value="">
                  {!formData.district ? "Select District First" : "Select Upazila"}
                </option>
                {filteredUpazilas.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-red-500 focus:bg-white transition-all duration-200 box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Confirm Password</label>
              <div className="relative w-full">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 bg-gray-50/50 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-red-500 focus:bg-white transition-all duration-200 box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1.5">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full p-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.99] transition-all duration-200 disabled:bg-red-400 disabled:cursor-not-allowed box-border"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register Account 
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm font-medium text-gray-500 mt-1">
            Already registered?{" "}
            <Link href="/signin" className="text-red-600 font-bold hover:underline transition-all">
              Login here
            </Link>
          </p>

        </form>
      </div>
    </section>
  );
}