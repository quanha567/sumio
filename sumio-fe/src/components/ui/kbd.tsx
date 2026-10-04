import { Kbd as HeroUIKbd } from "@heroui/react";
import type { ComponentProps } from "react";

export type KbdProps = ComponentProps<typeof HeroUIKbd>;

export function Kbd(props: KbdProps) {
  return <HeroUIKbd {...props} />;
}
