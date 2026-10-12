import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "./button";
import { TextField, type TextFieldProps } from "./text-field";

export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "suffix"> {
  toggleAriaLabel?: string;
}

export function PasswordField({
  label = "Password",
  placeholder = "Enter your password",
  toggleAriaLabel,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      suffix={
        <Button
          type="button"
          intent="ghost"
          isIconOnly
          size="sm"
          onPress={() => setShowPassword((prev) => !prev)}
          className="text-muted hover:text-foreground size-8"
          excludeFromTabOrder
          aria-label={toggleAriaLabel ?? (showPassword ? "Hide password" : "Show password")}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      }
      {...props}
    />
  );
}
