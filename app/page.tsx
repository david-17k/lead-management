"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchLeads = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (_e) {
      // silent
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: data.message });
        setForm({ name: "", email: "", phone: "" });
        fetchLeads();
      } else {
        setStatus({ type: "error", message: data.message });
      }
    } catch (_e) {
      setStatus({ type: "error", message: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="min-h-screen bg-[#0e0e12] text-white font-sans">
      <header className="border-b border-white/10 bg-[#0e0e12]/80 backdrop-blur sticky top-