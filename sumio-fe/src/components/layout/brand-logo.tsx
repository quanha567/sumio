import { cn } from "@heroui/react";

import logo from "@/assets/brand/logo.png";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img src={logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
      <div className="leading-tight">
        <p className="text-accent text-xl font-extrabold tracking-tight">Sumio</p>
        <p className="text-muted text-[11px]">Better money, brighter days</p>
      </div>
    </div>
  );
}
