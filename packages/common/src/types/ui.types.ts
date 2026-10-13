export type OnChange<T = string> = (value: T) => void;

export type OnPress<T = void> = (arg: T) => void | Promise<void>;

export interface SelectOption<T = string | number, TIcon = unknown> {
  id: string;
  label: string;
  value?: T;
  disabled?: boolean;
  description?: string;
  icon?: TIcon;
}

export type Callback<TArgs extends unknown[] = [], TReturn = void> = (...args: TArgs) => TReturn;

export type AsyncCallback<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => Promise<TReturn>;

export type OnPageChange = (page: number) => void;

export type OnToggle = (checked: boolean) => void;
