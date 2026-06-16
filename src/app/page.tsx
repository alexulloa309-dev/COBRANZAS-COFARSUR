"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "@/components/DashboardCard";
import { Users, FileText, AlertTriangle, TrendingUp, Upload, Database, CheckCircle, XCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Dashboard real data
  const [stats, setStats] = useState({
    totalVencido: "$0",
    proximosVencer: "$0",
    clientesMora: "0",
    promesas: "0",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Error fetching stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadStatus({
          message: `✅ Datos cargados: ${data.stats.clientes} clientes y ${data.stats.vencimientos} vencimientos procesados.`,
          type: "success",
        });
        // Refresh stats
        fetchStats();
      } else {
        setUploadStatus({
          message: `Error: ${data.error || "No se pudieron procesar los archivos."}`,
          type: "error",
        });
      }
    } catch (err: any) {
      setUploadStatus({
        message: `Error de conexión: ${err.message}`,
        type: "error",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Principal</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen del estado de la cartera y cobranzas.</p>
        </div>

        <div className="flex items-center gap-3">
          <label
            className={`relative flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ${isUploading ? "opacity-75 pointer-events-none" : ""}`}
          >
            {isUploading ? <Database className="w-4 h-4 animate-bounce" /> : <Upload className="w-4 h-4" />}
            <span className="font-medium text-sm">{isUploading ? "Procesando..." : "Subir Excel"}</span>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 ${
            uploadStatus.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
        >
          {uploadStatus.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {uploadStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Vencido"
          value={loadingStats ? "..." : stats.totalVencido}
          icon={AlertTriangle}
          badge="Crítico"
          badgeColor="red"
        />
        <DashboardCard
          title="Próximos a Vencer"
          value={loadingStats ? "..." : stats.proximosVencer}
          icon={TrendingUp}
          badge="Atención"
          badgeColor="yellow"
        />
        <DashboardCard
          title="Clientes en Mora"
          value={loadingStats ? "..." : stats.clientesMora}
          icon={Users}
        />
        <DashboardCard
          title="Promesas de Pago"
          value={loadingStats ? "..." : stats.promesas}
          icon={FileText}
          badge="Total"
          badgeColor="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Instrucciones de Uso</h2>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">1</span>
              <p>Hacé clic en <strong>&quot;Subir Excel&quot;</strong> y seleccioná los dos archivos: <em>Análisis de Clientes</em> e <em>Informe de Crédito Tabulado</em>.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">2</span>
              <p>El sistema cruza los datos automáticamente y los guarda en la base de datos.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">3</span>
              <p>Navegá a <strong>&quot;Mora (&gt; 30 días)&quot;</strong> o <strong>&quot;Próximos a Vencer&quot;</strong> para ver los clientes agrupados por cadena.</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Acciones Rápidas</h2>
          <div className="flex-1 flex flex-col gap-3">
            <button
              onClick={() => router.push("/legales")}
              className="p-4 flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group"
            >
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Ver Legales</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Revisar clientes con mora &gt; 30 días</div>
              </div>
            </button>
            <button
              onClick={() => router.push("/prioritarios")}
              className="p-4 flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group"
            >
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
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
