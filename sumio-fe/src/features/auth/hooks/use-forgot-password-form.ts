import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { AsyncCallback, Nullable } from "@sumio/common";

import { useAuth } from "../context/auth-context";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";

export interface ForgotPasswordFormResult {
  form: UseFormReturn<ForgotPasswordFormData>;
  authError: Nullable<string>;
  isSubmitting: boolean;
  isSuccess: boolean;
  sentEmail: string;
  onSubmit: AsyncCallback<[data: ForgotPasswordFormData]>;
  handleSubmit: AsyncCallback<[data: ForgotPasswordFormData]>;
}

export function useForgotPasswordForm(): ForgotPasswordFormResult {
  const { resetPassword } = useAuth();
  const [authError, setAuthError] = useState<Nullable<string>>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setIsSubmitting(true);
        setAuthError(null);
        await resetPassword(data.email);
        setSentEmail(data.email);
        setIsSuccess(true);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to send reset email.";

        if (msg.includes("user-not-found")) {
          setAuthError("No account found with this email address.");
        } else {
          setAuthError(msg);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [resetPassword],
  );

  return {
    form,
    authError,
    isSubmitting,
    isSuccess,
    sentEmail,
    onSubmit,
    handleSubmit: onSubmit,
  };
}
