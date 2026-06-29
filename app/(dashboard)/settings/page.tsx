"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, User, HardDrive, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Alpha Founder");
  const [email, setEmail] = useState("medidate2023@gmail.com");
  const [company, setCompany] = useState("Founder OS Corp");
  const [plan, setPlan] = useState("Pro Plan");

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifInvoices, setNotifInvoices] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Workspace preferences updated successfully!");
  };

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">System Configuration</h1>
          <p className="text-xs text-slate-500 mt-1">Configure profile thresholds, team workspace, billing, and alert options.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Founder Profile
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Founder Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Administrative Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Workspace Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
                >
                  Save Workspace Info
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 mt-8">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" /> Alert Thresholds
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-white font-display">Daily Execution Briefing</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive summary emails of outstanding milestones and meetings.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-white font-display">Contract Invoice Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Notify when client invoices are paid or overdue.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifInvoices}
                  onChange={(e) => setNotifInvoices(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Billing Allocation
            </h2>
            <div className="p-4 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-xl space-y-3">
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Active Account tier</p>
                <p className="text-lg font-bold text-white font-display mt-0.5">{plan}</p>
              </div>
              <p className="text-xs text-slate-400">Your organization manages 12 active campaigns on our high-performance core node.</p>
              <div className="pt-2">
                <button
                  onClick={() => setPlan(plan === "Pro Plan" ? "Enterprise Team Tier" : "Pro Plan")}
                  className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-2 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Adjust Tier Allocation
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" /> Security Thresholds
            </h2>
            <p className="text-xs text-slate-500 mb-4">Workspace data integrity monitored by our security core.</p>
            <div className="flex items-center gap-2.5 text-xs text-green-400 font-bold">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              SECURE CLIENT CONNECTION
            </div>
          </div>

          <div className="bg-[#161616] border border-red-500/10 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-red-500" /> Danger Zone
            </h2>
            <p className="text-xs text-slate-500 mb-4">Wipe and clear all local workspace databases to start completely fresh.</p>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear all workspace database items? This will reset all tasks, clients, sales leads, campaigns, calendar events, expenses, invoices, and goals.")) {
                  localStorage.clear();
                  alert("All workspace data has been cleared! Reloading...");
                  window.location.reload();
                }
              }}
              className="w-full bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-all"
            >
              Reset Workspace & Fresh Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
