export interface ResourceLink {
  title: string;
  description: string;
  url: string;
  iconName?: string;
  badge?: string;
}

export interface TechItem {
  name: string;
  version: string;
  description: string;
  category: "core" | "routing" | "styling" | "tooling";
}
