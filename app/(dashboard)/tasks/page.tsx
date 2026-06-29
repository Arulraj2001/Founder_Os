"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckSquare, Plus, Trash2, Filter, AlertTriangle, CheckCircle, Pencil, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  client: string;
  priority: "High" | "Med" | "Low";
  dueDate: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskClient, setNewTaskClient] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Med" | "Low">("High");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("founder_tasks_all");
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch (e) {}
    } else {
      setTasks([]);
    }
  }, []);

  const save = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem("founder_tasks_all", JSON.stringify(updated));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (editingTaskId) {
      save(tasks.map((t) => t.id === editingTaskId ? {
        ...t,
        title: newTaskTitle,
        client: newTaskClient || "Internal",
        priority: newTaskPriority,
        dueDate: newTaskDueDate || "No date",
      } : t));
      setEditingTaskId(null);
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        client: newTaskClient || "Internal",
        priority: newTaskPriority,
        dueDate: newTaskDueDate || "No date",
        completed: false,
      };
      save([newTask, ...tasks]);
    }

    setNewTaskTitle("");
    setNewTaskClient("");
    setNewTaskDueDate("");
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskClient(task.client);
    setNewTaskPriority(task.priority);
    setNewTaskDueDate(task.dueDate === "No date" || !task.dueDate ? "" : task.dueDate);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setNewTaskTitle("");
    setNewTaskClient("");
    setNewTaskDueDate("");
  };

  const toggleTask = (id: string) => {
    save(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (editingTaskId === id) {
      cancelEdit();
    }
    save(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Pending") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  return (
    <div className="flex-1 p-8 bg-[#0A0A0A] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Task Execution Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">Deploy, monitor, and finalize active project operations.</p>
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                filter === f
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-500" /> Task Log
            </h2>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      task.completed
                        ? "bg-[#0F0F0F] border-white/5 opacity-50"
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        task.completed ? "bg-green-500 border-green-500 text-black" : "border-white/20 hover:border-blue-500"
                      }`}
                    >
                      {task.completed && <span className="text-[10px] font-bold">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-white truncate ${task.completed ? "line-through text-slate-500" : ""}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight mt-1">
                        Client: {task.client} • Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        task.priority === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        task.priority === "Med" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={() => startEditTask(task)}
                        className={`p-1 rounded hover:bg-white/5 transition-colors ${
                          editingTaskId === task.id ? "text-blue-400 bg-white/5" : "text-slate-500 hover:text-blue-400"
                        }`}
                        title="Edit Task"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">No tasks found in this view</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {editingTaskId ? "Edit Task" : "Create New Task"}
            </h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Review client proposal"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Name</label>
                <input
                  type="text"
                  value={newTaskClient}
                  onChange={(e) => setNewTaskClient(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="High" className="bg-[#161616]">High</option>
                    <option value="Med" className="bg-[#161616]">Medium</option>
                    <option value="Low" className="bg-[#161616]">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editingTaskId && (
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
                    editingTaskId
                      ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  }`}
                >
                  {editingTaskId ? "Save Changes" : "Add to pipeline"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
