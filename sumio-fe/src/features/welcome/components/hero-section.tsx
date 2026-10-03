import heroImg from "@/assets/hero.png";
import typescriptLogo from "@/assets/typescript.svg";
import viteLogo from "@/assets/vite.svg";

import type { ResourceLink, TechItem } from "../types";
import { ResourceCard } from "./resource-card";
import { TechStackBadge } from "./tech-stack-badge";

const techStack: TechItem[] = [
  {
    name: "React",
    version: "v19.3",
    description:
      "Next-generation React with Server Components, Actions, and compiler optimizations.",
    category: "core",
  },
  {
    name: "TypeScript",
    version: "v7.0",
    description: "Cutting-edge TypeScript with modern ECMAScript standards and erasable syntax.",
    category: "core",
  },
  {
    name: "TanStack Router",
    version: "v1.170",
    description:
      "Fully type-safe file-based router with built-in search params validation and loader caching.",
    category: "routing",
  },
  {
    name: "Tailwind CSS",
    version: "v4.3",
    description: "Lightning fast CSS-first styling engine with native Vite integration.",
    category: "styling",
  },
  {
    name: "Oxlint & Oxfmt",
    version: "latest",
    description:
      "Rust-powered ultra-fast linter and formatter configured with React 19 & TS rules.",
    category: "tooling",
  },
  {
    name: "Vite+ & Bun",
    version: "unified",
    description: "Unified web toolchain running on high-performance Bun runtime.",
    category: "tooling",
  },
];

const resourceLinks: ResourceLink[] = [
  {
    title: "TanStack Router Guide",
    description: "Learn type-safe file-based routing, nested layouts, search params, and loaders.",
    url: "https://tanstack.com/router/latest",
    badge: "Docs",
  },
  {
    title: "Tailwind CSS v4 Docs",
    description: "Discover the new CSS-first syntax, theme variables, and zero-config pipeline.",
    url: "https://tailwindcss.com/docs",
    badge: "CSS",
  },
  {
    title: "Oxlint / Oxc Ecosystem",
    description: "Explore rules, fast feedback loops, and JavaScript tooling in Rust.",
    url: "https://oxc.rs",
    badge: "Tooling",
  },
  {
    title: "Vite+ Documentation",
    description: "Unified web toolchain commands, bundling options, and runtime guidance.",
    url: "https://viteplus.dev/guide/",
    badge: "Runtime",
  },
];

function HeroBanner() {
  return (
    <div className="relative text-center">
      <div className="relative mb-6 inline-flex items-center justify-center p-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-emerald-500/20 blur-2xl" />
        <div className="relative flex items-center justify-center gap-4">
          <img
            src={heroImg}
            alt="Hero Illustration"
            className="h-24 w-24 object-contain drop-shadow-xl"
          />
          <div className="flex flex-col gap-2">
            <img
              src={viteLogo}
              alt="Vite Logo"
              className="h-9 w-9 drop-shadow-md transition-transform hover:scale-110"
            />
            <img
              src={typescriptLogo}
              alt="TypeScript Logo"
              className="h-9 w-9 drop-shadow-md transition-transform hover:scale-110"
            />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
        Modern Web Stack{" "}
        <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
          sumio-fe
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
        Production-grade starter configured with React 19, TypeScript 7, TanStack Router, Tailwind
        CSS v4, Oxlint, Oxfmt, and feature-driven architecture.
      </p>
    </div>
  );
}

function EcosystemSection() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-wide text-white">Installed Ecosystem</h2>
        <span className="font-mono text-xs text-slate-400">bun + vite-plus</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {techStack.map((item) => (
          <TechStackBadge key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}

function ResourcesSection() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold tracking-wide text-white">Documentation & Resources</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resourceLinks.map((resource) => (
          <ResourceCard key={resource.title} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="space-y-12">
      <HeroBanner />
      <EcosystemSection />
      <ResourcesSection />
    </section>
  );
}
