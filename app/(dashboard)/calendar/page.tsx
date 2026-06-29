"use client";

import React, { useState, useEffect } from "react";
import { getItems, saveItems } from "@/lib/db";
import { Calendar as CalendarIcon, Plus, Clock, Users, Video, Pencil, Trash2, X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  type: "meeting" | "sprint" | "milestone";
  participants: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<Event["type"]>("meeting");
  const [participants, setParticipants] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    getItems<Event>("founder_events", []).then(setEvents);
  }, []);

  const save = (updated: Event[]) => {
    setEvents(updated);
    saveItems("founder_events", updated);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    if (editingEventId) {
      save(events.map((ev) => ev.id === editingEventId ? {
        ...ev,
        title,
        time: time || "09:00 AM",
        date,
        type,
        participants: participants || "Internal",
      } : ev));
      setEditingEventId(null);
    } else {
      const newEv: Event = {
        id: Date.now().toString(),
        title,
        time: time || "09:00 AM",
        date,
        type,
        participants: participants || "Internal",
      };
      save([newEv, ...events]);
    }

    setTitle("");
    setTime("");
    setDate("");
    setType("meeting");
    setParticipants("");
  };

  const startEditEvent = (ev: Event) => {
    setEditingEventId(ev.id);
    setTitle(ev.title);
    setTime(ev.time);
    setDate(ev.date);
    setType(ev.type);
    setParticipants(ev.participants);
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setTitle("");
    setTime("");
    setDate("");
    setType("meeting");
    setParticipants("");
  };

  const deleteEvent = (id: string) => {
    if (editingEventId === id) {
      cancelEdit();
    }
    save(events.filter((ev) => ev.id !== id));
  };

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Execution Calendar</h1>
          <p className="text-xs text-slate-500 mt-1">Audit customer touchpoints, launch dates, and sprint milestones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-500" /> Upcoming Schedules ({events.length})
            </h2>

            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4" id={`event-${ev.id}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        ev.type === "meeting" ? "bg-green-500" :
                        ev.type === "sprint" ? "bg-blue-500" :
                        "bg-orange-500"
                      }`}></span>
                      <h3 className="text-base font-bold text-white font-display">{ev.title}</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-600" /> {ev.date} @ {ev.time}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-600" /> {ev.participants}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:shrink-0 self-start md:self-auto justify-between md:justify-end">
                    <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                      {ev.type}
                    </span>

                    <button
                      onClick={() => startEditEvent(ev)}
                      className={`p-1 hover:bg-white/5 rounded text-slate-500 hover:text-blue-400 transition-colors ${
                        editingEventId === ev.id ? "text-blue-400 bg-white/5" : ""
                      }`}
                      title="Edit Event"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="text-slate-500 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors"
                      title="Delete Event"
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
              {editingEventId ? "Edit Calendar Slot" : "Book Calendar Slot"}
            </h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Acme Sync Alignment"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="meeting" className="bg-[#161616]">Meeting</option>
                    <option value="sprint" className="bg-[#161616]">Sprint</option>
                    <option value="milestone" className="bg-[#161616]">Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Participants</label>
                  <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder="e.g. Acme Team"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editingEventId && (
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
                    editingEventId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingEventId ? "Save Changes" : "Schedule Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
