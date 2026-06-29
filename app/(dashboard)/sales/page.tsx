"use client";

import React, { useState, useEffect } from "react";
import { getItems, saveItems } from "@/lib/db";
import { TrendingUp, Plus, UserPlus, FileText, CheckCircle2, Pencil, Trash2, X } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  project: string;
  value: number;
  stage: "Prospect" | "Proposal" | "Negotiation" | "Won" | "Lost";
  status: "Hot" | "Warm" | "New";
}

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadProject, setNewLeadProject] = useState("");
  const [newLeadValue, setNewLeadValue] = useState("");
  const [newLeadStatus, setNewLeadStatus] = useState<"Hot" | "Warm" | "New">("New");
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);

  useEffect(() => {
    getItems<Lead>("founder_leads", []).then(setLeads);
  }, []);

  const save = (updated: Lead[]) => {
    setLeads(updated);
    saveItems("founder_leads", updated);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    if (editingLeadId) {
      save(leads.map((l) => l.id === editingLeadId ? {
        ...l,
        name: newLeadName,
        project: newLeadProject || "Consultation",
        value: parseFloat(newLeadValue) || 0,
        status: newLeadStatus,
      } : l));
      setEditingLeadId(null);
    } else {
      const newLead: Lead = {
        id: Date.now().toString(),
        name: newLeadName,
        project: newLeadProject || "Consultation",
        value: parseFloat(newLeadValue) || 0,
        stage: "Prospect",
        status: newLeadStatus,
      };
      save([newLead, ...leads]);
    }

    setNewLeadName("");
    setNewLeadProject("");
    setNewLeadValue("");
    setNewLeadStatus("New");
  };

  const startEditLead = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setNewLeadName(lead.name);
    setNewLeadProject(lead.project);
    setNewLeadValue(lead.value.toString());
    setNewLeadStatus(lead.status);
  };

  const cancelEdit = () => {
    setEditingLeadId(null);
    setNewLeadName("");
    setNewLeadProject("");
    setNewLeadValue("");
    setNewLeadStatus("New");
  };

  const deleteLead = (id: string) => {
    if (editingLeadId === id) {
      cancelEdit();
    }
    save(leads.filter((l) => l.id !== id));
  };

  const updateStage = (id: string, stage: Lead["stage"]) => {
    save(leads.map((l) => l.id === id ? { ...l, stage } : l));
  };

  const totalWon = leads.filter((l) => l.stage === "Won").reduce((acc, l) => acc + l.value, 0);
  const activePipeline = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost").reduce((acc, l) => acc + l.value, 0);

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Sales & CRM Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">Nurture client relationships, scale transaction volume, and seal deals.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Pipeline</p>
            <p className="text-lg font-bold text-blue-400 font-display">Rs. {activePipeline.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deals Won</p>
            <p className="text-lg font-bold text-green-400 font-display">Rs. {totalWon.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Pipeline Deals ({leads.length})
            </h2>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4" id={`lead-${lead.id}`}>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-white font-display">{lead.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        lead.status === "Hot" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        lead.status === "Warm" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-white/5 text-slate-400 border-white/10"
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{lead.project} • Rs. {lead.value.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 justify-between md:justify-end">
                    <span className="text-xs text-slate-400 font-medium">Stage:</span>
                    <select
                      value={lead.stage}
                      onChange={(e) => updateStage(lead.id, e.target.value as any)}
                      className="bg-[#161616] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-medium mr-2"
                    >
                      <option value="Prospect" className="bg-[#161616]">Prospect</option>
                      <option value="Proposal" className="bg-[#161616]">Proposal</option>
                      <option value="Negotiation" className="bg-[#161616]">Negotiation</option>
                      <option value="Won" className="bg-[#161616]">Won</option>
                      <option value="Lost" className="bg-[#161616]">Lost</option>
                    </select>
                    
                    <button
                      onClick={() => startEditLead(lead)}
                      className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                        editingLeadId === lead.id ? "text-blue-400 bg-white/5" : ""
                      }`}
                      title="Edit Prospect"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                      title="Delete Prospect"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {editingLeadId ? "Edit Prospect Info" : "Add Prospect"}
            </h2>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prospect Name</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Jordan Miller"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Name</label>
                <input
                  type="text"
                  value={newLeadProject}
                  onChange={(e) => setNewLeadProject(e.target.value)}
                  placeholder="Website Overhaul"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deal Value (Rs.)</label>
                  <input
                    type="number"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(e.target.value)}
                    placeholder="4500"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                  <select
                    value={newLeadStatus}
                    onChange={(e) => setNewLeadStatus(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="New" className="bg-[#161616]">New</option>
                    <option value="Warm" className="bg-[#161616]">Warm</option>
                    <option value="Hot" className="bg-[#161616]">Hot</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                {editingLeadId && (
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
                    editingLeadId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingLeadId ? "Save Changes" : "Onboard Prospect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
