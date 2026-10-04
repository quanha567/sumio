import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AuthLayout, useAuth } from "@/features/auth";

export const Route = createFileRoute("/_auth")({
  component: AuthRouteComponent,
});

function AuthRouteComponent() {
  const { firebaseUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && firebaseUser) {
      void navigate({ to: "/" });
    }
  }, [isLoading, firebaseUser, navigate]);

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
