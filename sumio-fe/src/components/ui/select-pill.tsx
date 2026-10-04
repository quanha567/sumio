import { ListBox, Select } from "@heroui/react";

export interface SelectOption {
  id: string;
  label: string;
}

interface SelectPillProps {
  ariaLabel: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Compact HeroUI Select used in card headers (e.g. "This month"). */
export function SelectPill({ ariaLabel, options, value, onChange, className }: SelectPillProps) {
  return (
    <Select
      aria-label={ariaLabel}
      variant="secondary"
      className={className ?? "w-32"}
      value={value}
      onChange={(key) => {
        if (key !== null) onChange(String(key));
      }}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((o) => (
            <ListBox.Item key={o.id} id={o.id} textValue={o.label}>
              {o.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
