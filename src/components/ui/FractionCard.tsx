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
  return (
    <div className={cn("flex flex-wrap gap-1 w-16 h-16 bg-slate-800 p-1 rounded-md overflow-hidden", className)}>
      {Array.from({ length: denominator }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "flex-1 rounded-sm min-w-[30%] min-h-[30%]", 
            i < numerator ? "bg-cyan-400" : "bg-slate-600"
          )} 
        />
      ))}
    </div>
  );
}
