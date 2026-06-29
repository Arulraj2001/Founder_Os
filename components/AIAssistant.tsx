"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw } from "lucide-react";
import { getItems } from "@/lib/db";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Founder OS! I am your AI Advisor. Ask me anything about your tasks, projects, budget, or campaign marketing performance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    if (!textToSend) setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Gather current workspace context dynamically
      const tasks = await getItems("founder_tasks_all", []);
      const goals = await getItems("founder_goals", []);
      const campaigns = await getItems("founder_campaigns", []);
      const expenses = await getItems("founder_expenses", []);
      const transactions = await getItems("founder_transactions", []);
      const projects = await getItems("founder_projects", []);
      const leads = await getItems("founder_leads", []);

      const context = {
        summary: {
          taskCount: tasks.length,
          completedTasks: tasks.filter((t: any) => t.completed).length,
          goalCount: goals.length,
          projectCount: projects.length,
          activeProjects: projects.filter((p: any) => p.status === "Active").length,
          campaignCount: campaigns.length,
          leadCount: leads.length,
          totalRevenue: transactions.filter((t: any) => t.status === "Paid").reduce((acc: number, t: any) => acc + t.amount, 0),
          totalExpenses: expenses.reduce((acc: number, e: any) => acc + e.amount, 0),
        },
        tasks: tasks.slice(0, 10), // Send top 10 items to prevent payload bloating
        goals: goals.slice(0, 5),
        campaigns: campaigns.slice(0, 5),
        projects: projects.slice(0, 5),
        expenses: expenses.slice(0, 10),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ **API Error**: ${data.error}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Connection Error**: ${e.message || "Failed to contact chat api."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-4 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-5 h-5 animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="text-sm tracking-wide">Ask AI Advisor</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] h-[500px] bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#1C1C1C] border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide font-display">AI Founder Advisor</h3>
                <p className="text-[10px] text-slate-500">Gemini 2.5 Flash Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    m.role === "user" ? "bg-slate-700 text-white" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[80%] whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-[#202020] text-slate-300 border border-white/5 prose prose-invert"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#202020] text-slate-500 rounded-xl px-3 py-2 text-xs border border-white/5 animate-pulse">
                  Analyzing workspace and thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts helper (when input is empty and no load) */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 pb-2 pt-1 border-t border-white/5 bg-[#121212]/50">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Suggested Queries</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleSuggest("Give me a workspace performance summary")}
                  className="text-[10px] text-left text-slate-400 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 px-2 py-1.5 rounded-lg transition-colors truncate"
                >
                  📊 Performance Summary
                </button>
                <button
                  onClick={() => handleSuggest("What are my highest priority tasks and goals?")}
                  className="text-[10px] text-left text-slate-400 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 px-2 py-1.5 rounded-lg transition-colors truncate"
                >
                  🎯 Priority Tasks & Goals
                </button>
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-white/5 bg-[#1B1B1B] flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for recommendations..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
