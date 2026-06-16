"use client";

import React, { useState, useEffect } from "react";
import ChainAccordion from "@/components/ChainAccordion";
import { Search, Filter, AlertTriangle, RefreshCw } from "lucide-react";
import ExportButton from "@/components/ExportButton";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PrioritariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cadenas, setCadenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clientes/prioritarios");
      if (!res.ok) throw new Error("Error al cargar los datos");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCadenas(data);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = cadenas.filter((c) =>
    c.cadena.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.clientes.some((cl: any) => cl.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Próximos a Vencer (Prioritarios)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Clientes y cadenas con mora hasta 30 días — {filtered.length} grupo(s) encontrado(s).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <ExportButton filename="prioritarios_reporte.xlsx" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente o cadena..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtrar</span>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Error al cargar los datos</p>
          <p className="text-sm mt-1">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No hay clientes próximos a vencer</p>
          <p className="text-sm mt-1">No se encontraron clientes con mora de hasta 30 días.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((cadena, i) => (
            <ChainAccordion
              key={i}
              cadena={cadena.cadena}
              totalDeuda={cadena.totalDeuda}
              clientes={cadena.clientes}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
