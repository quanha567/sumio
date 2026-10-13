export type Tone =
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "neutral"
  | "income"
  | "expense"
  | "pending"
  | "transfer"
  | "investment"
  | "sand";

export type HeroUIColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "accent";

export type UnifiedColor = HeroUIColor | Tone;

export function mapUnifiedColor(
  color?: UnifiedColor,
): "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined {
  if (!color) return undefined;
  if (color === "accent" || color === "investment") return "primary";
  if (color === "neutral") return "default";
  if (color === "income") return "success";
  if (color === "expense") return "danger";
  if (color === "pending") return "warning";
  if (color === "transfer") return "secondary";
  if (color === "sand") return "warning";
  if (
    color === "primary" ||
    color === "secondary" ||
    color === "success" ||
    color === "warning" ||
    color === "danger" ||
    color === "default"
  ) {
    return color;
  }
  return undefined;
}

export function mapComponentColor(
  color?: UnifiedColor,
): "accent" | "danger" | "default" | "success" | "warning" | undefined {
  if (!color) return undefined;
  if (color === "primary" || color === "accent" || color === "investment") return "accent";
  if (color === "neutral" || color === "default" || color === "secondary" || color === "transfer")
    return "default";
  if (color === "income") return "success";
  if (color === "expense") return "danger";
  if (color === "pending" || color === "sand") return "warning";
  return color as "danger" | "success" | "warning";
}

export function mapProgressColor(
  color?: UnifiedColor,
): "accent" | "danger" | "default" | "success" | "warning" | undefined {
  return mapComponentColor(color);
}

export function mapSpinnerColor(
  color?: UnifiedColor,
): "accent" | "current" | "danger" | "success" | "warning" | undefined {
  if (!color) return undefined;
  if (color === "primary" || color === "accent" || color === "investment") return "accent";
  if (color === "neutral" || color === "default" || color === "secondary" || color === "transfer")
    return "current";
  if (color === "income") return "success";
  if (color === "expense") return "danger";
  if (color === "pending" || color === "sand") return "warning";
  return color as "danger" | "success" | "warning";
}

/** Static class names for each semantic tone according to Sage & Forest tokens. */
export const toneStyles: Record<
  Tone,
  { soft: string; text: string; solid: string; color: string }
> = {
  accent: {
    soft: "bg-accent/12",
    text: "text-accent",
    solid: "bg-accent",
    color: "var(--accent)",
  },
  success: {
    soft: "bg-success/12",
    text: "text-success",
    solid: "bg-success",
    color: "var(--success)",
  },
  income: {
    soft: "bg-success/12",
    text: "text-finance-income",
    solid: "bg-finance-income",
    color: "var(--finance-income)",
  },
  danger: {
    soft: "bg-danger/12",
    text: "text-danger",
    solid: "bg-danger",
    color: "var(--danger)",
  },
  expense: {
    soft: "bg-danger/12",
    text: "text-finance-expense",
    solid: "bg-finance-expense",
    color: "var(--finance-expense)",
  },
  warning: {
    soft: "bg-warning/20",
    text: "text-warning",
    solid: "bg-warning",
    color: "var(--warning)",
  },
  pending: {
    soft: "bg-warning/20",
    text: "text-finance-pending",
    solid: "bg-finance-pending",
    color: "var(--finance-pending)",
  },
  transfer: {
    soft: "bg-info/12",
    text: "text-finance-transfer",
    solid: "bg-finance-transfer",
    color: "var(--finance-transfer)",
  },
  investment: {
    soft: "bg-accent/12",
    text: "text-finance-investment",
    solid: "bg-finance-investment",
    color: "var(--finance-investment)",
  },
  sand: {
    soft: "bg-sand/15",
    text: "text-sand",
    solid: "bg-sand",
    color: "var(--sand-500)",
  },
  neutral: {
    soft: "bg-surface-secondary",
    text: "text-muted",
    solid: "bg-muted",
    color: "var(--muted)",
  },
};
