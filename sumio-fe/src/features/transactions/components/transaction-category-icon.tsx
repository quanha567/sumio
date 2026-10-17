import {
  Banknote,
  Briefcase,
  Bus,
  Coffee,
  Dumbbell,
  Film,
  Home,
  Laptop,
  PiggyBank,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Utensils,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { TransactionType } from "@sumio/contract";

import { toneStyles, type Tone } from "@/components/atoms";
import { IconBadge } from "@/components/molecules";

export interface CategoryMeta {
  icon: LucideIcon;
  tone: Tone;
  chartColor: string;
}

function createMeta(icon: LucideIcon, tone: Tone): CategoryMeta {
  const style = toneStyles[tone];

  return {
    icon,
    tone,
    chartColor: style.color,
  };
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  salary: createMeta(Banknote, "income"),
  freelance: createMeta(Briefcase, "investment"),
  income: createMeta(Wallet, "income"),

  food: createMeta(Utensils, "expense"),
  dining: createMeta(Utensils, "expense"),
  coffee: createMeta(Coffee, "sand"),
  groceries: createMeta(ShoppingCart, "expense"),

  shopping: createMeta(ShoppingBag, "sand"),
  laptop: createMeta(Laptop, "accent"),
  electronics: createMeta(Laptop, "accent"),

  transport: createMeta(Bus, "transfer"),
  transit: createMeta(Bus, "transfer"),

  entertainment: createMeta(Film, "accent"),
  netflix: createMeta(Film, "accent"),

  bills: createMeta(Receipt, "pending"),
  rent: createMeta(Home, "pending"),
  utilities: createMeta(Zap, "pending"),

  health: createMeta(Dumbbell, "accent"),
  fitness: createMeta(Dumbbell, "accent"),
  gym: createMeta(Dumbbell, "accent"),

  savings: createMeta(PiggyBank, "sand"),
};

export function getCategoryMeta(
  categoryName: string,
  type: TransactionType = "expense",
): CategoryMeta {
  const normalized = categoryName.toLowerCase().trim();

  for (const [key, meta] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) {
      return meta;
    }
  }

  if (type === "income") {
    return createMeta(TrendingUp, "income");
  }

  return createMeta(TrendingDown, "expense");
}

interface CategoryIconProps {
  categoryName: string;
  type?: TransactionType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CategoryIcon({
  categoryName,
  type = "expense",
  className = "",
  size = "md",
}: CategoryIconProps): React.JSX.Element {
  const meta = getCategoryMeta(categoryName, type);

  return (
    <IconBadge icon={meta.icon} tone={meta.tone} size={size} shape="circle" className={className} />
  );
}
