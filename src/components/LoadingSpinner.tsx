import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = "md", text = "Cargando..." }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-500`} />
      {text && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
}
