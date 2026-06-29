"use client";

import React, { useState, useEffect } from "react";
import { Receipt, Plus, ArrowDownRight, TrendingDown, Pencil, Trash2, X } from "lucide-react";

interface Expense {
  id: string;
  item: string;
  category: "SaaS Tools" | "Ad Spend" | "Rent & Operations" | "Contracting";
  amount: number;
  date: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<Expense["category"]>("SaaS Tools");
  const [amount, setAmount] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("founder_expenses");
    if (saved) {
      try { setExpenses(JSON.parse(saved)); } catch (e) {}
    } else {
      setExpenses([]);
    }
  }, []);

  const save = (updated: Expense[]) => {
    setExpenses(updated);
    localStorage.setItem("founder_expenses", JSON.stringify(updated));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !amount) return;

    if (editingExpenseId) {
      save(expenses.map((exp) => exp.id === editingExpenseId ? {
        ...exp,
        item: itemName,
        category,
        amount: parseFloat(amount) || 0,
      } : exp));
      setEditingExpenseId(null);
    } else {
      const newExp: Expense = {
        id: Date.now().toString(),
        item: itemName,
        category,
        amount: parseFloat(amount) || 0,
        date: new Date().toISOString().split("T")[0],
      };
      save([newExp, ...expenses]);
    }

    setItemName("");
    setAmount("");
    setCategory("SaaS Tools");
  };

  const startEditExpense = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    setItemName(exp.item);
    setCategory(exp.category);
    setAmount(exp.amount.toString());
  };

  const cancelEdit = () => {
    setEditingExpenseId(null);
    setItemName("");
    setCategory("SaaS Tools");
    setAmount("");
  };

  const deleteExpense = (id: string) => {
    if (editingExpenseId === id) {
      cancelEdit();
    }
    save(expenses.filter((exp) => exp.id !== id));
  };

  const totalOutflow = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Operational Expenses</h1>
          <p className="text-xs text-slate-500 mt-1">Audit software subscriptions, infrastructure overheads, and campaign spends.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Monthly Cash Outflow</p>
          <p className="text-lg font-bold text-red-400 font-display">Rs. {totalOutflow.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-red-400" /> Outflow Journal
            </h2>

            <div className="space-y-4">
              {expenses.map((exp) => (
                <div key={exp.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between" id={`expense-${exp.id}`}>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{exp.item}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{exp.category} • Date: {exp.date}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-sm font-bold text-red-400 font-mono">-Rs. {exp.amount.toLocaleString()}</span>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditExpense(exp)}
                        className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                          editingExpenseId === exp.id ? "text-blue-400 bg-white/5" : ""
                        }`}
                        title="Edit Expense"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {editingExpenseId ? "Edit Outflow Info" : "Log Capital Outflow"}
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expense Item</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Slack Premium Sub"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="SaaS Tools" className="bg-[#161616]">SaaS Tools</option>
                  <option value="Ad Spend" className="bg-[#161616]">Ad Spend</option>
                  <option value="Rent & Operations" className="bg-[#161616]">Rent & Operations</option>
                  <option value="Contracting" className="bg-[#161616]">Contracting</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outflow Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="150"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                {editingExpenseId && (
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
                    editingExpenseId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  }`}
                >
                  {editingExpenseId ? "Save Changes" : "Log Outflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
