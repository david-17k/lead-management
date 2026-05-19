"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [fetching, setFetching] = useState(true);

  const fetchLeads = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (_e) {}
    finally { setFetching(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (e) => {
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
      setStatus({ type: "error", message: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <main className="min-h-screen bg-[#0e0e12] text-white">
      <header className="border-b border-white/10 bg-[#0e0e12]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">L</div>
          <span className="text-lg font-semibold">LeadFlow</span>
          <span className="ml-auto text-xs text-white/40">{leads.length} leads captured</span>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Capture Every Lead</h1>
          <p className="text-white/50 text-sm">Submit leads instantly. Data saved to MongoDB Atlas in real-time.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
          <h2 className="text-base font-semibold text-white/80 mb-6">New Lead</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-wider">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-wider">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-wider">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
            </div>
            {status && (
              <div className={`rounded-xl px-4 py-3 text-sm ${status.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                {status.message}
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 rounded-xl px-6 py-3 text-sm font-semibold text-white transition">
              {loading ? "Saving Lead…" : "Submit Lead"}
            </button>
          </form>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white/80">All Leads</h2>
            <button onClick={fetchLeads} className="text-xs text-white/40 hover:text-white/70 transition">Refresh</button>
          </div>
          {fetching ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-white/30 text-sm">Loading leads…</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-white/30 text-sm">No leads yet. Submit one above!</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-6 py-3 text-xs text-white/40 uppercase">#</th>
                    <th className="text-left px-6 py-3 text-xs text-white/40 uppercase">Name</th>
                    <th className="text-left px-6 py-3 text-xs text-white/40 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs text-white/40 uppercase">Phone</th>
                    <th className="text-left px-6 py-3 text-xs text-white/40 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((lead, i) => (
                    <tr key={lead._id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/30 text-xs">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                      <td className="px-6 py-4 text-white/60">{lead.email}</td>
                      <td className="px-6 py-4 text-white/60">{lead.phone}</td>
                      <td className="px-6 py-4 text-white/40 text-xs">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}