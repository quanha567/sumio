import { createFileRoute } from "@tanstack/react-router";

import { RouteErrorBoundary } from "@/components/molecules";
import { useAuth } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";

export const Route = createFileRoute("/_app/")({
  component: DashboardRouteComponent,
  errorComponent: RouteErrorBoundary,
});

function DashboardRouteComponent() {
  const { profile, firebaseUser } = useAuth();
  const userName =
    profile?.displayName ||
    firebaseUser?.displayName ||
    (firebaseUser?.email ? firebaseUser.email.split("@")[0] : "User");

  return <DashboardPage userName={userName} />;
}
