"use client";

import React, { useState } from "react";
import ChainAccordion, { Cliente } from "@/components/ChainAccordion";
import { Search, Filter, AlertOctagon } from "lucide-react";
import ExportButton from "@/components/ExportButton";

// Mock data for demo
const mockCadenas = [
  {
    cadena: "Supermercados El Sol",
    totalDeuda: 4500000,
    clientes: [
      { id: "1", nombre: "El Sol Sucursal Centro", zona: "Capital", diasMora: 45, montoVencido: 2000000, tipo: "Legal" as const },
      { id: "2", nombre: "El Sol Sucursal Norte", zona: "Norte", diasMora: 60, montoVencido: 2500000, tipo: "Legal" as const },
    ]
  },
  {
    cadena: "Farmacias Salud",
    totalDeuda: 1200000,
    clientes: [
      { id: "3", nombre: "Farmacia Salud 1", zona: "Sur", diasMora: 35, montoVencido: 1200000, tipo: "Legal" as const },
    ]
  },
  {
    cadena: "Kiosco Roberto (Individual)",
    totalDeuda: 350000,
    clientes: [
      { id: "4", nombre: "Kiosco Roberto", zona: "Oeste", diasMora: 90, montoVencido: 350000, tipo: "Legal" as const },
    ]
  }
];

export default function LegalesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-500" />
            Cartera en Legales
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Clientes y cadenas con mora mayor a 30 días.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton filename="legales_reporte.xlsx" />
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
