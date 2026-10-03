import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700/80 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
