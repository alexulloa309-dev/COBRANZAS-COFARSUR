"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
  endpoint?: string;
  filename?: string;
  className?: string;
}

export default function ExportButton({ endpoint = "/api/export", filename = "reporte.xlsx", className = "" }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation:
      // const response = await fetch(endpoint);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = filename;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500 text-white rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="font-medium">Exportar a Excel</span>
    </button>
  );
}
