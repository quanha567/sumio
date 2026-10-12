import type { ReactNode } from "react";
import { useState } from "react";

import { Button, Modal, Spinner, Text } from "@/components/ui";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmIntent?: "danger" | "primary" | "secondary";
  isLoading?: boolean;
  children?: ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  confirmIntent = "danger",
  isLoading: externalIsLoading,
  children,
}: ConfirmModalProps) {
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const isLoading = externalIsLoading ?? internalIsLoading;

  const handleConfirm = async () => {
    try {
      setInternalIsLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setInternalIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} title={title}>
      <div className="flex flex-col gap-4">
        {description && <Text variant="muted">{description}</Text>}

        {children}

        <Modal.Footer>
          <Button
            intent="outline"
            onPress={onClose}
            isDisabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            intent={confirmIntent}
            onPress={handleConfirm}
            isDisabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Spinner size="sm" className="mr-2" />}
            {confirmText}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
