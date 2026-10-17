import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button, Heading, Text } from "@/components/atoms";
import { IconBadge } from "@/components/molecules";

interface ForgotPasswordSuccessProps {
  email: string;
}

export function ForgotPasswordSuccess({ email }: ForgotPasswordSuccessProps): React.JSX.Element {
  return (
    <div className="animate-entrance space-y-6 text-center">
      <IconBadge icon={CheckCircle2} tone="success" size="lg" shape="square" className="mx-auto" />

      <div className="space-y-2">
        <Heading level={1}>Check your inbox</Heading>
        <Text variant="muted" size="sm">
          We have sent a password reset link to{" "}
          <Text as="span" variant="body" weight="semibold">
            {email}
          </Text>
          . Please follow the instructions in the email.
        </Text>
      </div>

      <Link to="/login" className="block w-full">
        <Button type="button" intent="primary" size="lg" className="w-full gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to sign in</span>
        </Button>
      </Link>
    </div>
  );
}
