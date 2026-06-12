"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, Clock, FileText, CheckCircle } from "lucide-react";

export interface Cliente {
  id: string;
  nombre: string;
  zona: string;
  diasMora: number;
  montoVencido: number;
  tipo: "Prioritario" | "Legal";
}

interface ChainAccordionProps {
  cadena: string;
  totalDeuda: number;
  clientes: Cliente[];
  defaultOpen?: boolean;
}

export default function ChainAccordion({ cadena, totalDeuda, clientes, defaultOpen = false }: ChainAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  };

  const isLegal = clientes.some((c) => c.tipo === "Legal");

  return (
    <div className="mb-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isLegal ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"}`}>
            {isLegal ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{cadena || "Cliente Individual"}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{clientes.length} sucursal{clientes.length > 1 ? "es" : ""}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Vencido</div>
            <div className="font-bold text-slate-800 dark:text-white">{formatCurrency(totalDeuda)}</div>
          </div>
          <div className="text-slate-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Cliente</th>
                  <th className="px-4 py-3">Zona</th>
                  <th className="px-4 py-3">Días Mora</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{cliente.nombre}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cliente.zona}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${cliente.diasMora > 30 ? "text-rose-500" : "text-amber-500"}`}>
                        {cliente.diasMora} días
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(cliente.montoVencido)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full border ${
                        cliente.tipo === "Legal" 
                          ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400" 
                          : "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                      }`}>
                        {cliente.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors" title="Ver Detalle">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition-colors" title="Registrar Pago">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
