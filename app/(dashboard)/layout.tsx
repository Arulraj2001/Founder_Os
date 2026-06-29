"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AIAssistant from "@/components/AIAssistant";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Briefcase,
  TrendingUp,
  Megaphone,
  DollarSign,
  Receipt,
  Target,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Sales & CRM", href: "/sales", icon: TrendingUp },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#0A0A0A] text-slate-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            F
          </div>
          <span className="text-lg font-semibold tracking-tight text-white font-display">
            Founder OS
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/5 text-white border-l-2 border-blue-500 shadow-[inset_1px_0_0_0_rgba(255,255,255,0.05)]"
                    : "text-slate-400 hover:bg-white/[0.02] hover:text-white"
                }`}
                id={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Pro Indicator */}
        <div className="p-6 border-t border-white/5 bg-[#0D0D0D]">
          <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-4 border border-blue-500/20 rounded-xl">
            <p className="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-wider">
              Pro Plan
            </p>
            <p className="text-xs mb-3 text-slate-400 font-medium">
              Managing 12 active projects
            </p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
        <AIAssistant />
      </main>
    </div>
  );
}
