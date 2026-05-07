"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface FractionCardProps {
  numerator: number;
  denominator: number;
  className?: string;
}

export function FractionCard({ numerator, denominator, className }: FractionCardProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center font-bold text-3xl", className)}>
      <span className="border-b-4 border-current px-2 pb-1 leading-none">{numerator}</span>
      <span className="px-2 pt-1 leading-none">{denominator}</span>
    </div>
  );
}

export function VisualFraction({ numerator, denominator, className }: FractionCardProps) {
  // Elegir columnas de forma que el grid se vea ordenado
  const cols = denominator % 3 === 0 ? 3 : 2;

  return (
    <div 
      className={cn("grid gap-1 w-16 h-16 bg-slate-800 p-1.5 rounded-md overflow-hidden", className)}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: "1fr"
      }}
    >
      {Array.from({ length: denominator }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "rounded-sm min-h-[10px]", 
            i < numerator ? "bg-cyan-400" : "bg-slate-600"
          )} 
        />
      ))}
    </div>
  );
}
