"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Bell } from "lucide-react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
          Cobranzas<span className="text-primary-500">App</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-300"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 border-2 border-white dark:border-slate-800 shadow-sm"></div>
      </div>
    </header>
  );
}
