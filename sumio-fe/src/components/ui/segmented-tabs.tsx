import { Tabs } from "@heroui/react";

export interface SegmentedTab<T extends string> {
  id: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  ariaLabel: string;
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** HeroUI Tabs used purely as a filter control (no panels). */
export function SegmentedTabs<T extends string>({
  ariaLabel,
  tabs,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  return (
    <Tabs
      selectedKey={value}
      onSelectionChange={(key) => {
        const next = tabs.find((t) => t.id === key);
        if (next) onChange(next.id);
      }}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label={ariaLabel}>
          {tabs.map((t) => (
            <Tabs.Tab key={t.id} id={t.id}>
              {t.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
