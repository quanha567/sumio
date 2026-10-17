import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { AsyncCallback, AsyncVoidFunction, Nullable, VoidFunction } from "@sumio/common";

import { useAuth } from "../context/auth-context";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export interface LoginFormResult {
  form: UseFormReturn<LoginFormData>;
  showPassword: boolean;
  togglePassword: VoidFunction;
  authError: Nullable<string>;
  isSubmitting: boolean;
  isGoogleSubmitting: boolean;
  onSubmit: AsyncCallback<[data: LoginFormData]>;
  handleSubmit: AsyncCallback<[data: LoginFormData]>;
  handleGoogleSignIn: AsyncVoidFunction;
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
      } catch (error: unknown) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to sign in. Please verify your credentials.";

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
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
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
    handleSubmit: onSubmit,
    handleGoogleSignIn,
  };
}
