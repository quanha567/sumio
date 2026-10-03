export function GreetingBanner() {
  return (
    <div className="border-border from-surface-tertiary via-surface-secondary to-warning/25 shadow-surface relative overflow-hidden rounded-3xl border bg-gradient-to-r p-6 sm:p-8">
      {/* Decorative Beach Scene Illustration via SVG */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full max-w-lg opacity-90 select-none sm:w-2/3">
        <svg
          viewBox="0 0 500 200"
          preserveAspectRatio="xMaxYMid slice"
          className="h-full w-full"
          fill="none"
        >
          {/* Gentle clouds */}
          <path
            d="M320 60 Q340 40 370 50 Q400 35 430 55 Q450 45 470 65 L480 90 L310 90 Z"
            fill="#ffffff"
            fillOpacity="0.45"
          />

          {/* Warm Sun with soft glow */}
          <circle cx="390" cy="95" r="48" fill="var(--warning)" fillOpacity="0.35" />
          <circle cx="390" cy="95" r="32" fill="var(--warning)" fillOpacity="0.85" />

          {/* Distant Hills / Islands */}
          <path
            d="M310 135 Q350 100 400 135 Q440 105 480 135 L500 150 L300 150 Z"
            fill="var(--accent)"
            fillOpacity="0.2"
          />

          {/* Sailboat */}
          <g transform="translate(230, 95) scale(0.65)">
            <path d="M12 25 L40 25 L34 32 L16 32 Z" fill="#ffffff" />
            <path d="M26 5 L26 23 L37 23 Z" fill="#ffffff" />
            <path d="M24 8 L24 23 L15 23 Z" fill="var(--border)" />
          </g>

          {/* Ocean Waves Layer 1 */}
          <path
            d="M150 145 C220 140 280 150 350 142 C410 136 460 145 500 140 L500 200 L150 200 Z"
            fill="var(--accent)"
            fillOpacity="0.3"
          />

          {/* Ocean Waves Layer 2 */}
          <path
            d="M100 160 C180 155 250 168 330 158 C400 150 450 162 500 156 L500 200 L100 200 Z"
            fill="var(--success)"
            fillOpacity="0.3"
          />

          {/* Sandy Shore */}
          <path
            d="M200 185 C280 178 360 188 430 180 C470 176 490 180 500 178 L500 200 L200 200 Z"
            fill="var(--warning)"
            fillOpacity="0.3"
          />

          {/* Tropical Palm Fronds Framing Top Right */}
          <g
            transform="translate(430, -10)"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M70 10 Q30 30 0 70" fill="none" />
            <path d="M50 25 L35 15 M40 35 L20 30 M30 45 L10 45 M20 58 L5 65" />
            <path d="M70 10 Q20 50 -10 110" fill="none" />
            <path d="M45 40 L25 35 M35 55 L15 55 M25 70 L5 78 M15 85 L-2 100" />
          </g>

          {/* Hibiscus / Tropical Flower Accent */}
          <circle cx="465" cy="115" r="7" fill="var(--danger)" fillOpacity="0.8" />
          <circle cx="465" cy="115" r="2.5" fill="var(--warning)" />
        </svg>
      </div>

      {/* Greeting Content */}
      <div className="relative z-10 max-w-md">
        <p className="text-accent text-sm font-medium">Good morning,</p>
        <div className="mt-0.5 flex items-center gap-2">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Summer</h1>
          <span className="text-2xl">☀️</span>
        </div>
        <p className="text-muted mt-2 flex items-center gap-1.5 text-xs sm:text-sm">
          <span>Small steps today, bigger dreams tomorrow</span>
          <span>🍃</span>
        </p>
      </div>
    </div>
  );
}
