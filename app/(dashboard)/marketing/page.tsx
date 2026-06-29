"use client";

import React, { useState, useEffect } from "react";
import { getItems, saveItems } from "@/lib/db";
import { Megaphone, Plus, Percent, Users, TrendingUp, BarChart, Pencil, Trash2, X } from "lucide-react";
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  impressions: number;
  conversions: number;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Google Ads");
  const [budget, setBudget] = useState("");
  const [spent, setSpent] = useState("");
  const [impressions, setImpressions] = useState("");
  const [conversions, setConversions] = useState("");
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

  useEffect(() => {
    getItems<Campaign>("founder_campaigns", []).then(setCampaigns);
  }, []);

  const save = (updated: Campaign[]) => {
    setCampaigns(updated);
    saveItems("founder_campaigns", updated);
  };

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCampaignId) {
      save(campaigns.map((c) => c.id === editingCampaignId ? {
        ...c,
        name,
        platform,
        budget: parseFloat(budget) || 0,
        spent: parseFloat(spent) || 0,
        impressions: parseInt(impressions) || 0,
        conversions: parseInt(conversions) || 0,
      } : c));
      setEditingCampaignId(null);
    } else {
      const newCamp: Campaign = {
        id: Date.now().toString(),
        name,
        platform,
        budget: parseFloat(budget) || 0,
        spent: 0,
        impressions: 0,
        conversions: 0,
      };
      save([newCamp, ...campaigns]);
    }

    setName("");
    setBudget("");
    setSpent("");
    setImpressions("");
    setConversions("");
  };

  const startEditCampaign = (c: Campaign) => {
    setEditingCampaignId(c.id);
    setName(c.name);
    setPlatform(c.platform);
    setBudget(c.budget.toString());
    setSpent(c.spent.toString());
    setImpressions(c.impressions.toString());
    setConversions(c.conversions.toString());
  };

  const cancelEdit = () => {
    setEditingCampaignId(null);
    setName("");
    setPlatform("Google Ads");
    setBudget("");
    setSpent("");
    setImpressions("");
    setConversions("");
  };

  const deleteCampaign = (id: string) => {
    if (editingCampaignId === id) {
      cancelEdit();
    }
    save(campaigns.filter((c) => c.id !== id));
  };

  const chartData = campaigns.map((c) => ({
    name: c.name,
    spent: c.spent,
    budget: c.budget,
  }));

  const totalSpent = campaigns.reduce((acc, c) => acc + c.spent, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Marketing Campaigns</h1>
          <p className="text-xs text-slate-500 mt-1">Scale reach, fine-tune bidding strategy, and track lead conversions.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Ad Spend</p>
            <p className="text-lg font-bold text-blue-400 font-display">Rs. {totalSpent.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conversions</p>
            <p className="text-lg font-bold text-green-400 font-display">{totalConversions.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Spend vs Budget Chart */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 h-[300px]" id="campaign-budget-chart">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Spend vs Budget allocation</h2>
            <div className="w-full h-full min-h-0 pb-10">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} />
                  <YAxis stroke="#525252" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid rgba(255,255,255,0.08)" }} />
                  <Bar dataKey="budget" fill="rgba(255,255,255,0.1)" name="Budget" />
                  <Bar dataKey="spent" fill="#2563eb" name="Spent" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campaigns Pipeline */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-500" /> Advertising Channels
            </h2>

            <div className="space-y-4">
              {campaigns.map((c) => {
                const ctr = c.impressions > 0 ? ((c.conversions / c.impressions) * 100).toFixed(2) : "0.00";
                return (
                  <div key={c.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4 hover:border-white/10 transition-colors" id={`campaign-${c.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-white font-display">{c.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Platform: {c.platform}</p>
                      </div>
                      <div className="text-right flex items-start gap-3">
                        <div>
                          <span className="text-xs font-bold text-slate-400">Spent: </span>
                          <span className="text-xs font-bold text-white font-mono">Rs. {c.spent.toLocaleString()} / Rs. {c.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => startEditCampaign(c)}
                            className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                              editingCampaignId === c.id ? "text-blue-400 bg-white/5" : ""
                            }`}
                            title="Edit Campaign"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCampaign(c.id)}
                            className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5 text-center">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Impressions</p>
                        <p className="text-sm font-bold text-white font-mono mt-1">{c.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Conversions</p>
                        <p className="text-sm font-bold text-blue-400 font-mono mt-1">{c.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">CTR %</p>
                        <p className="text-sm font-bold text-green-400 font-mono mt-1">{ctr}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {editingCampaignId ? "Edit Campaign" : "Launch Campaign"}
            </h2>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Inbound Software Leadgen"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ad Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Google Ads" className="bg-[#161616]">Google Ads</option>
                  <option value="LinkedIn" className="bg-[#161616]">LinkedIn</option>
                  <option value="Twitter / X" className="bg-[#161616]">Twitter / X</option>
                  <option value="Meta Ads" className="bg-[#161616]">Meta Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget Allocation (Rs.)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {editingCampaignId && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Spent (Rs.)</label>
                    <input
                      type="number"
                      value={spent}
                      onChange={(e) => setSpent(e.target.value)}
                      placeholder="Spent amount"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impressions</label>
                      <input
                        type="number"
                        value={impressions}
                        onChange={(e) => setImpressions(e.target.value)}
                        placeholder="Impressions count"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversions</label>
                      <input
                        type="number"
                        value={conversions}
                        onChange={(e) => setConversions(e.target.value)}
                        placeholder="Conversions count"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                {editingCampaignId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg border border-white/10 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-1 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all ${
                    editingCampaignId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingCampaignId ? "Save Changes" : "Deploy Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
