import logo from "@/assets/brand/logo.png";
import { cn, Heading, Text } from "@/components/ui";

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
        <Heading level={2} className="text-accent text-xl font-extrabold tracking-tight">
          Sumio
        </Heading>
        <Text variant="caption">Better money, brighter days</Text>
      </div>
    </div>
  );
}
