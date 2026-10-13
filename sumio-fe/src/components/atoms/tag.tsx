import { Tag as HeroUITag, TagGroup } from "@heroui/react";

export const Tag = Object.assign(HeroUITag, {
  Group: TagGroup,
});

export {
  TagGroup,
  TagGroupContext,
  TagGroupList,
  TagGroupRoot,
  TagRemoveButton,
  TagRoot,
  tagVariants,
  tagGroupVariants,
} from "@heroui/react";

export type {
  TagGroupProps,
  TagGroupListProps,
  TagGroupRootProps,
  TagRemoveButtonProps,
  TagRootProps,
  TagVariants,
  TagGroupVariants,
} from "@heroui/react";
