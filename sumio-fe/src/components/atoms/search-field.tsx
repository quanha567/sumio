import {
  SearchField as HeroUISearchField,
  SearchFieldClearButton as HeroUISearchFieldClearButton,
  SearchFieldGroup as HeroUISearchFieldGroup,
  SearchFieldInput as HeroUISearchFieldInput,
  SearchFieldRoot as HeroUISearchFieldRoot,
  SearchFieldSearchIcon as HeroUISearchFieldSearchIcon,
  type SearchFieldClearButtonProps,
  type SearchFieldGroupProps,
  type SearchFieldInputProps,
  type SearchFieldRootProps,
  type SearchFieldSearchIconProps,
} from "@heroui/react";
import { searchFieldVariants, type VariantProps } from "@heroui/styles";
import { useImperativeHandle, useRef } from "react";
import type { ComponentProps, Ref } from "react";

import type { VoidFunction } from "@sumio/common";

import { cn } from "./cn";

export interface SearchFieldHandle {
  focus: VoidFunction;
  clear: VoidFunction;
}

interface SearchFieldGroupWrapperProps extends SearchFieldGroupProps {
  className?: string;
}

function SearchFieldGroupWrapper({ className, ...props }: SearchFieldGroupWrapperProps) {
  return (
    <HeroUISearchFieldGroup
      className={cn(
        "border-border bg-surface text-foreground shadow-xs focus-within:border-accent relative inline-flex min-h-10 sm:min-h-9 items-center overflow-hidden rounded-md border transition-colors",
        className,
      )}
      {...props}
    />
  );
}

interface SearchFieldInputWrapperProps extends SearchFieldInputProps {
  inputRef?: Ref<HTMLInputElement>;
}

function SearchFieldInputWrapper({ className, inputRef, ...props }: SearchFieldInputWrapperProps) {
  return (
    <HeroUISearchFieldInput
      ref={inputRef}
      className={cn(
        "border-0 bg-transparent text-foreground placeholder:text-muted shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 px-2 text-base sm:text-sm flex-1 min-w-0",
        className,
      )}
      {...props}
    />
  );
}

export interface SearchFieldProps extends Omit<ComponentProps<typeof HeroUISearchField>, "ref"> {
  placeholder?: string;
  ref?: Ref<SearchFieldHandle>;
}

function BaseSearchField({ children, placeholder, className, ref, ...props }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        if (inputRef.current) inputRef.current.value = "";
      },
    }),
    [],
  );

  if (children) {
    return (
      <HeroUISearchField className={className} {...props}>
        {children}
      </HeroUISearchField>
    );
  }

  return (
    <HeroUISearchField className={className} {...props}>
      <SearchFieldGroupWrapper>
        <HeroUISearchFieldSearchIcon />
        <SearchFieldInputWrapper inputRef={inputRef} placeholder={placeholder} />
        <HeroUISearchFieldClearButton />
      </SearchFieldGroupWrapper>
    </HeroUISearchField>
  );
}

export const SearchField = Object.assign(BaseSearchField, {
  Root: HeroUISearchFieldRoot,
  Group: SearchFieldGroupWrapper,
  Input: SearchFieldInputWrapper,
  SearchIcon: HeroUISearchFieldSearchIcon,
  ClearButton: HeroUISearchFieldClearButton,
});

export {
  HeroUISearchFieldRoot as SearchFieldRoot,
  SearchFieldGroupWrapper as SearchFieldGroup,
  SearchFieldInputWrapper as SearchFieldInput,
  HeroUISearchFieldSearchIcon as SearchFieldSearchIcon,
  HeroUISearchFieldClearButton as SearchFieldClearButton,
  searchFieldVariants,
};

export type {
  SearchFieldRootProps,
  SearchFieldGroupProps,
  SearchFieldInputProps,
  SearchFieldSearchIconProps,
  SearchFieldClearButtonProps,
};

export type CustomSearchFieldVariants = VariantProps<typeof searchFieldVariants>;
export type { CustomSearchFieldVariants as SearchFieldVariants };
