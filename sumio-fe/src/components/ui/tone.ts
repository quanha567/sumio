export type Tone = "accent" | "success" | "danger" | "warning" | "neutral";

/** Static class names (so Tailwind can detect them) for each semantic tone. */
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
  danger: {
    soft: "bg-danger/12",
    text: "text-danger",
    solid: "bg-danger",
    color: "var(--danger)",
  },
  warning: {
    soft: "bg-warning/20",
    text: "text-warning-foreground",
    solid: "bg-warning",
    color: "var(--warning)",
  },
  neutral: {
    soft: "bg-surface-tertiary",
    text: "text-muted",
    solid: "bg-muted",
    color: "var(--muted)",
  },
};
