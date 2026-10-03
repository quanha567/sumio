import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:bg-indigo-700 focus-visible:ring-indigo-400",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 focus-visible:ring-slate-400",
  outline:
    "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/60 active:bg-slate-800 focus-visible:ring-slate-400",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white active:bg-slate-800 focus-visible:ring-slate-400",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
  md: "px-4 py-2.5 text-sm font-semibold rounded-xl",
  lg: "px-6 py-3.5 text-base font-semibold rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
