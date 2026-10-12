import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Component props with optional React children
 */
export type WithChildren<P = object> = P & {
  children?: ReactNode;
};

/**
 * Component props with mandatory React children
 */
export type WithRequiredChildren<P = object> = P & {
  children: ReactNode;
};

/**
 * Component props with optional className string
 */
export type WithClassName<P = object> = P & {
  className?: string;
};

/**
 * Type helper for polymorphic components (`as` prop)
 */
export type PolymorphicProps<T extends ElementType, P = object> = P &
  Omit<ComponentPropsWithoutRef<T>, keyof P> & {
    as?: T;
  };
