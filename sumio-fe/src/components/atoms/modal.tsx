import {
  Modal as HeroUIModal,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalIcon,
  ModalRoot,
  ModalTrigger,
} from "@heroui/react";
import { modalVariants, type VariantProps } from "@heroui/styles";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "./cn";

export interface ModalProps extends ComponentProps<typeof HeroUIModal> {
  title?: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "cover" | "full";
  placement?: "auto" | "center" | "top" | "bottom";
  backdropVariant?: "opaque" | "blur" | "transparent";
}

function BaseModal({
  children,
  title,
  className,
  isOpen,
  onOpenChange,
  size = "md",
  placement = "center",
  backdropVariant = "blur",
  ...props
}: ModalProps) {
  if (title !== undefined) {
    return (
      <HeroUIModal.Root isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
        <HeroUIModal.Backdrop variant={backdropVariant}>
          <HeroUIModal.Container placement={placement} size={size}>
            <HeroUIModal.Dialog className={className}>
              <HeroUIModal.Header>
                <HeroUIModal.Heading>{title}</HeroUIModal.Heading>
                <HeroUIModal.CloseTrigger />
              </HeroUIModal.Header>
              <HeroUIModal.Body>{children}</HeroUIModal.Body>
            </HeroUIModal.Dialog>
          </HeroUIModal.Container>
        </HeroUIModal.Backdrop>
      </HeroUIModal.Root>
    );
  }

  return (
    <HeroUIModal.Root isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      {children}
    </HeroUIModal.Root>
  );
}

export function ModalFooterWrapper({ className, ...props }: ComponentProps<typeof ModalFooter>) {
  return (
    <ModalFooter
      className={cn(
        "border-t border-border/60 mt-2 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3",
        className,
      )}
      {...props}
    />
  );
}

export const customModalVariants = modalVariants;
export type CustomModalVariants = VariantProps<typeof modalVariants>;
export type ModalVariants = CustomModalVariants;

export const Modal = Object.assign(BaseModal, HeroUIModal, {
  Footer: ModalFooterWrapper,
});

export {
  ModalRoot,
  ModalTrigger,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooterWrapper as ModalFooter,
  ModalCloseTrigger,
  ModalIcon,
};
export type {
  ModalRootProps,
  ModalTriggerProps,
  ModalBackdropProps,
  ModalContainerProps,
  ModalDialogProps,
  ModalHeaderProps,
  ModalHeadingProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseTriggerProps,
  ModalIconProps,
} from "@heroui/react";
export { modalVariants } from "@heroui/styles";
