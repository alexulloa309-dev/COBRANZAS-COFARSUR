"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  badgeColor?: "red" | "blue" | "green" | "yellow";
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  badge,
  badgeColor = "blue",
}: DashboardCardProps) {
  const badgeStyles = {
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    yellow: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{value}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-primary-500 dark:text-primary-400">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        {trend && (
          <div className={`text-sm font-medium ${trendUp ? "text-emerald-500" : "text-rose-500"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
        {badge && (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeStyles[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
