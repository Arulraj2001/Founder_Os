"use client";

import React, { useState, useEffect } from "react";
import { getItems, saveItems } from "@/lib/db";
import { Users, Plus, Mail, Phone, ShieldCheck, DollarSign, Pencil, Trash2, X } from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: "Active" | "Inactive";
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientValue, setNewClientValue] = useState("");
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  useEffect(() => {
    getItems<Client>("founder_clients", []).then(setClients);
  }, []);

  const save = (updated: Client[]) => {
    setClients(updated);
    saveItems("founder_clients", updated);
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientCompany.trim()) return;

    if (editingClientId) {
      save(clients.map((c) => c.id === editingClientId ? {
        ...c,
        name: newClientName,
        company: newClientCompany,
        email: newClientEmail || "no-email@company.com",
        phone: newClientPhone || "N/A",
        value: parseFloat(newClientValue) || 0,
      } : c));
      setEditingClientId(null);
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        name: newClientName,
        company: newClientCompany,
        email: newClientEmail || "no-email@company.com",
        phone: newClientPhone || "N/A",
        value: parseFloat(newClientValue) || 0,
        status: "Active",
      };
      save([newClient, ...clients]);
    }

    setNewClientName("");
    setNewClientCompany("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientValue("");
  };

  const startEditClient = (c: Client) => {
    setEditingClientId(c.id);
    setNewClientName(c.name);
    setNewClientCompany(c.company);
    setNewClientEmail(c.email === "no-email@company.com" ? "" : c.email);
    setNewClientPhone(c.phone === "N/A" ? "" : c.phone);
    setNewClientValue(c.value.toString());
  };

  const cancelEdit = () => {
    setEditingClientId(null);
    setNewClientName("");
    setNewClientCompany("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientValue("");
  };

  const deleteClient = (id: string) => {
    if (editingClientId === id) {
      cancelEdit();
    }
    save(clients.filter((c) => c.id !== id));
  };

  const toggleStatus = (id: string) => {
    save(clients.map((c) => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));
  };

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Client Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Manage partner records, contract sizes, and alignment channels.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Account Value</p>
          <p className="text-lg font-bold text-white font-display">
            Rs. {clients.reduce((acc, c) => acc + c.value, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Active Partners ({clients.length})
            </h2>

            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all duration-200" id={`client-${client.id}`}>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-white font-display">{client.name}</h3>
                      <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 bg-white/5 rounded">
                        {client.company}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-600" /> {client.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-600" /> {client.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Value</p>
                      <p className="text-sm font-bold text-blue-400 font-mono">Rs. {client.value.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(client.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          client.status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/25 hover:bg-green-500/20"
                            : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {client.status.toUpperCase()}
                      </button>
                      <button
                        onClick={() => startEditClient(client)}
                        className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                          editingClientId === client.id ? "text-blue-400 bg-white/5" : ""
                        }`}
                        title="Edit Client"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                        title="Delete Client"
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
              {editingClientId ? "Edit Client Info" : "Onboard New Client"}
            </h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Johnathan Davis"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                  placeholder="Stellar Labs"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="john@stellar.io"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Value (Rs.)</label>
                  <input
                    type="number"
                    value={newClientValue}
                    onChange={(e) => setNewClientValue(e.target.value)}
                    placeholder="12000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+1 (555) 012-3456"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                {editingClientId && (
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
                    editingClientId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingClientId ? "Save Changes" : "Onboard Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
