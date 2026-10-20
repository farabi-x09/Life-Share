"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function VerificationGate({ children }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${data?.token}` },
        });
        const me = await res.json();
        setStatus(me?.role === "admin" ? "verified" : me?.verificationStatus || "pending");
      } catch {
        setStatus("pending");
      }
    };
    load();
  }, []);

  if (!status) return null;

  if (status === "pending") {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm font-semibold">
        ⏳ Your blood group certificate is under review. You can create donation requests once an admin approves it.
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
        ❌ Your certificate was rejected. Please contact support.
      </div>
    );
  }
  return children;
}