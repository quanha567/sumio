import { CalendarDays } from "lucide-react";
import { useState } from "react";

import clayHero from "@/assets/illustrations/dashboard-clay-hero.jpg";
import { Card, Chip, Heading, Text } from "@/components/atoms";

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
    <Card padding="none" className="animate-entrance relative overflow-hidden">
      <img
        src={clayHero}
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-2/5 object-cover object-center opacity-90 sm:w-1/3"
      />
      <div className="from-surface via-surface/85 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent" />
      <Card.Content className="relative flex min-h-24 items-center justify-between gap-4 p-4 sm:min-h-28 sm:p-5">
        <div className="max-w-md">
          <Heading level={1}>
            {greetingFor(date.getHours())}, {userName}! <span aria-hidden>👋</span>
          </Heading>
          <div className="mt-0.5">
            <Text variant="muted">Here&apos;s your financial overview for today.</Text>
          </div>
        </div>
        <Chip intent="default" className="self-center">
          <CalendarDays className="size-3.5" />
          <span className="tabular-nums">{dateLabel}</span>
        </Chip>
      </Card.Content>
    </Card>
  );
}
