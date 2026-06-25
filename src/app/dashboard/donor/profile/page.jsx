// "use client";

// import React, { useState, useEffect } from "react";
// import { useSession, authClient } from "@/lib/auth-client";
// import { 
//   User, MapPin, Mail, Edit2, Check, Loader2, 
//   Calendar, Activity, CheckCircle2, Camera
// } from "lucide-react";
// import Image from "next/image";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Link from "next/link";

// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// export default function ProfilePage() {
//   const { data: session, refetch } = useSession();
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Geo Data States
//   const [districts, setDistricts] = useState([]);
//   const [allUpazilas, setAllUpazilas] = useState([]);
//   const [filteredUpazilas, setFilteredUpazilas] = useState([]);
//   const [geoLoading, setGeoLoading] = useState(true);

//   // Image Upload States
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "", district: "", upazila: "", bloodGroup: ""
//   });

//   // Fetch Geo Data
//   useEffect(() => {
//     const fetchGeoData = async () => {
//       try {
//         const [dRes, uRes] = await Promise.all([
//           fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json"),
//           fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json"),
//         ]);
//         const dJson = await dRes.json();
//         const uJson = await uRes.json();
//         setDistricts(dJson[2]?.data || dJson);
//         setAllUpazilas(uJson[2]?.data || uJson);
//       } catch (err) { console.error(err); } finally { setGeoLoading(false); }
//     };
//     fetchGeoData();
//   }, []);

//   // Sync Session Data
//   useEffect(() => {
//     if (session?.user && districts.length > 0) {
//       setFormData({
//         name: session.user.name || "",
//         district: session.user.district || "",
//         upazila: session.user.upazila || "",
//         bloodGroup: session.user.bloodGroup || "",
//       });

//       const found = districts.find(d => d.name === session.user.district);
//       if (found) {
//         const upazilas = allUpazilas.filter(u => u.district_id === found.id).map(u => u.name);
//         setFilteredUpazilas(upazilas);
//       }
//     }
//   }, [session, districts, allUpazilas]);

//   const handleDistrictChange = (e) => {
//     const selectedName = e.target.value;
//     setFormData(prev => ({ ...prev, district: selectedName, upazila: "" }));
//     const found = districts.find(d => d.name === selectedName);
//     if (found) {
//       setFilteredUpazilas(allUpazilas.filter(u => u.district_id === found.id).map(u => u.name));
//     } else {
//       setFilteredUpazilas([]);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);
//       setAvatarPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       let imageUrl = session?.user?.image;

     
//       if (avatarFile) {
//         const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
//         const imgFormData = new FormData();
//         imgFormData.append("image", avatarFile);

//         const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
//           method: "POST",
//           body: imgFormData,
//         });
//         const imgbbData = await imgbbRes.json();
        
//         if (!imgbbData.success) throw new Error("Image upload failed");
//         imageUrl = imgbbData.data.url; 
//       }

      
//       await authClient.updateUser({ 
//         name: formData.name,
//         image: imageUrl,
//         bloodGroup: formData.bloodGroup,
//         district: formData.district,
//         upazila: formData.upazila,
//       });

//       await refetch();
//       setIsEditing(false);
//       toast.success("Profile updated successfully!", { position: "top-right", autoClose: 3000 });
//       setAvatarFile(null); 
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update profile", { position: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!session) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-red-500 w-10 h-10"/></div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 lg:p-10 bg-gray-50/30 min-h-screen font-sans">
//       <ToastContainer />
//       <h1 className="text-3xl font-black text-gray-900 mb-6">My Profile</h1>

//       {/* Hero Profile Card */}
//       <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

//         <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          
//           {/* Avatar Section */}
//           <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex-shrink-0 group">
//             <Image 
//               src={avatarPreview || session.user.image || "/default.png"} 
//               width={112} height={112} 
//               alt="Avatar" 
//               className="object-cover w-full h-full" 
//             />
           
//             {isEditing && (
//               <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
//                 <Camera className="text-white mb-1" size={24} />
//                 <span className="text-white text-[10px] font-bold uppercase">Change</span>
//                 <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
//               </label>
//             )}
//           </div>
          
//           <div className="text-center md:text-left space-y-2">
//             <div className="flex items-center justify-center md:justify-start gap-3">
//               <h2 className="text-2xl font-black text-gray-900">{formData.name}</h2>
//               <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
//                 <CheckCircle2 size={12} /> Verified Donor
//               </span>
//             </div>
            
//             <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
//               <Mail size={16} /> {session.user.email}
//             </p>
            
//             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 font-medium mt-2">
//               <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-500"/> {formData.district || "N/A"}</span>
//               <span className="flex items-center gap-1.5"><Calendar size={16} className="text-red-500"/> Member Since: {new Date().getFullYear()}</span>
//             </div>
//           </div>
//         </div>

//         <div className="w-full md:w-auto flex justify-center mt-4 md:mt-0 relative z-10">
//           <button 
//             onClick={isEditing ? handleSave : () => setIsEditing(true)}
//             disabled={loading}
//             className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
//               isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20" : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
//             }`}
//           >
//             {loading ? <Loader2 className="animate-spin w-5 h-5" /> : isEditing ? <><Check size={18}/> Save Changes</> : <><Edit2 size={18}/> Edit Profile</>}
//           </button>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Left Column: Personal Details */}
//         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
//           <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
//             <User className="text-red-500" size={20}/> Personal Details
//           </h3>
          
//           <div className="space-y-5">
//             <DataField label="Blood Group" isEditing={isEditing}>
//               <select disabled={!isEditing} value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className={inputClass(isEditing, true)}>
//                 <option value="">Select Blood Group</option>
//                 {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
//               </select>
//             </DataField>

//             <DataField label="Full Name" isEditing={isEditing}>
//               <input readOnly={!isEditing} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass(isEditing)} />
//             </DataField>

//             <DataField label="Email Address" isEditing={false}>
//               <input readOnly value={session.user.email} className={inputClass(false, false, true)} />
//             </DataField>
//           </div>
//         </div>

//         {/* Middle Column: Location Details */}
//         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
//           <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
//             <MapPin className="text-red-500" size={20}/> Location Details
//           </h3>

//           <div className="space-y-5">
//             <DataField label="District" isEditing={isEditing}>
//               <select disabled={!isEditing || geoLoading} value={formData.district} onChange={handleDistrictChange} className={inputClass(isEditing, true)}>
//                 <option value="">Select District</option>
//                 {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
//               </select>
//             </DataField>

//             <DataField label="Upazila" isEditing={isEditing}>
//               <select disabled={!isEditing || !formData.district} value={formData.upazila} onChange={(e) => setFormData({...formData, upazila: e.target.value})} className={inputClass(isEditing, true)}>
//                 <option value="">Select Upazila</option>
//                 {filteredUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
//               </select>
//             </DataField>
//           </div>
//         </div>

//         {/* Right Column: Reminder Card */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-3xl shadow-lg shadow-red-600/20 text-white relative overflow-hidden">
//              <div className="absolute -right-4 -top-4 opacity-10"><Activity size={120}/></div>
//              <h3 className="text-xl font-black mb-1 relative z-10">Ready to save lives?</h3>
//              <p className="text-red-100 text-sm font-medium mb-6 relative z-10 leading-relaxed">Keep your profile updated so seekers can reach you quickly when there&apos;s an emergency.</p>
//              <Link href="/donation-requests">
            
//              <button className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl text-sm relative z-10 hover:bg-gray-50 transition-colors shadow-sm">
//                 View Requests
//              </button> </Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// // Helpers for clean UI
// function DataField({ label, children, isEditing }) {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
//       <label className="text-sm font-bold text-gray-500 w-1/3 shrink-0">{label}</label>
//       <div className="w-full sm:w-2/3">
//         {children}
//       </div>
//     </div>
//   );
// }

// function inputClass(isEditing, isSelect = false, isFixed = false) {
//   const base = "w-full font-bold text-gray-900 transition-all text-sm sm:text-right md:text-left focus:outline-none rounded-xl px-3 py-2 -mx-3";
//   if (isFixed) return `${base} bg-transparent text-gray-400 cursor-not-allowed`;
//   if (isEditing) return `${base} bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 ${isSelect ? "appearance-auto" : ""}`;
//   return `${base} bg-transparent border-transparent ${isSelect ? "appearance-none cursor-default" : ""}`;
// }


"use client";

import React, { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { 
  User, MapPin, Mail, Edit2, Check, Loader2, 
  Calendar, Activity, CheckCircle2, Camera
} from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ProfilePage() {
  const { data: session, refetch } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Geo Data States
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [geoLoading, setGeoLoading] = useState(true);

  // Image Upload States
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "", district: "", upazila: "", bloodGroup: ""
  });

  // Fetch Geo Data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const [dRes, uRes] = await Promise.all([
          fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/districts/districts.json"),
          fetch("https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master/upazilas/upazilas.json"),
        ]);
        const dJson = await dRes.json();
        const uJson = await uRes.json();
        setDistricts(dJson[2]?.data || dJson);
        setAllUpazilas(uJson[2]?.data || uJson);
      } catch (err) { console.error(err); } finally { setGeoLoading(false); }
    };
    fetchGeoData();
  }, []);

  // Sync Session Data
  useEffect(() => {
    if (session?.user && districts.length > 0) {
      setFormData({
        name: session.user.name || "",
        district: session.user.district || "",
        upazila: session.user.upazila || "",
        bloodGroup: session.user.bloodGroup || "",
      });

      const found = districts.find(d => d.name === session.user.district);
      if (found) {
        const upazilas = allUpazilas.filter(u => u.district_id === found.id).map(u => u.name);
        setFilteredUpazilas(upazilas);
      }
    }
  }, [session, districts, allUpazilas]);

  const handleDistrictChange = (e) => {
    const selectedName = e.target.value;
    setFormData(prev => ({ ...prev, district: selectedName, upazila: "" }));
    const found = districts.find(d => d.name === selectedName);
    if (found) {
      setFilteredUpazilas(allUpazilas.filter(u => u.district_id === found.id).map(u => u.name));
    } else {
      setFilteredUpazilas([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = session?.user?.image;

      if (avatarFile) {
        const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;
        const imgFormData = new FormData();
        imgFormData.append("image", avatarFile);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: imgFormData,
        });
        const imgbbData = await imgbbRes.json();
        
        if (!imgbbData.success) throw new Error("Image upload failed");
        imageUrl = imgbbData.data.url; 
      }

      await authClient.updateUser({ 
        name: formData.name,
        image: imageUrl,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      });

      await refetch();
      setIsEditing(false);
      toast.success("Profile updated successfully!", { position: "top-right", autoClose: 3000 });
      setAvatarFile(null); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-red-500 w-10 h-10"/></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 bg-gray-50/30 min-h-screen font-sans overflow-hidden w-full">
      <ToastContainer />
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">My Profile</h1>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 relative z-10 w-full">
          
          {/* Avatar Section */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex-shrink-0 group mx-auto md:mx-0">
            <Image 
              src={avatarPreview || session.user.image || "/default.png"} 
              width={112} height={112} 
              alt="Avatar" 
              className="object-cover w-full h-full" 
            />
            
            {isEditing && (
              <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="text-white mb-1 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-white text-[10px] font-bold uppercase">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
          
          <div className="text-center md:text-left space-y-2 flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
              {/* <h2 className="text-xl sm:text-2xl font-black text-gray-900 truncate max-w-full">{formData.name}</h2> */}
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 break-words leading-tight">
  {formData.name}
</h2>
              <span className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 size={12} /> Verified Donor
              </span>
            </div>
            
            <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 text-sm sm:text-base truncate">
              <Mail size={16} className="shrink-0" /> {session.user.email}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 font-medium mt-2">
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-500 shrink-0"/> <span className="truncate">{formData.district || "N/A"}</span></span>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-red-500 shrink-0"/> Member Since: {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-center mt-2 md:mt-0 relative z-10 shrink-0">
      
<button 
  onClick={isEditing ? handleSave : () => setIsEditing(true)}
  disabled={loading}
  className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap ${
    isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
  }`}
>
  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 
   isEditing ? <><Check size={16}/> Save</> : <><Edit2 size={16}/> Edit</>}
</button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Personal Details */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 w-full">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <User className="text-red-500" size={20}/> Personal Details
          </h3>
          
          <div className="space-y-4 sm:space-y-5">
            <DataField label="Blood Group">
              <select disabled={!isEditing} value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className={inputClass(isEditing, true)}>
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </DataField>

            <DataField label="Full Name">
              <input readOnly={!isEditing} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass(isEditing)} />
            </DataField>

            <DataField label="Email Address">
              <input readOnly value={session.user.email} className={inputClass(false, false, true)} />
            </DataField>
          </div>
        </div>

        {/* Middle Column: Location Details */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 w-full">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
            <MapPin className="text-red-500" size={20}/> Location Details
          </h3>

          <div className="space-y-4 sm:space-y-5">
            <DataField label="District">
              <select disabled={!isEditing || geoLoading} value={formData.district} onChange={handleDistrictChange} className={inputClass(isEditing, true)}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </DataField>

            <DataField label="Upazila">
              <select disabled={!isEditing || !formData.district} value={formData.upazila} onChange={(e) => setFormData({...formData, upazila: e.target.value})} className={inputClass(isEditing, true)}>
                <option value="">Select Upazila</option>
                {filteredUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </DataField>
          </div>
        </div>

        {/* Right Column: Reminder Card */}
        <div className="space-y-6 w-full">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 sm:p-8 rounded-3xl shadow-lg shadow-red-600/20 text-white relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-10"><Activity size={120}/></div>
             <h3 className="text-lg sm:text-xl font-black mb-2 relative z-10">Ready to save lives?</h3>
             <p className="text-red-100 text-xs sm:text-sm font-medium mb-6 relative z-10 leading-relaxed">Keep your profile updated so seekers can reach you quickly when there&apos;s an emergency.</p>
             <Link href="/donation-requests">
               <button className="w-full sm:w-auto bg-white text-red-600 font-bold px-6 py-3 rounded-xl text-sm relative z-10 hover:bg-gray-50 transition-colors shadow-sm">
                 View Requests
               </button> 
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// 💡 Helpers for clean UI (Responsiveness Fixed)
function DataField({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0 w-full">
      <label className="text-xs sm:text-sm font-bold text-gray-500 w-full sm:w-1/3 shrink-0">{label}</label>
      <div className="w-full sm:w-2/3 min-w-0">
        {children}
      </div>
    </div>
  );
}

// 💡 Removed negative margins (-mx-3) that caused horizontal overflow
function inputClass(isEditing, isSelect = false, isFixed = false) {
  const base = "w-full font-bold transition-all text-sm focus:outline-none rounded-xl py-2 truncate text-left";
  if (isFixed) return `${base} bg-transparent text-gray-400 cursor-not-allowed px-0`;
  if (isEditing) return `${base} text-gray-900 bg-gray-50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 px-3 ${isSelect ? "appearance-auto" : ""}`;
  return `${base} bg-transparent text-gray-900 border-transparent px-0 ${isSelect ? "appearance-none cursor-default" : ""}`;
}