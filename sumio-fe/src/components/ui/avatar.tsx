import {
  Avatar as HeroUIAvatar,
  AvatarFallback as HeroUIAvatarFallback,
  AvatarImage as HeroUIAvatarImage,
} from "@heroui/react";
import type { ComponentProps } from "react";

export type AvatarProps = ComponentProps<typeof HeroUIAvatar>;
export type AvatarImageProps = ComponentProps<typeof HeroUIAvatarImage>;
export type AvatarFallbackProps = ComponentProps<typeof HeroUIAvatarFallback>;

export function Avatar({ className = "", children, ...props }: AvatarProps) {
  return (
    <HeroUIAvatar
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </HeroUIAvatar>
  );
}

export function AvatarImage({ className = "", ...props }: AvatarImageProps) {
  return (
    <HeroUIAvatarImage
      className={`aspect-square h-full w-full object-cover ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ className = "", children, ...props }: AvatarFallbackProps) {
  return (
    <HeroUIAvatarFallback
      className={`flex h-full w-full items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800 ${className}`}
      {...props}
    >
      {children}
    </HeroUIAvatarFallback>
  );
}
