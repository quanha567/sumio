import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Kbd,
  SearchField,
  Text,
} from "@/components/ui";
import { useAuth } from "@/features/auth";

export interface TopbarUser {
  name: string;
  subtitle: string;
  avatarUrl?: string;
}

interface TopbarProps {
  user: TopbarUser;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar({ user }: TopbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      void navigate({ to: "/login" });
    } catch {
      // ignore
    }
  };

  return (
    <header className="flex items-center justify-between gap-4">
      <SearchField aria-label="Search" className="max-w-md flex-1">
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search transactions, categories, or notes..." />
          <Kbd className="mr-2 hidden sm:inline-flex">⌘ K</Kbd>
        </SearchField.Group>
      </SearchField>

      <div className="flex items-center gap-4">
        <Button
          isIconOnly
          variant="outline"
          aria-label="Notifications"
          className="relative rounded-full"
        >
          <Bell className="h-4 w-4" />
          <span className="bg-danger ring-surface absolute top-2 right-2.5 h-2 w-2 rounded-full ring-2" />
        </Button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Avatar className="h-10 w-10">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <Text variant="body" className="text-xs leading-tight font-bold">
              {user.name}
            </Text>
            <Text variant="caption">{user.subtitle}</Text>
          </div>
          <Button
            isIconOnly
            variant="ghost"
            aria-label="Log out"
            title="Log out"
            onClick={() => void handleLogout()}
            className="text-muted hover:text-danger hover:bg-danger/10 cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
