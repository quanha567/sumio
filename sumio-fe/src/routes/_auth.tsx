import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AuthLayout, useAuth } from "@/features/auth";

export const Route = createFileRoute("/_auth")({
  component: AuthRouteComponent,
});

function AuthRouteComponent() {
  const { firebaseUser, isLoading } = useAuth();

  if (!isLoading && firebaseUser) {
    redirect({ to: "/" });
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
