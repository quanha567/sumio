import { createRootRoute, Outlet } from "@tanstack/react-router";

import { AuthProvider } from "@/features/auth";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <div className="bg-background text-foreground min-h-screen font-sans antialiased">
        <Outlet />
      </div>
    </AuthProvider>
  );
}
