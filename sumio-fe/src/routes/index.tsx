import { createFileRoute } from "@tanstack/react-router";

import { CounterCard } from "@/features/counter";
import { HeroSection } from "@/features/welcome";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection />
      <div className="border-t border-slate-900 pt-6">
        <CounterCard />
      </div>
    </div>
  );
}
