"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  CheckSquare,
  Users,
  Award,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// TypeScript declarations for interactive states
interface Task {
  id: string;
  title: string;
  priority: "High" | "Med" | "Low";
  client: string;
  time: string;
  completed: boolean;
}

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface Lead {
  id: string;
  name: string;
  project: string;
  value: number;
  status: "Hot" | "Warm" | "New";
  initials: string;
  gradient: string;
}

const initialTasks: Task[] = [];

const initialGoals: Goal[] = [];

const initialLeads: Lead[] = [];

// Interactive Revenue Data for Chart
const chartData = [
  { name: "Mon", revenue: 0 },
  { name: "Tue", revenue: 0 },
  { name: "Wed", revenue: 0 },
  { name: "Thu", revenue: 0 },
  { name: "Fri", revenue: 0 },
  { name: "Sat", revenue: 0 },
  { name: "Sun", revenue: 0 },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  // New task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Med" | "Low">("High");
  const [newTaskClient, setNewTaskClient] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  const [revenueToday, setRevenueToday] = useState(0);
  const [activeLeadsCount, setActiveLeadsCount] = useState(0);
  const [chartDataState, setChartDataState] = useState(chartData);

  // Hydration safety
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Load tasks
    const savedTasks = localStorage.getItem("founder_tasks_all");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }

    // Load goals
    const savedGoals = localStorage.getItem("founder_goals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error("Failed to load goals", e);
      }
    }

    // Load leads
    const savedLeads = localStorage.getItem("founder_leads");
    if (savedLeads) {
      try {
        const parsedLeads = JSON.parse(savedLeads);
        setLeads(parsedLeads);
        setActiveLeadsCount(parsedLeads.filter((l: any) => l.stage !== "Won" && l.stage !== "Lost").length);
      } catch (e) {}
    }

    // Load transactions for dynamic Revenue and Chart
    const savedTx = localStorage.getItem("founder_transactions");
    if (savedTx) {
      try {
        const txs = JSON.parse(savedTx);
        const paidTxs = txs.filter((t: any) => t.status === "Paid");
        const paidTotal = paidTxs.reduce((acc: number, t: any) => acc + t.amount, 0);
        setRevenueToday(paidTotal);

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daySums = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        
        paidTxs.forEach((t: any) => {
          if (t.date) {
            const d = new Date(t.date);
            const dayName = days[d.getDay()] as keyof typeof daySums;
            if (daySums[dayName] !== undefined) {
              daySums[dayName] += t.amount;
            }
          }
        });

        setChartDataState([
          { name: "Mon", revenue: daySums.Mon },
          { name: "Tue", revenue: daySums.Tue },
          { name: "Wed", revenue: daySums.Wed },
          { name: "Thu", revenue: daySums.Thu },
          { name: "Fri", revenue: daySums.Fri },
          { name: "Sat", revenue: daySums.Sat },
          { name: "Sun", revenue: daySums.Sun },
        ]);
      } catch (e) {}
    }
  }, []);

  // Save changes
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("founder_tasks_all", JSON.stringify(newTasks));
  };

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem("founder_goals", JSON.stringify(newGoals));
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed, time: !t.completed ? "Done" : "Pending" } : t
    );
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: newTaskPriority,
      client: newTaskClient || "Internal",
      time: newTaskTime || "09:00 AM",
      completed: false,
    };
    saveTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskClient("");
    setNewTaskTime("");
    setShowTaskModal(false);
  };

  // KPI Calculations
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  if (!isMounted) {
    return (
      <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0A] p-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            Founder Control Panel
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time balance, growth matrix, and task alignment.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-[1.02]"
            id="add-task-btn"
          >
            <Plus className="w-4 h-4" /> Add Execution Task
          </button>
        </div>
      </div>

      {/* Top KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-[#161616] p-5 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
          id="kpi-revenue"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Total Revenue
          </p>
          <p className="text-2xl font-bold text-white font-display">
            Rs. {revenueToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-green-400 mt-2 font-medium">Sum of all paid invoices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#161616] p-5 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
          id="kpi-tasks"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl group-hover:bg-green-500/10 transition-colors"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-green-500" /> Open Tasks
          </p>
          <p className="text-2xl font-bold text-white font-display">{pendingTasksCount}</p>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {completedTasksCount} completed tasks total
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-[#161616] p-5 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
          id="kpi-leads"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-500" /> Total Leads
          </p>
          <p className="text-2xl font-bold text-white font-display">{leads.length}</p>
          <p className="text-[11px] text-blue-400 mt-2 font-medium">{activeLeadsCount} active opportunities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#161616] p-5 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
          id="kpi-streak"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-colors"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-orange-500" /> Completed Tasks
          </p>
          <p className="text-2xl font-bold text-white font-display">{completedTasksCount}</p>
          <p className="text-[11px] text-orange-400 mt-2 font-medium">Out of {tasks.length} total tasks</p>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Revenue Performance & Today's Tasks */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Revenue Recharts Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#161616] p-6 border border-white/5 rounded-2xl flex flex-col h-[340px]"
            id="revenue-performance-chart"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Revenue Performance
              </h2>
              <div className="flex gap-2 text-[10px]">
                <span className="px-2.5 py-1 bg-white/5 rounded text-slate-400 font-medium">Week</span>
                <span className="px-2.5 py-1 bg-blue-600 rounded text-white font-bold">Month</span>
              </div>
            </div>
            <div className="flex-1 w-full h-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataState} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#525252"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#525252"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rs.${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c1c",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="rgba(37,99,235,0.85)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Today's Tasks Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-[#161616] p-6 border border-white/5 rounded-2xl flex flex-col min-h-[300px]"
            id="today-execution-tasks"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Today's Execution
              </h2>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 font-medium">
                {pendingTasksCount} Tasks Remaining
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-4 p-3 bg-white/[0.01] border rounded-xl transition-all duration-200 ${
                      task.completed
                        ? "border-white/5 opacity-50 bg-[#0F0F0F]"
                        : "border-white/5 hover:border-white/10"
                    }`}
                    id={`task-item-${task.id}`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 border rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-black"
                          : "border-white/20 hover:border-blue-500 hover:bg-blue-500/10"
                      }`}
                    >
                      {task.completed && <span className="text-[10px] font-bold">✓</span>}
                    </button>

                    <div className="flex-1 min-w-0" onClick={() => toggleTask(task.id)}>
                      <p
                        className={`text-sm font-medium text-white truncate cursor-pointer transition-all duration-150 ${
                          task.completed ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tight mt-0.5">
                        Priority: {task.priority} • Client: {task.client}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-mono text-slate-500 px-2.5 py-1 bg-white/5 rounded">
                        {task.time}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-slate-600 mb-2 stroke-[1.5]" />
                  <p className="text-sm font-medium">All tasks cleared!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Add tasks to set up execution pipeline.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Monthly Goals & Recent Leads */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Monthly Goals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[#161616] p-6 border border-white/5 rounded-2xl flex-1 flex flex-col min-h-[300px]"
            id="monthly-growth-goals"
          >
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider font-display mb-6">
              Monthly Goals
            </h2>
            <div className="space-y-6 flex-1">
              {goals.map((goal) => {
                const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                return (
                  <div key={goal.id} id={`goal-item-${goal.id}`}>
                    <div className="flex justify-between text-xs mb-2 items-center">
                      <span className="text-slate-400 font-medium">{goal.name}</span>
                      <span className="text-white font-bold font-mono">
                        {goal.unit === "$" ? "Rs. " : ""}
                        {goal.current}
                        {goal.unit !== "$" ? goal.unit : ""} / {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full ${goal.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Active Leads */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-[#161616] p-6 border border-white/5 rounded-2xl"
            id="active-leads-pipeline"
          >
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider font-display mb-4">
              Active Leads
            </h2>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3" id={`lead-item-${lead.id}`}>
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${lead.gradient} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-lg`}
                  >
                    {lead.initials}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {lead.project} • Rs. {lead.value.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      lead.status === "Hot"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : lead.status === "Warm"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-white/5 text-slate-400 border-white/10"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("Pipeline redirection features configured!")}
              className="w-full mt-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              View Pipeline
            </button>
          </motion.div>
        </div>
      </div>

      {/* Execution Task Entry Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
          >
            <h3 className="text-lg font-bold text-white font-display mb-4">Add Execution Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Design Pitch Deck"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="High" className="bg-[#121212]">High</option>
                    <option value="Med" className="bg-[#121212]">Medium</option>
                    <option value="Low" className="bg-[#121212]">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Time
                  </label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="e.g., 03:00 PM"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Client / Campaign Name
                </label>
                <input
                  type="text"
                  value={newTaskClient}
                  onChange={(e) => setNewTaskClient(e.target.value)}
                  placeholder="e.g., Nebula Systems"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
