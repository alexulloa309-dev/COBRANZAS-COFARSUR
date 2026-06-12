"use client";

import React, { useState } from "react";
import { LayoutDashboard, Users, FileText, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mora (> 30 días)", href: "/legales", icon: Users },
    { name: "Próximos a Vencer", href: "/prioritarios", icon: FileText },
    { name: "Reportes", href: "/reportes", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }`}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
