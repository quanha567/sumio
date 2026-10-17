export type OnChange<T = string> = [T] extends [unknown[]]
  ? (...args: T) => void
  : (value: T) => void;

export type OnValueChange<TValue, TKey = string> = (value: TValue, key?: TKey) => void;

export type OnFieldChange<TName = string, TValue = unknown> = (name: TName, value: TValue) => void;

export type OnSelect<T = string, TItem = unknown> = (value: T, item?: TItem) => void;

export type OnPress<T = void> = (arg: T) => void | Promise<void>;

export interface SelectOption<T = string | number, TIcon = unknown> {
  id: string;
  label: string;
  value?: T;
  disabled?: boolean;
  description?: string;
  icon?: TIcon;
}

export type VoidFunction = () => void;

export type AsyncVoidFunction = () => Promise<void>;

export type Callback<TArgs extends unknown[] = [], TReturn = void> = (...args: TArgs) => TReturn;

export type AsyncCallback<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => Promise<TReturn>;

export type OnPageChange = (page: number) => void;

export type OnToggle = (checked: boolean) => void;
