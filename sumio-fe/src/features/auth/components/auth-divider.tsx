import { Separator, Text } from "@/components/ui";

export function AuthDivider() {
  return (
    <div className="relative flex items-center justify-center">
      <Separator />
      <Text
        variant="caption"
        weight="medium"
        className="bg-surface absolute px-3 tracking-wider uppercase"
      >
        or
      </Text>
    </div>
  );
}
