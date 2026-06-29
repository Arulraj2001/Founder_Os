"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, ArrowUpRight, Globe, ShieldAlert } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";

const trafficData = [
  { month: "Jan", visitors: 1200 },
  { month: "Feb", visitors: 1900 },
  { month: "Mar", visitors: 2800 },
  { month: "Apr", visitors: 3400 },
  { month: "May", visitors: 4100 },
  { month: "Jun", visitors: 5200 },
];

const ctrData = [
  { campaign: "Google Outbound", ctr: 3.4 },
  { campaign: "LinkedIn Content", ctr: 5.2 },
  { campaign: "Twitter Loop", ctr: 2.1 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Analytics Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">Audit customer acquisition funnels, digital footprint growth, and engagement CTRs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#161616] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Globe className="w-3.5 h-3.5 text-blue-500" /> SEO Monthly Traffic
          </p>
          <p className="text-xl font-bold text-white font-display">5,200/mo</p>
          <p className="text-[11px] text-green-400 mt-2 font-medium">↑ 24% from last month</p>
        </div>

        <div className="bg-[#161616] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" /> Avg. Conversion Rate
          </p>
          <p className="text-xl font-bold text-white font-display">4.21%</p>
          <p className="text-[11px] text-green-400 mt-2 font-medium">↑ 0.8% from last month</p>
        </div>

        <div className="bg-[#161616] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Avg. Bounce Rate
          </p>
          <p className="text-xl font-bold text-white font-display">34.2%</p>
          <p className="text-[11px] text-green-400 mt-2 font-medium">↓ 5.4% from last month (improved)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 h-[320px]" id="traffic-trends-chart">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Traffic Development (SEO)</h2>
          <div className="w-full h-full min-h-0 pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} />
                <YAxis stroke="#525252" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid rgba(255,255,255,0.08)" }} />
                <Line type="monotone" dataKey="visitors" stroke="#2563eb" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 h-[320px]" id="ctr-performance-chart">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Click-Through Rate (CTR %)</h2>
          <div className="w-full h-full min-h-0 pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ctrData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="campaign" stroke="#525252" fontSize={11} tickLine={false} />
                <YAxis stroke="#525252" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid rgba(255,255,255,0.08)" }} />
                <Bar dataKey="ctr" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
