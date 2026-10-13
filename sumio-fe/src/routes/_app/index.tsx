import { createFileRoute } from "@tanstack/react-router";

import { useAuth } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/_app/")({
  component: DashboardRouteComponent,
});

function DashboardRouteComponent() {
  const { profile, firebaseUser } = useAuth();
  const userName =
    profile?.displayName ||
    firebaseUser?.displayName ||
    (firebaseUser?.email ? firebaseUser.email.split("@")[0] : "User");

  return <DashboardPage userName={userName} />;
}
