"use client";

import React, { useState, useEffect } from "react";
import { getItems, saveItems } from "@/lib/db";
import { DollarSign, Plus, Download, Receipt, ArrowUpRight, Pencil, Trash2, X } from "lucide-react";

interface Transaction {
  id: string;
  client: string;
  project: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
}

export default function RevenuePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clientName, setClientName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState<Transaction["status"]>("Pending");
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  useEffect(() => {
    getItems<Transaction>("founder_transactions", []).then(setTransactions);
  }, []);

  const save = (updated: Transaction[]) => {
    setTransactions(updated);
    saveItems("founder_transactions", updated);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectTitle.trim()) return;

    if (editingTransactionId) {
      save(transactions.map((t) => t.id === editingTransactionId ? {
        ...t,
        client: clientName,
        project: projectTitle,
        amount: parseFloat(invoiceAmount) || 0,
        status: invoiceStatus,
      } : t));
      setEditingTransactionId(null);
    } else {
      const newTx: Transaction = {
        id: Date.now().toString(),
        client: clientName,
        project: projectTitle,
        amount: parseFloat(invoiceAmount) || 0,
        date: new Date().toISOString().split('T')[0],
        status: "Pending",
      };
      save([newTx, ...transactions]);
    }

    setClientName("");
    setProjectTitle("");
    setInvoiceAmount("");
    setInvoiceStatus("Pending");
  };

  const markPaid = (id: string) => {
    save(transactions.map((t) => t.id === id ? { ...t, status: "Paid" } : t));
  };

  const startEditTransaction = (t: Transaction) => {
    setEditingTransactionId(t.id);
    setClientName(t.client);
    setProjectTitle(t.project);
    setInvoiceAmount(t.amount.toString());
    setInvoiceStatus(t.status);
  };

  const cancelEdit = () => {
    setEditingTransactionId(null);
    setClientName("");
    setProjectTitle("");
    setInvoiceAmount("");
    setInvoiceStatus("Pending");
  };

  const deleteTransaction = (id: string) => {
    if (editingTransactionId === id) {
      cancelEdit();
    }
    save(transactions.filter((t) => t.id !== id));
  };

  const revenuePaid = transactions.filter((t) => t.status === "Paid").reduce((acc, t) => acc + t.amount, 0);
  const revenuePending = transactions.filter((t) => t.status === "Pending").reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Revenue Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">Deploy invoices, manage cash flow, and audit transaction streams.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Received Capital</p>
            <p className="text-lg font-bold text-green-400 font-display">Rs. {revenuePaid.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Outstanding (A/R)</p>
            <p className="text-lg font-bold text-blue-400 font-display">Rs. {revenuePending.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-500" /> Transaction Audit
            </h2>

            <div className="space-y-4">
              {transactions.map((t) => (
                <div key={t.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4" id={`tx-${t.id}`}>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{t.client}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{t.project} • Date: {t.date}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 justify-between md:justify-end">
                    <span className="text-sm font-bold text-white font-mono mr-2">Rs. {t.amount.toLocaleString()}</span>
                    {t.status === "Pending" ? (
                      <button
                        onClick={() => markPaid(t.id)}
                        className="text-[10px] font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded transition-all mr-2"
                      >
                        MARK PAID
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded mr-2">
                        PAID
                      </span>
                    )}

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => startEditTransaction(t)}
                        className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                          editingTransactionId === t.id ? "text-blue-400 bg-white/5" : ""
                        }`}
                        title="Edit Invoice"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                        title="Delete Invoice"
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
              {editingTransactionId ? "Edit Invoice Info" : "Deploy Invoice"}
            </h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Stellar Labs"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Details</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="UI Development sprint 2"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Value (Rs.)</label>
                <input
                  type="number"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  placeholder="4500"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {editingTransactionId && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Status</label>
                  <select
                    value={invoiceStatus}
                    onChange={(e) => setInvoiceStatus(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Paid" className="bg-[#161616]">Paid</option>
                    <option value="Pending" className="bg-[#161616]">Pending</option>
                    <option value="Overdue" className="bg-[#161616]">Overdue</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                {editingTransactionId && (
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
                    editingTransactionId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingTransactionId ? "Save Changes" : "Deploy Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
