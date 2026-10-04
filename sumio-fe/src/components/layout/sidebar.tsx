import { Link } from "@tanstack/react-router";

import plantCat from "@/assets/illustrations/sidebar-plant-cat.jpg";
import { Button, ProgressRing } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

import { BrandLogo } from "./brand-logo";
import { navItems } from "./nav-items";

const itemBase =
  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors";

interface SidebarProps {
  /** Monthly saving goal shown in the footer gauge. */
  savingsSaved?: number;
  savingsTarget?: number;
}

export function Sidebar({ savingsSaved = 2040, savingsTarget = 3000 }: SidebarProps) {
  const percent = Math.round((savingsSaved / savingsTarget) * 100);

  return (
    <aside className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-8">
        <BrandLogo className="px-1" />

        <nav className="space-y-1" aria-label="Main">
          {navItems.map(({ id, label, icon: Icon, to }) =>
            to ? (
              <Link
                key={id}
                to={to}
                className={`${itemBase} text-muted hover:bg-surface-secondary hover:text-foreground`}
                activeProps={{
                  className: "!bg-surface-tertiary !text-accent font-semibold",
                }}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            ) : (
              <Button
                key={id}
                variant="ghost"
                isDisabled
                className={`${itemBase} h-auto justify-start`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Button>
            ),
          )}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <img src={plantCat} alt="" className="mx-auto w-36 rounded-2xl" />
          <p className="text-accent mt-2 font-serif text-sm leading-snug italic">
            “Small steps,
            <br />
            make big progress.”
          </p>
        </div>

        <div className="border-border bg-surface flex items-center gap-3 rounded-2xl border p-3">
          <ProgressRing value={percent} ariaLabel="Monthly saving goal">
            {percent}%
          </ProgressRing>
          <div className="min-w-0">
            <p className="text-foreground text-xs font-semibold">Monthly saving goal</p>
            <p className="text-muted text-[11px]">
              {formatCurrency(savingsSaved)} / {formatCurrency(savingsTarget)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
