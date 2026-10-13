import { Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Mail } from "lucide-react";

import {
  Alert,
  Button,
  Checkbox,
  Form,
  Heading,
  linkStyles,
  PasswordField,
  Separator,
  Text,
  TextField,
} from "@/components/ui";

import { useLoginForm } from "../hooks/use-login-form";
import { GoogleAuthButton } from "./google-auth-button";

export function LoginForm() {
  const { form, authError, isSubmitting, isGoogleSubmitting, onSubmit, handleGoogleSignIn } =
    useLoginForm();

  const { setValue, watch } = form;
  const rememberMe = watch("rememberMe");

  return (
    <div className="space-y-6">
      <div>
        <Heading level={1}>Welcome back! 👋</Heading>
        <Text variant="muted" size="sm" className="mt-1.5">
          Sign in to continue your financial journey.
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

        <PasswordField name="password" prefix={<Lock className="size-4" />} />

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            isSelected={rememberMe}
            onValueChange={(checked: boolean) => setValue("rememberMe", checked)}
          >
            Remember me
          </Checkbox>

          <Link to="/forgot-password" className={linkStyles()}>
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

      <Separator label="or" />

      <GoogleAuthButton
        isLoading={isGoogleSubmitting}
        disabled={isSubmitting}
        onPress={() => void handleGoogleSignIn()}
      />

      <Text variant="muted" size="sm" className="text-center">
        Don&apos;t have an account?{" "}
        <Link to="/register" className={linkStyles()}>
          Sign up
        </Link>
      </Text>
    </div>
  );
}
