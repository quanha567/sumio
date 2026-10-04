import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppShell } from "@/components/layout";

/** Mock until auth exists. */
export const currentUser = {
  name: "Summer Wells",
  subtitle: "Personal Account",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
};

export const Route = createFileRoute("/_app")({
  component: () => (
    <AppShell user={currentUser}>
      <Outlet />
    </AppShell>
  ),
});
