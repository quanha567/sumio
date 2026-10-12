import { Link } from "@tanstack/react-router";

import { customLinkVariants, Text } from "@/components/ui";

interface AuthFooterLinkProps {
  prompt: string;
  linkLabel: string;
  to: string;
}

export function AuthFooterLink({ prompt, linkLabel, to }: AuthFooterLinkProps) {
  return (
    <Text variant="muted" size="sm" className="text-center">
      {prompt}{" "}
      <Link to={to} className={customLinkVariants().base()}>
        {linkLabel}
      </Link>
    </Text>
  );
}
