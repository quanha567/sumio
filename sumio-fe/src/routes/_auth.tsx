import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { RouteErrorBoundary } from "@/components/molecules";
import { AuthLayout, useAuth } from "@/features/auth";

export const Route = createFileRoute("/_auth")({
  component: AuthRouteComponent,
  errorComponent: RouteErrorBoundary,
});

function AuthRouteComponent(): React.JSX.Element {
  const { firebaseUser, isLoading } = useAuth();

  if (!isLoading && firebaseUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
