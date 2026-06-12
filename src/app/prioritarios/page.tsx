"use client";

import React, { useState } from "react";
import ChainAccordion from "@/components/ChainAccordion";
import { Search, Filter, AlertTriangle } from "lucide-react";
import ExportButton from "@/components/ExportButton";

// Mock data for demo
const mockCadenas = [
  {
    cadena: "Mayorista Distribución",
    totalDeuda: 1800000,
    clientes: [
      { id: "10", nombre: "Distribución Central", zona: "Centro", diasMora: 15, montoVencido: 1000000, tipo: "Prioritario" as const },
      { id: "11", nombre: "Distribución Sur", zona: "Sur", diasMora: 25, montoVencido: 800000, tipo: "Prioritario" as const },
    ]
  },
  {
    cadena: "Almacenes Unidos",
    totalDeuda: 500000,
    clientes: [
      { id: "12", nombre: "Almacén 1", zona: "Norte", diasMora: 5, montoVencido: 200000, tipo: "Prioritario" as const },
      { id: "13", nombre: "Almacén 2", zona: "Oeste", diasMora: 10, montoVencido: 300000, tipo: "Prioritario" as const },
    ]
  }
];

export default function PrioritariosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Próximos a Vencer (Prioritarios)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Clientes y cadenas con mora hasta 30 días.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton filename="prioritarios_reporte.xlsx" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por cliente o cadena..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtrar</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockCadenas.map((cadena, i) => (
          <ChainAccordion 
            key={i}
            cadena={cadena.cadena}
            totalDeuda={cadena.totalDeuda}
            clientes={cadena.clientes}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
