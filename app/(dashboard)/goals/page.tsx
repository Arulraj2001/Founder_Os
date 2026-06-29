"use client";

import React, { useState, useEffect } from "react";
import { getItems, saveItems } from "@/lib/db";
import { Target, Plus, ShieldCheck, HelpCircle, Pencil, Trash2, X } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newCurrent, setNewCurrent] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  useEffect(() => {
    getItems<Goal>("founder_goals", []).then(setGoals);
  }, []);

  const save = (updated: Goal[]) => {
    setGoals(updated);
    saveItems("founder_goals", updated);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTarget) return;

    if (editingGoalId) {
      save(goals.map((g) => g.id === editingGoalId ? {
        ...g,
        name: newName,
        target: parseFloat(newTarget) || 100,
        unit: newUnit || "%",
        current: Math.min(parseFloat(newTarget) || 100, Math.max(0, parseFloat(newCurrent) || 0)),
      } : g));
      setEditingGoalId(null);
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: newName,
        current: 0,
        target: parseFloat(newTarget) || 100,
        unit: newUnit || "%",
        color: "bg-indigo-500",
      };
      save([...goals, newGoal]);
    }

    setNewName("");
    setNewTarget("");
    setNewUnit("");
    setNewCurrent("");
  };

  const updateGoalProgress = (id: string, value: number) => {
    save(goals.map((g) => g.id === id ? { ...g, current: Math.min(g.target, Math.max(0, value)) } : g));
  };

  const startEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setNewName(goal.name);
    setNewTarget(goal.target.toString());
    setNewUnit(goal.unit);
    setNewCurrent(goal.current.toString());
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
    setNewName("");
    setNewTarget("");
    setNewUnit("");
    setNewCurrent("");
  };

  const deleteGoal = (id: string) => {
    if (editingGoalId === id) {
      cancelEdit();
    }
    save(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Target Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">Nurture development milestones, project deliverables, and brand growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" /> Goal Indicators
            </h2>

            <div className="space-y-8">
              {goals.map((goal) => {
                const percentage = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={goal.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4" id={`goal-item-${goal.id}`}>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-white font-display">{goal.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {goal.unit === "$" || goal.unit === "Rs." || goal.unit === "Rs" ? "Rs. " : ""}{goal.current.toLocaleString()}{goal.unit !== "$" && goal.unit !== "Rs." && goal.unit !== "Rs" ? goal.unit : ""} / {goal.unit === "$" || goal.unit === "Rs." || goal.unit === "Rs" ? "Rs. " : ""}{goal.target.toLocaleString()}{goal.unit !== "$" && goal.unit !== "Rs." && goal.unit !== "Rs" ? goal.unit : ""} ({percentage}%)
                      </span>
                    </div>

                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <div className={`h-full ${goal.color} rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">Adjust Progress:</span>
                      <input
                        type="range"
                        min="0"
                        max={goal.target}
                        value={goal.current}
                        onChange={(e) => updateGoalProgress(goal.id, parseFloat(e.target.value))}
                        className="flex-grow accent-blue-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                      />

                      <div className="flex gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => startEditGoal(goal)}
                          className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                            editingGoalId === goal.id ? "text-blue-400 bg-white/5" : ""
                          }`}
                          title="Edit Goal"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
              {editingGoalId ? "Edit Target" : "Define New Target"}
            </h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Goal Indicator</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Traffic target (10k/mo)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Value</label>
                  <input
                    type="number"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="10000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Measurement Unit</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="visitors / Rs."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {editingGoalId && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Progress</label>
                  <input
                    type="number"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(e.target.value)}
                    placeholder="5000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {editingGoalId && (
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
                    editingGoalId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingGoalId ? "Save Changes" : "Define Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
