import { ArrowRight, Lock, Mail, User } from "lucide-react";

import { Alert, Button, Form, PasswordField, TextField } from "@/components/ui";

import { useRegisterForm } from "../hooks/use-register-form";
import { AuthDivider } from "./auth-divider";
import { AuthFooterLink } from "./auth-footer-link";
import { AuthHeader } from "./auth-header";
import { GoogleAuthButton } from "./google-auth-button";

export function RegisterForm() {
  const { form, authError, isSubmitting, isGoogleSubmitting, onSubmit, handleGoogleSignIn } =
    useRegisterForm();

  return (
    <div className="space-y-6">
      <AuthHeader
        title="Create account"
        emoji="🌱"
        subtitle="Start your journey to financial freedom today."
      />

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
          name="displayName"
          type="text"
          label="Full name"
          placeholder="Summer Wells"
          prefix={<User className="size-4" />}
        />

        <TextField
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          prefix={<Mail className="size-4" />}
        />

        <PasswordField
          name="password"
          label="Password (min 8 characters)"
          placeholder="Create a strong password"
          prefix={<Lock className="size-4" />}
        />

        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          prefix={<Lock className="size-4" />}
        />

        <Button
          type="submit"
          intent="primary"
          size="lg"
          isDisabled={isSubmitting || isGoogleSubmitting}
          className="mt-3 w-full gap-2"
        >
          <span>{isSubmitting ? "Creating account..." : "Sign up"}</span>
          <ArrowRight className="size-4" />
        </Button>
      </Form>

      <AuthDivider />

      <GoogleAuthButton
        isLoading={isGoogleSubmitting}
        disabled={isSubmitting}
        onPress={() => void handleGoogleSignIn()}
      />

      <AuthFooterLink prompt="Already have an account?" linkLabel="Sign in" to="/login" />
    </div>
  );
}
