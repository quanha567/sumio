import logo from "@/assets/brand/logo.png";
import { cn } from "@/components/ui";

interface BrandLogoProps {
  className?: string;
  /** When true, only renders the logo image (for collapsed sidebar). */
  iconOnly?: boolean;
}

export function BrandLogo({ className, iconOnly = false }: BrandLogoProps) {
  if (iconOnly) {
    return (
      <img src={logo} alt="Sumio" className={cn("size-9 rounded-xl object-cover", className)} />
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img src={logo} alt="" className="size-9 rounded-xl object-cover" />
      <div className="leading-tight">
        <p className="text-accent text-xl font-extrabold tracking-tight">Sumio</p>
        <p className="text-muted text-[11px]">Better money, brighter days</p>
      </div>
    </div>
  );
}
