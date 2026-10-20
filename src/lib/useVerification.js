"use client";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";

export function useVerification() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    authFetch("/api/users/me")
      .then((r) => r.json())
      .then((me) => setStatus(me?.role === "admin" ? "verified" : me?.verificationStatus || "pending"))
      .catch(() => setStatus("pending"));
  }, []);

  return status; // null = loading, "pending" | "verified" | "rejected"
}