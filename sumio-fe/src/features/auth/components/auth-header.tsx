import { Heading, Text } from "@/components/ui";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  emoji?: string;
}

export function AuthHeader({ title, subtitle, emoji }: AuthHeaderProps) {
  return (
    <div>
      <Heading level={1}>
        {title}
        {emoji ? ` ${emoji}` : ""}
      </Heading>
      <Text variant="muted" size="sm" className="mt-1.5">
        {subtitle}
      </Text>
    </div>
  );
}
