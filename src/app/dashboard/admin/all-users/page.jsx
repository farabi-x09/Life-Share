

"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);


  const filteredUsers = users.filter(user => {
    if (statusFilter === "all") return true;
    return user.status === statusFilter;
  });

  const handleUpdateUser = async (id, field, value) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        toast.success(`User ${field} updated successfully!`);
        fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'volunteer': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'donor': default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">Change user roles or block/unblock accounts.</p>
        </div>
        {/* Status Filter */}
        <select onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* 🖥️ Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
            <tr><th className="p-5 font-bold">Name & Email</th><th className="p-5 font-bold">Role</th><th className="p-5 font-bold">Status</th><th className="p-5 font-bold">Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold overflow-hidden border">
                    {user.image ? <Image src={user.image} alt={user.name} width={40} height={40} /> : <span className="uppercase">{user.name?.charAt(0)}</span>}
                  </div>
                  <div><p className="font-bold">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                </td>
                <td className="p-5"><span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border ${getRoleBadgeStyle(user.role)}`}>{user.role || 'donor'}</span></td>
                <td className="p-5"><span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border ${user.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>{user.status || 'active'}</span></td>
                <td className="p-5 flex gap-3">
                  <select onChange={(e) => handleUpdateUser(user._id, 'role', e.target.value)} className="bg-gray-50 border p-2 rounded-lg text-xs font-bold cursor-pointer"><option value="" disabled>Change Role</option><option value="admin">Admin</option><option value="volunteer">Volunteer</option><option value="donor">Donor</option></select>
                  <button onClick={() => handleUpdateUser(user._id, 'status', user.status === 'blocked' ? 'active' : 'blocked')} className={`px-4 py-2 text-xs font-bold text-white rounded-lg ${user.status === 'blocked' ? 'bg-green-600' : 'bg-red-600'}`}>{user.status === 'blocked' ? 'Unblock' : 'Block'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="lg:hidden grid gap-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold border overflow-hidden">
                    {user.image ? <Image src={user.image} alt={user.name} width={40} height={40} /> : <span className="uppercase">{user.name?.charAt(0)}</span>}
                 </div>
                 <div><p className="font-bold">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${user.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>{user.status}</span>
            </div>
            <div className="flex gap-2 pt-2 border-t">
               <select onChange={(e) => handleUpdateUser(user._id, 'role', e.target.value)} className="flex-1 bg-gray-50 border p-2 rounded-xl text-xs font-bold"><option value="" disabled>Role</option><option value="admin">Admin</option><option value="volunteer">Volunteer</option><option value="donor">Donor</option></select>
               <button onClick={() => handleUpdateUser(user._id, 'status', user.status === 'blocked' ? 'active' : 'blocked')} className={`flex-1 p-2 text-xs font-bold text-white rounded-xl ${user.status === 'blocked' ? 'bg-green-600' : 'bg-red-600'}`}>{user.status === 'blocked' ? 'Unblock' : 'Block'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
