import { zodResolver } from "@hookform/resolvers/zod";
import type { Nullable } from "@sumio/common";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";

import { useAuth } from "../context/auth-context";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export interface LoginFormResult {
  form: UseFormReturn<LoginFormData>;
  showPassword: boolean;
  togglePassword: () => void;
  authError: Nullable<string>;
  isSubmitting: boolean;
  isGoogleSubmitting: boolean;
  onSubmit: (data: LoginFormData) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
}

export function useLoginForm(): LoginFormResult {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<Nullable<string>>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        setIsSubmitting(true);
        setAuthError(null);
        await signInWithEmail(data.email, data.password);
        void navigate({ to: "/" });
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
        if (
          msg.includes("user-not-found") ||
          msg.includes("wrong-password") ||
          msg.includes("invalid-credential")
        ) {
          setAuthError("Incorrect email or password. Please check and try again.");
        } else {
          setAuthError(msg);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, signInWithEmail],
  );

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsGoogleSubmitting(true);
      setAuthError(null);
      await signInWithGoogle();
      void navigate({ to: "/" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Google sign-in was cancelled or encountered an error.";
      if (!msg.includes("popup-closed-by-user")) {
        setAuthError(msg);
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [navigate, signInWithGoogle]);

  return {
    form,
    showPassword,
    togglePassword,
    authError,
    isSubmitting,
    isGoogleSubmitting,
    onSubmit,
    handleGoogleSignIn,
  };
}
