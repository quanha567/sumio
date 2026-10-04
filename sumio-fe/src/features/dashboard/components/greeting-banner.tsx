import { CalendarDays } from "lucide-react";
import { useState } from "react";

import house from "@/assets/illustrations/greeting-house.jpg";
import { Card, Heading, Text } from "@/components/ui";

interface GreetingBannerProps {
  userName: string;
  date?: Date;
}

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingBanner({ userName, date: dateProp }: GreetingBannerProps) {
  const [date] = useState(() => dateProp ?? new Date());
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="animate-entrance relative overflow-hidden p-0">
      <img
        src={house}
        alt=""
        className="absolute inset-y-0 right-0 h-full w-3/5 object-cover object-right"
      />
      <div className="from-surface via-surface/90 absolute inset-0 bg-gradient-to-r to-transparent" />
      <div className="relative flex min-h-36 items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <Heading level={1}>
            {greetingFor(date.getHours())}, {userName}! <span aria-hidden>👋</span>
          </Heading>
          <Text variant="body" className="text-muted mt-1 max-w-sm">
            Here&apos;s your financial overview for today. Keep going!
          </Text>
        </div>
        <div className="border-border bg-surface/90 text-foreground flex shrink-0 items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs font-medium tabular-nums backdrop-blur">
          <CalendarDays className="text-muted h-3.5 w-3.5" />
          {dateLabel}
        </div>
      </div>
    </Card>
  );
}
