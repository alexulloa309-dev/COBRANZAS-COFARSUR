"use client";

import React, { useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Users, FileText, AlertTriangle, TrendingUp, Upload, Database } from "lucide-react";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus("Procesando archivos...");
    
    // Simulate upload and processing time
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus("Datos actualizados correctamente.");
      setTimeout(() => setUploadStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Principal</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen del estado de la cartera y cobranzas.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className={`relative flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}>
            {isUploading ? <Database className="w-4 h-4 animate-bounce" /> : <Upload className="w-4 h-4" />}
            <span className="font-medium text-sm">{isUploading ? "Cargando..." : "Subir Excel"}</span>
            <input type="file" multiple accept=".xlsx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          {uploadStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Vencido" 
          value="$14.8M" 
          icon={AlertTriangle} 
          trend="2.5%" 
          trendUp={false} 
          badge="Crítico" 
          badgeColor="red" 
        />
        <DashboardCard 
          title="Próximos a Vencer" 
          value="$5.2M" 
          icon={TrendingUp} 
          trend="1.2%" 
          trendUp={true} 
          badge="Atención" 
          badgeColor="yellow" 
        />
        <DashboardCard 
          title="Clientes en Mora" 
          value="342" 
          icon={Users} 
        />
        <DashboardCard 
          title="Promesas de Pago" 
          value="89" 
          icon={FileText} 
          trend="12" 
          trendUp={true} 
          badge="Hoy" 
          badgeColor="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Evolución de Cobranzas</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500">
            [Gráfico de Recharts iría aquí]
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Acciones Rápidas</h2>
          <div className="flex-1 flex flex-col gap-3">
            <button className="p-4 flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Ver Legales</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Revisar clientes con mora &gt; 30 días</div>
              </div>
            </button>
            <button className="p-4 flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Próximos Vencimientos</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestionar clientes &lt;= 30 días</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
