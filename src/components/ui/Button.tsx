"use client";

import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_4px_0_0_#0891b2] active:shadow-[0_0px_0_0_#0891b2] active:translate-y-[4px]",
      secondary: "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_4px_0_0_#7e22ce] active:shadow-[0_0px_0_0_#7e22ce] active:translate-y-[4px]",
      danger: "bg-pink-500 hover:bg-pink-400 text-white shadow-[0_4px_0_0_#be185d] active:shadow-[0_0px_0_0_#be185d] active:translate-y-[4px]",
      ghost: "bg-transparent text-white hover:bg-white/10"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-bold py-3 px-6 rounded-2xl transition-all duration-150 uppercase tracking-widest text-lg btn-squishy",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
