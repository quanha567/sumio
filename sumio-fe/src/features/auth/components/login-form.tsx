import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Mail } from "lucide-react";

import {
  Alert,
  Button,
  Checkbox,
  customLinkVariants,
  Form,
  PasswordField,
  TextField,
} from "@/components/ui";

import { useLoginForm } from "../hooks/use-login-form";
import { AuthDivider } from "./auth-divider";
import { AuthFooterLink } from "./auth-footer-link";
import { AuthHeader } from "./auth-header";
import { GoogleAuthButton } from "./google-auth-button";

export function LoginForm() {
  const { form, authError, isSubmitting, isGoogleSubmitting, onSubmit, handleGoogleSignIn } =
    useLoginForm();

  const { setValue, watch } = form;
  const rememberMe = watch("rememberMe");

  return (
    <div className="space-y-6">
      <AuthHeader
        title="Welcome back!"
        emoji="👋"
        subtitle="Sign in to continue your financial journey."
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
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          prefix={<Mail className="size-4" />}
        />

        <PasswordField name="password" prefix={<Lock className="size-4" />} />

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            isSelected={rememberMe}
            onValueChange={(checked: boolean) => setValue("rememberMe", checked)}
          >
            Remember me
          </Checkbox>

          <Link
            to="/forgot-password"
            className={customLinkVariants().base({ className: "text-sm" })}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          intent="primary"
          size="lg"
          isDisabled={isSubmitting || isGoogleSubmitting}
          className="mt-2 w-full gap-2"
        >
          <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
          <ArrowRight className="size-4" />
        </Button>
      </Form>

      <AuthDivider />

      <GoogleAuthButton
        isLoading={isGoogleSubmitting}
        disabled={isSubmitting}
        onPress={() => void handleGoogleSignIn()}
      />

      <AuthFooterLink prompt="Don't have an account?" linkLabel="Sign up" to="/register" />
    </div>
  );
}
