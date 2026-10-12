import {
  Description,
  DescriptionRoot,
  descriptionVariants,
  FieldError,
  FieldErrorRoot,
  fieldErrorVariants,
  FieldGroup,
  type FieldGroupProps,
  Fieldset,
  FieldsetActions,
  type FieldsetActionsProps,
  FieldsetLegend,
  type FieldsetLegendProps,
  type FieldsetProps,
  FieldsetRoot,
  fieldsetVariants,
  Form as HeroUIForm,
  FormRoot,
  Label,
  LabelRoot,
  labelVariants,
  type DescriptionProps,
  type FieldErrorProps,
  type FormProps as HeroUIFormProps,
  type LabelProps,
} from "@heroui/react";
import type { BaseSyntheticEvent, ComponentPropsWithRef, ReactNode } from "react";
import {
  type FieldValues,
  FormProvider,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";

export interface FormProps<T extends FieldValues = FieldValues> extends Omit<
  ComponentPropsWithRef<typeof HeroUIForm>,
  "onSubmit"
> {
  form?: UseFormReturn<T>;
  onSubmit?: (data: T, event?: BaseSyntheticEvent) => void | Promise<void>;
  children: ReactNode;
}

export function Form<T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<T>) {
  const handleSubmit = form && onSubmit ? form.handleSubmit(onSubmit) : undefined;

  const content = (
    <HeroUIForm onSubmit={handleSubmit} {...props}>
      {children}
    </HeroUIForm>
  );

  if (form) {
    return <FormProvider {...form}>{content}</FormProvider>;
  }

  return content;
}

export const FormComponent = Object.assign(Form, {
  Root: FormRoot,
  Fieldset,
  Legend: FieldsetLegend,
  Actions: FieldsetActions,
  Group: FieldGroup,
  Error: FieldError,
  Label,
  Description,
});

export {
  FormComponent as FormRootComponent,
  FormRoot,
  Fieldset,
  FieldsetRoot,
  FieldsetLegend,
  FieldsetActions,
  FieldGroup,
  FieldError,
  FieldErrorRoot,
  Label,
  LabelRoot,
  Description,
  DescriptionRoot,
  FormProvider,
  useFormContext,
  fieldsetVariants,
  fieldErrorVariants,
  labelVariants,
  descriptionVariants,
};
export type {
  HeroUIFormProps,
  FieldsetProps,
  FieldsetLegendProps,
  FieldsetActionsProps,
  FieldGroupProps,
  FieldErrorProps,
  DescriptionProps,
  LabelProps,
  UseFormReturn,
};
