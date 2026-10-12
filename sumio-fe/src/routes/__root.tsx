import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/features/auth";
import { queryClient } from "@/lib/query-client";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="bg-background text-foreground min-h-screen font-sans antialiased">
          <Outlet />
        </div>
        <ToastProvider placement="top end" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
