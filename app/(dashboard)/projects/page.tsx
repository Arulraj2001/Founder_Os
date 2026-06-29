"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Plus, TrendingUp, DollarSign, Clock, CheckCircle, Pencil, Trash2, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  progress: number;
  status: "Active" | "Completed" | "Pending";
  dueDate: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectDueDate, setNewProjectDueDate] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("founder_projects");
    if (saved) {
      try { setProjects(JSON.parse(saved)); } catch (e) {}
    } else {
      const initial = [
        { id: "1", name: "Nebula Platform Redesign", client: "Stellar Systems", budget: 14500, progress: 80, status: "Active", dueDate: "2026-07-15" },
        { id: "2", name: "SEO & Content Marketing Sprint", client: "GreenGrow SEO", budget: 3500, progress: 42, status: "Active", dueDate: "2026-07-20" },
        { id: "3", name: "Ad Campaign Optimization", client: "Acme Corp", budget: 5000, progress: 100, status: "Completed", dueDate: "2026-06-25" },
      ];
      setProjects(initial as Project[]);
    }
  }, []);

  const save = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem("founder_projects", JSON.stringify(updated));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    if (editingProjectId) {
      save(projects.map((p) => p.id === editingProjectId ? {
        ...p,
        name: newProjectName,
        client: newProjectClient || "Internal",
        budget: parseFloat(newProjectBudget) || 0,
        dueDate: newProjectDueDate || "No date",
      } : p));
      setEditingProjectId(null);
    } else {
      const newProj: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        client: newProjectClient || "Internal",
        budget: parseFloat(newProjectBudget) || 0,
        progress: 0,
        status: "Active",
        dueDate: newProjectDueDate || "No date",
      };
      save([newProj, ...projects]);
    }

    setNewProjectName("");
    setNewProjectClient("");
    setNewProjectBudget("");
    setNewProjectDueDate("");
  };

  const startEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setNewProjectName(p.name);
    setNewProjectClient(p.client);
    setNewProjectBudget(p.budget.toString());
    setNewProjectDueDate(p.dueDate === "No date" || !p.dueDate ? "" : p.dueDate);
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
    setNewProjectName("");
    setNewProjectClient("");
    setNewProjectBudget("");
    setNewProjectDueDate("");
  };

  const deleteProject = (id: string) => {
    if (editingProjectId === id) {
      cancelEdit();
    }
    save(projects.filter((p) => p.id !== id));
  };

  const adjustProgress = (id: string, amount: number) => {
    save(projects.map((p) => {
      if (p.id === id) {
        const nextProg = Math.min(100, Math.max(0, p.progress + amount));
        const status = nextProg === 100 ? "Completed" : "Active";
        return { ...p, progress: nextProg, status };
      }
      return p;
    }));
  };

  const activeProjects = projects.filter((p) => p.status === "Active");
  const completedProjects = projects.filter((p) => p.status === "Completed");
  const totalValue = projects.reduce((acc, p) => acc + p.budget, 0);

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Client Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Track active deployments, resource metrics, and revenue targets.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Pipeline Budget</p>
            <p className="text-lg font-bold text-white font-display">Rs. {totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" /> Active Deployments ({activeProjects.length})
            </h2>

            <div className="space-y-6">
              {activeProjects.map((p) => (
                <div key={p.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4" id={`project-${p.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-white font-display">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">Client: {p.client} • Due: {p.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-400 font-mono">Rs. {p.budget.toLocaleString()}</span>
                      <div className="flex gap-1.5 mt-2 justify-end items-center">
                        <button
                          onClick={() => adjustProgress(p.id, -10)}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-[10px] text-slate-400 transition-colors"
                        >
                          -10%
                        </button>
                        <button
                          onClick={() => adjustProgress(p.id, 10)}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-[10px] text-slate-400 transition-colors"
                        >
                          +10%
                        </button>
                        <button
                          onClick={() => startEditProject(p)}
                          className={`p-1 rounded hover:bg-white/5 transition-colors ${
                            editingProjectId === p.id ? "text-blue-400 bg-white/5" : "text-slate-500 hover:text-blue-400"
                          }`}
                          title="Edit Project"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-slate-400">Development Progress</span>
                      <span className="text-white font-bold font-mono">{p.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              {activeProjects.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">No active projects found</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> Completed Projects ({completedProjects.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedProjects.map((p) => (
                <div key={p.id} className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl flex flex-col justify-between" id={`completed-project-${p.id}`}>
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-white font-display truncate">{p.name}</h3>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEditProject(p)}
                          className={`p-1 rounded hover:bg-white/5 transition-colors ${
                            editingProjectId === p.id ? "text-blue-400 bg-white/5" : "text-slate-500 hover:text-blue-400"
                          }`}
                          title="Edit Project"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Client: {p.client}</p>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs font-mono text-green-400">Rs. {p.budget.toLocaleString()}</span>
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold">100% DONE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {editingProjectId ? "Edit Project" : "Launch New Project"}
            </h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Acme Platform Deployment"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Name</label>
                <input
                  type="text"
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  placeholder="Acme Inc"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget (Rs.)</label>
                  <input
                    type="number"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                    placeholder="5000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Launch Deadline</label>
                  <input
                    type="date"
                    value={newProjectDueDate}
                    onChange={(e) => setNewProjectDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editingProjectId && (
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
                    editingProjectId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingProjectId ? "Save Changes" : "Deploy Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
