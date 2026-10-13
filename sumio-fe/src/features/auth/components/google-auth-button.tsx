import { Button } from "@/components/atoms";

interface GoogleAuthButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
  label?: string;
}

export function GoogleAuthButton({
  isLoading,
  disabled = false,
  onPress,
  label = "Continue with Google",
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      intent="secondary"
      size="lg"
      isDisabled={disabled || isLoading}
      onPress={onPress}
      className="w-full gap-2.5"
    >
      <svg className="size-4" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.36 7.34 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32 0-.83.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
        />
      </svg>
      <span>{isLoading ? "Connecting..." : label}</span>
    </Button>
  );
}
