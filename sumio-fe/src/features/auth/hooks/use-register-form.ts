import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { AsyncCallback, AsyncVoidFunction, Nullable, VoidFunction } from "@sumio/common";

import { useAuth } from "../context/auth-context";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";

export interface RegisterFormResult {
  form: UseFormReturn<RegisterFormData>;
  showPassword: boolean;
  togglePassword: VoidFunction;
  showConfirmPassword: boolean;
  toggleConfirmPassword: VoidFunction;
  authError: Nullable<string>;
  isSubmitting: boolean;
  isGoogleSubmitting: boolean;
  onSubmit: AsyncCallback<[data: RegisterFormData]>;
  handleSubmit: AsyncCallback<[data: RegisterFormData]>;
  handleGoogleSignIn: AsyncVoidFunction;
}

export function useRegisterForm(): RegisterFormResult {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<Nullable<string>>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      try {
        setIsSubmitting(true);
        setAuthError(null);
        await signUpWithEmail(data.email, data.password, data.displayName);
        void navigate({ to: "/" });
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to create account.";

        if (msg.includes("email-already-in-use")) {
          setAuthError("This email address is already registered. Please sign in instead.");
        } else {
          setAuthError(msg);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate, signUpWithEmail],
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
    showConfirmPassword,
    toggleConfirmPassword,
    authError,
    isSubmitting,
    isGoogleSubmitting,
    onSubmit,
    handleSubmit: onSubmit,
    handleGoogleSignIn,
  };
}
