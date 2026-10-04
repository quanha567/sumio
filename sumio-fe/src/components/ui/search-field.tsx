import { SearchField as HeroUISearchField } from "@heroui/react";
import type { ComponentProps } from "react";

export type SearchFieldProps = ComponentProps<typeof HeroUISearchField>;

function SearchFieldRoot(props: SearchFieldProps) {
  return <HeroUISearchField {...props} />;
}

/** HeroUI SearchField, re-exported with its compound parts. */
export const SearchField = Object.assign(SearchFieldRoot, {
  Group: HeroUISearchField.Group,
  SearchIcon: HeroUISearchField.SearchIcon,
  Input: HeroUISearchField.Input,
  ClearButton: HeroUISearchField.ClearButton,
});
