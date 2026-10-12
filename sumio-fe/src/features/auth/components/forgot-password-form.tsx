import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { Alert, Button, Form, Heading, Text, TextField } from "@/components/ui";

import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";
import { ForgotPasswordSuccess } from "./forgot-password-success";

export function ForgotPasswordForm() {
  const { form, authError, isSubmitting, isSuccess, sentEmail, onSubmit } = useForgotPasswordForm();

  if (isSuccess) {
    return <ForgotPasswordSuccess email={sentEmail} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading level={1}>Reset password 🔑</Heading>
        <Text variant="muted" size="sm" className="mt-1.5">
          Enter your registered email and we&apos;ll send you instructions to reset your password.
        </Text>
      </div>

      {authError && (
        <Alert intent="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{authError}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <TextField
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          prefix={<Mail className="size-4" />}
        />

        <Button
          type="submit"
          intent="primary"
          size="lg"
          isDisabled={isSubmitting}
          className="mt-2 w-full gap-2"
        >
          <span>{isSubmitting ? "Sending reset link..." : "Send reset link"}</span>
          <ArrowRight className="size-4" />
        </Button>
      </Form>

      <div className="pt-2 text-center">
        <Link
          to="/login"
          className="text-muted hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Remember your password? Sign in</span>
        </Link>
      </div>
    </div>
  );
}
