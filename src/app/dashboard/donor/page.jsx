

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  Eye, Edit, Trash2, CheckCircle, XCircle, Syringe,
  MapPin, CalendarDays, Droplet, Users, DollarSign, Droplets,
  TrendingUp, Activity,
} from "lucide-react";
import Loading from "../loading";
import { getSomeDonation } from "@/lib/api/donations";
import { toast } from "react-toastify";
import { deleteDonationRequest, updateDonationStatus } from "@/lib/actions/donation_requests";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ─── Chart colour palette (blood-donation theme) ───────────────────────────
const RED   = "#dc2626";
const ROSE  = "#fb7185";
const SLATE = "#0f172a";
const BLUE  = "#3b82f6";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";
const GRAY  = "#e5e7eb";

// ─── Mock monthly data (replace with real API data if available) ────────────
const MONTHLY = [
  { month: "Jan", requests: 12, fulfilled: 9,  donors: 8  },
  { month: "Feb", requests: 19, fulfilled: 14, donors: 13 },
  { month: "Mar", requests: 15, fulfilled: 11, donors: 10 },
  { month: "Apr", requests: 27, fulfilled: 21, donors: 18 },
  { month: "May", requests: 22, fulfilled: 17, donors: 15 },
  { month: "Jun", requests: 34, fulfilled: 28, donors: 24 },
];

const BLOOD_GROUPS = [
  { name: "A+",  value: 32 },
  { name: "B+",  value: 28 },
  { name: "O+",  value: 20 },
  { name: "AB+", value: 10 },
  { name: "A-",  value: 5  },
  { name: "B-",  value: 3  },
  { name: "O-",  value: 1.5},
  { name: "AB-", value: 0.5},
];
const PIE_COLORS = [RED, ROSE, SLATE, BLUE, GREEN, AMBER, "#8b5cf6", "#06b6d4"];

const RADIAL_DATA = [
  { name: "Fulfilled",  value: 74, fill: GREEN },
  { name: "In-Progress",value: 18, fill: BLUE  },
  { name: "Pending",    value: 8,  fill: AMBER  },
];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-3 text-xs">
      <p className="font-black text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: <span className="font-black">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Section header ──────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
      <Icon size={18} className="text-red-500" />
    </div>
    <div>
      <h3 className="font-black text-gray-900 leading-none">{title}</h3>
      {subtitle && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
export default function DashboardHome() {
  const { data: session } = useSession();
  const [requests, setRequests]         = useState([]);
  const [stats, setStats]               = useState({ totalUsers: 0, totalFunding: 0, totalRequests: 0 });
  const [loading, setLoading]           = useState(true);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const role = session?.user?.role;
        if (role === "admin" || role === "volunteer") {
          const [usersRes, fundsRes, reqRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`).then(r => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/funds`).then(r => r.json()),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/donation_requests`).then(r => r.json()),
          ]);
          const totalFunding = fundsRes.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
          setStats({ totalUsers: usersRes.length, totalFunding, totalRequests: reqRes.length });
        } else {
          const response = await getSomeDonation(session?.user?.email);
          setRequests(Array.isArray(response) ? response : response?.data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.email) fetchData();
  }, [session]);

  const isAdminOrVolunteer = session?.user?.role === "admin" || session?.user?.role === "volunteer";

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDonationStatus(id, { status: newStatus });
      setRequests((prev) =>
        prev.map(req => (req.id || req._id) === id ? { ...req, status: newStatus } : req)
      );
      toast.success(`Request marked as ${newStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;
    try {
      await deleteDonationRequest(requestToDelete);
      setRequests(requests.filter(req => (req.id || req._id) !== requestToDelete));
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Failed to delete", error);
      toast.error("Failed to delete request. Please try again.");
    } finally {
      setRequestToDelete(null);
    }
  };

  // ── derive donor-view chart data from live requests ──────────────────────
  const donorStatusData = React.useMemo(() => {
    const counts = { pending: 0, inprogress: 0, done: 0, canceled: 0 };
    requests.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
    return [
      { name: "Pending",     value: counts.pending,    fill: AMBER },
      { name: "In-Progress", value: counts.inprogress, fill: BLUE  },
      { name: "Completed",   value: counts.done,       fill: GREEN },
      { name: "Canceled",    value: counts.canceled,   fill: RED   },
    ].filter(d => d.value > 0);
  }, [requests]);

  if (loading || !session) return <Loading />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto md:p-0 p-2">

      {/* ── Welcome ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-red-50 to-white p-6 md:p-8 rounded-3xl border border-red-100">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Hello,{" "}
          <span className="text-red-600">
            {session?.user?.name?.split(" ")[0] || (isAdminOrVolunteer ? "Admin" : "Donor")}
          </span>!
        </h1>
        <p className="text-gray-600 font-medium mt-2 text-sm md:text-base">
          {isAdminOrVolunteer
            ? "Manage your platform activities here."
            : "Manage your activities and help save lives today."}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ADMIN / VOLUNTEER VIEW
      ══════════════════════════════════════════════════════════════════ */}
      {isAdminOrVolunteer ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
              <Users className="text-blue-500" size={32} />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Donors</p>
                <h2 className="text-2xl font-black">{stats.totalUsers}</h2>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
              <DollarSign className="text-green-500" size={32} />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Funding</p>
                <h2 className="text-2xl font-black">${stats.totalFunding}</h2>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
              <Droplets className="text-red-500" size={32} />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Total Requests</p>
                <h2 className="text-2xl font-black">{stats.totalRequests}</h2>
              </div>
            </div>
          </div>

          {/* ── Row 1: Area chart + Radial gauge ───────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Monthly Activity – area chart (spans 2 cols) */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
              <SectionTitle icon={TrendingUp} title="Monthly Activity" subtitle="Requests · Fulfilled · New donors" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={RED}  stopOpacity={0.15} />
                      <stop offset="95%" stopColor={RED}  stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gradFulfilled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={GREEN} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={GREEN} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests"  name="Requests"  stroke={RED}   strokeWidth={2.5} fill="url(#gradRequests)"  dot={false} />
                  <Area type="monotone" dataKey="fulfilled" name="Fulfilled" stroke={GREEN} strokeWidth={2.5} fill="url(#gradFulfilled)" dot={false} />
                  <Area type="monotone" dataKey="donors"    name="Donors"    stroke={BLUE}  strokeWidth={2}   fill="none"               dot={false} strokeDasharray="5 3" />
                </AreaChart>
              </ResponsiveContainer>
              {/* mini legend */}
              <div className="flex items-center gap-4 mt-3 justify-center">
                {[["Requests", RED], ["Fulfilled", GREEN], ["New Donors", BLUE]].map(([l, c]) => (
                  <span key={l} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>

            {/* Fulfillment rate – radial */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col">
              <SectionTitle icon={Activity} title="Request Status" subtitle="Overall breakdown" />
              <div className="flex-1 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <RadialBarChart
                    innerRadius="40%" outerRadius="90%"
                    data={RADIAL_DATA} startAngle={90} endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#f9fafb" }} />
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2 text-xs font-bold" style={{ color: payload[0].payload.fill }}>
                            {payload[0].payload.name}: {payload[0].value}%
                          </div>
                        ) : null
                      }
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 w-full mt-2">
                  {RADIAL_DATA.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-gray-500">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                        {d.name}
                      </span>
                      <span className="font-black text-gray-800">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Bar chart + Pie chart ───────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Monthly Requests bar */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <SectionTitle icon={Droplets} title="Requests vs Fulfilled" subtitle="Last 6 months comparison" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MONTHLY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="requests"  name="Requests"  fill={RED}   radius={[6, 6, 0, 0]} />
                  <Bar dataKey="fulfilled" name="Fulfilled" fill={GREEN} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Blood group distribution pie */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <SectionTitle icon={Droplet} title="Blood Group Distribution" subtitle="% of total requests" />
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie
                      data={BLOOD_GROUPS} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={2} stroke="none"
                    >
                      {BLOOD_GROUPS.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2 text-xs font-black text-gray-800">
                            {payload[0].name}: {payload[0].value}%
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {BLOOD_GROUPS.map((g, i) => (
                    <span key={g.name} className="flex items-center gap-1 text-[11px] font-bold text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>

      /* ══════════════════════════════════════════════════════════════════
          DONOR VIEW
      ══════════════════════════════════════════════════════════════════ */
      ) : requests.length > 0 ? (
        <div className="space-y-6">

          {/* ── Donor mini-charts ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Status breakdown donut */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <SectionTitle icon={Activity} title="My Request Status" subtitle="Breakdown of all my requests" />
              {donorStatusData.length > 0 ? (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={160}>
                    <PieChart>
                      <Pie
                        data={donorStatusData} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                        paddingAngle={3} stroke="none"
                      >
                        {donorStatusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2 text-xs font-black" style={{ color: payload[0].payload.fill }}>
                              {payload[0].name}: {payload[0].value}
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2">
                    {donorStatusData.map(d => (
                      <div key={d.name} className="flex items-center justify-between gap-6">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                          {d.name}
                        </span>
                        <span className="font-black text-gray-800 text-sm">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic mt-4">No data yet.</p>
              )}
            </div>

            {/* Blood group needs bar (global context) */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <SectionTitle icon={Droplet} title="Most Needed Blood Types" subtitle="Platform-wide demand" />
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={BLOOD_GROUPS.slice(0, 5)}
                  margin={{ top: 4, right: 4, left: -25, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Demand %" radius={[6, 6, 0, 0]}>
                    {BLOOD_GROUPS.slice(0, 5).map((_, i) => (
                      <Cell key={i} fill={i === 0 ? RED : i === 1 ? ROSE : i === 2 ? AMBER : i === 3 ? BLUE : GREEN} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Recent Requests (unchanged) ────────────────────────────── */}
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-xl text-gray-900">Recent Requests</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {requests.slice(0, 3).map((req) => (
              <div
                key={req.id || req._id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-5"
              >
                <div className="flex items-start md:items-center gap-4 md:w-1/3">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-50 flex flex-col items-center justify-center text-red-600 border border-red-100">
                    <Droplet size={16} className="mb-0.5 opacity-50" />
                    <span className="font-black text-lg leading-none">{req.bloodGroup}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">{req.recipientName}</h4>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1.5 truncate">
                      <MapPin size={12} className="text-gray-400 shrink-0" />
                      {req.district}, {req.upazila}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/3 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CalendarDays size={14} className="text-gray-400 shrink-0" />
                    <span className="font-semibold">{req.donationDate || req.date}</span>
                    <span className="text-gray-400 text-xs font-medium">({req.donationTime || req.time})</span>
                  </div>
                  {["inprogress", "done"].includes(req.status) && req.donorName ? (
                    <div className="text-xs pt-2 border-t border-gray-200/60 mt-1 flex flex-col gap-1">
                      <div>
                        <span className="text-gray-400 font-medium">Donor:</span>{" "}
                        <span className="font-bold text-gray-800">{req.donorName}</span>
                      </div>
                      {req.donorEmail && (
                        <div className="text-gray-500 font-medium truncate" title={req.donorEmail}>
                          {req.donorEmail}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs pt-2 border-t border-gray-200/60 mt-1 text-gray-400 italic">
                      No donor assigned yet
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-1/4 mt-1 md:mt-0 pt-3 md:pt-0 border-t border-gray-100 md:border-transparent">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${
                    req.status === "pending"    ? "bg-gray-100 text-gray-600"  :
                    req.status === "inprogress" ? "bg-blue-50 text-blue-600"   :
                    req.status === "done"       ? "bg-green-50 text-green-600" :
                    "bg-red-50 text-red-600"
                  }`}>
                    {req.status}
                  </span>

                  <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                    {req.status === "inprogress" && (
                      <>
                        <button onClick={() => updateStatus(req.id || req._id, "done")}     title="Mark as Done"    className="text-green-600 hover:bg-green-50 p-1.5 sm:p-2 rounded-lg transition-colors"><CheckCircle size={18} /></button>
                        <button onClick={() => updateStatus(req.id || req._id, "canceled")} title="Cancel Request"  className="text-red-600 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors"><XCircle size={18} /></button>
                      </>
                    )}
                    <Link href={`/donation-requests/${req.id || req._id}`}     title="View Details" className="text-blue-500 hover:bg-blue-50 p-1.5 sm:p-2 rounded-lg transition-colors"><Eye size={18} /></Link>
                    <Link href={`/dashboard/requests/edit/${req.id || req._id}`} title="Edit Request" className="text-orange-500 hover:bg-orange-50 p-1.5 sm:p-2 rounded-lg transition-colors"><Edit size={18} /></Link>
                    <button onClick={() => setRequestToDelete(req.id || req._id)} title="Delete Request" className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/dashboard/donor/my-requests">
              <button className="w-full py-3.5 bg-white border border-gray-200 hover:border-gray-800 hover:bg-gray-800 transition-all rounded-xl text-gray-800 hover:text-white font-bold text-sm tracking-widest uppercase shadow-sm">
                View Full History
              </button>
            </Link>
          </div>
        </div>

      ) : (
        /* Empty State — unchanged */
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="w-full py-20 px-6 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-8">
            <Syringe className="text-gray-300 w-12 h-12 mb-4 -rotate-45" strokeWidth={1.5} />
            <h3 className="text-xl font-black text-gray-400">No Recent Requests</h3>
          </div>
          <Link href="/dashboard/donor/my-requests">
            <button className="px-8 py-3.5 bg-[#0f172a] hover:bg-gray-800 transition-all rounded-xl text-white font-bold text-sm tracking-widest uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              View All Requests
            </button>
          </Link>
        </div>
      )}

      {/* ── Delete Confirmation Modal — unchanged ─────────────────────── */}
      {requestToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-2">Delete Request</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete this donation request? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setRequestToDelete(null)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

