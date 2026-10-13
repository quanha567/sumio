import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { Spinner } from "@/components/atoms";
import { RouteErrorBoundary } from "@/components/molecules";
import { AppShell } from "@/components/templates";
import { useAuth } from "@/features/auth";

export const Route = createFileRoute("/_app")({
  component: AppRouteComponent,
  errorComponent: RouteErrorBoundary,
});

function AppRouteComponent() {
  const { firebaseUser, profile, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  const displayName =
    profile?.displayName ||
    firebaseUser?.displayName ||
    (firebaseUser?.email ? firebaseUser.email.split("@")[0] : "User");

  const currentUser = {
    name: displayName,
    subtitle: profile?.email || firebaseUser?.email || "Personal Account",
    avatarUrl: profile?.photoUrl || firebaseUser?.photoURL || undefined,
  };

  return (
    <AppShell user={currentUser} onLogout={logout}>
      <Outlet />
    </AppShell>
  );
}
