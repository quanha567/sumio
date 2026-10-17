import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";

import type { AsyncVoidFunction, VoidFunction } from "@sumio/common";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Kbd,
  SearchField,
  Text,
} from "@/components/atoms";
import { AnimatedSidebarTrigger, useAnimatedSidebar } from "@/components/motion/animated-sidebar";

import { useCommandPalette } from "./command-palette-provider";

export interface TopbarUser {
  name: string;
  subtitle: string;
  avatarUrl?: string;
}

interface TopbarProps {
  user: TopbarUser;
  onLogout?: VoidFunction | AsyncVoidFunction;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TopbarSearchField() {
  const { setOpen } = useCommandPalette();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      aria-label="Search or open command palette"
      className="group focus-visible:ring-accent relative cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <SearchField
        aria-label="Search transactions, categories, or notes"
        className="pointer-events-none w-48 sm:w-64 lg:w-72"
      >
        <SearchField.Group className="border-border bg-surface text-muted group-hover:border-border-strong group-hover:bg-surface-secondary h-9 rounded-lg shadow-xs transition-all duration-150">
          <SearchField.SearchIcon className="text-muted group-hover:text-foreground size-4 transition-colors" />
          <SearchField.Input
            placeholder="Search…"
            readOnly
            tabIndex={-1}
            className="text-foreground placeholder:text-muted text-xs"
          />
          <Kbd className="text-muted mr-2 hidden text-[10px] sm:inline-flex">⌘ K</Kbd>
        </SearchField.Group>
      </SearchField>
    </div>
  );
}

export function Topbar({ user, onLogout }: TopbarProps) {
  const navigate = useNavigate();
  const { state } = useAnimatedSidebar();

  const handleLogout = async () => {
    try {
      await onLogout?.();
      void navigate({ to: "/login" });
    } catch {
      // ignore
    }
  };

  return (
    <header className="border-border bg-background sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b px-4 sm:px-6">
      {/* Left: sidebar trigger + search field */}
      <div className="flex items-center gap-2">
        <AnimatedSidebarTrigger
          aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          className="text-muted hover:bg-surface-secondary hover:text-foreground hidden transition-colors lg:inline-flex"
        >
          {/* Animated hamburger icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect y="3" width="16" height="1.5" rx="0.75" fill="currentColor" />
            <rect y="7.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
            <rect y="11.5" width="16" height="1.5" rx="0.75" fill="currentColor" />
          </svg>
        </AnimatedSidebarTrigger>

        <TopbarSearchField />
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-3">
        <Badge.Anchor>
          <Button isIconOnly variant="ghost" size="sm" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Badge intent="danger" size="sm" />
        </Badge.Anchor>

        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col text-left sm:flex">
            <Text variant="label">{user.name}</Text>
            <Text variant="caption">{user.subtitle}</Text>
          </div>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Log out"
            title="Log out"
            onPress={() => void handleLogout()}
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
