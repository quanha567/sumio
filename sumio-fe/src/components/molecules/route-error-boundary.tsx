import type { ErrorComponentProps } from "@tanstack/react-router";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button, Card, Heading, Text } from "@/components/atoms";

export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-6">
      <Card intent="raised" padding="lg" className="max-w-md text-center">
        <div className="bg-danger-subtle text-danger mx-auto mb-4 grid size-12 place-items-center rounded-xl">
          <AlertCircle className="size-6" />
        </div>

        <Heading level={2}>Something went wrong</Heading>

        <div className="mt-2">
          <Text variant="muted" size="sm">
            {message}
          </Text>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Button intent="outline" size="sm" onPress={() => window.location.reload()}>
            Reload Page
          </Button>

          {reset && (
            <Button intent="primary" size="sm" onPress={reset} className="gap-1.5">
              <RefreshCw className="size-3.5" />
              <span>Try Again</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
