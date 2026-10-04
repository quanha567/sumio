import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AppShell } from "@/components/layout";
import { useAuth } from "@/features/auth";

export const Route = createFileRoute("/_app")({
  component: AppRouteComponent,
});

function AppRouteComponent() {
  const { firebaseUser, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !firebaseUser) {
      void navigate({ to: "/login" });
    }
  }, [isLoading, firebaseUser, navigate]);

  if (isLoading) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <div className="border-accent h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  const currentUser = {
    name: profile?.displayName || firebaseUser?.displayName || "Summer Wells",
    subtitle: profile?.email || firebaseUser?.email || "Personal Account",
    avatarUrl:
      profile?.photoUrl ||
      firebaseUser?.photoURL ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  };

  return (
    <AppShell user={currentUser}>
      <Outlet />
    </AppShell>
  );
}
