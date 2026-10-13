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

import { type Tone, toneStyles } from "@/components/atoms";
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
  // Income
  salary: createMeta(Banknote, "income"),
  freelance: createMeta(Briefcase, "investment"),
  income: createMeta(Wallet, "income"),

  // Food & Dining
  food: createMeta(Utensils, "expense"),
  dining: createMeta(Utensils, "expense"),
  coffee: createMeta(Coffee, "sand"),
  groceries: createMeta(ShoppingCart, "expense"),

  // Shopping
  shopping: createMeta(ShoppingBag, "sand"),
  laptop: createMeta(Laptop, "accent"),
  electronics: createMeta(Laptop, "accent"),

  // Transport
  transport: createMeta(Bus, "transfer"),
  transit: createMeta(Bus, "transfer"),

  // Entertainment
  entertainment: createMeta(Film, "accent"),
  netflix: createMeta(Film, "accent"),

  // Bills & Utilities & Rent
  bills: createMeta(Receipt, "pending"),
  rent: createMeta(Home, "pending"),
  utilities: createMeta(Zap, "pending"),

  // Health & Fitness
  health: createMeta(Dumbbell, "accent"),
  fitness: createMeta(Dumbbell, "accent"),
  gym: createMeta(Dumbbell, "accent"),

  // Savings
  savings: createMeta(PiggyBank, "sand"),
};

export function getCategoryMeta(
  categoryName: string,
  type: "income" | "expense" = "expense",
): CategoryMeta {
  const normalized = categoryName.toLowerCase().trim();

  for (const [key, meta] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) {
      return meta;
    }
  }

  // Fallbacks by type
  if (type === "income") {
    return createMeta(TrendingUp, "income");
  }

  return createMeta(TrendingDown, "expense");
}

interface CategoryIconProps {
  categoryName: string;
  type?: "income" | "expense";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CategoryIcon({
  categoryName,
  type = "expense",
  className = "",
  size = "md",
}: CategoryIconProps) {
  const meta = getCategoryMeta(categoryName, type);

  return (
    <IconBadge icon={meta.icon} tone={meta.tone} size={size} shape="circle" className={className} />
  );
}
