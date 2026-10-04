import { Link } from "@tanstack/react-router";
import { ShieldCheck, Leaf } from "lucide-react";
import { type ReactNode } from "react";

import beachIllustration from "@/assets/illustrations/auth-beach.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="text-foreground relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#EFF8F6]">
      {/* Background Ambience & Beach Artwork */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={beachIllustration}
          alt=""
          className="h-full w-full object-cover object-left opacity-75 saturate-[1.05] filter md:object-center md:opacity-90"
        />
        {/* Soft vignette and readability gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0F8F6]/85 via-[#F0F8F6]/60 to-[#F0F8F6]/90 lg:from-[#F0F8F6]/40 lg:via-[#F0F8F6]/20 lg:to-[#F4FAF8]/95" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between p-6 sm:p-8 lg:p-12">
        {/* Top bar with Brand for mobile/tablet */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-102"
          >
            <div className="bg-accent text-accent-foreground flex h-9 w-9 items-center justify-center rounded-xl shadow-xs">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-accent font-serif text-2xl font-bold tracking-tight">Sumio</span>
          </Link>
        </div>

        {/* Hero & Form Split Section */}
        <div className="my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Slogan & Brand Narrative */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-7">
            <div className="animate-entrance max-w-xl">
              <p className="text-foreground/80 text-lg font-medium sm:text-xl">
                Small steps today,
              </p>
              <h1 className="text-accent mt-1 font-serif text-4xl leading-tight font-normal tracking-tight sm:text-5xl lg:text-6xl">
                <span className="from-accent bg-gradient-to-r to-[#2E8B75] bg-clip-text font-semibold text-transparent italic">
                  bigger dreams
                </span>{" "}
                <br className="hidden sm:inline" />
                tomorrow
                <span
                  className="ml-3 inline-block text-3xl drop-shadow-xs filter sm:text-4xl"
                  role="img"
                  aria-label="sun"
                >
                  ☀️
                </span>
              </h1>
              <p className="text-foreground/75 mt-4 max-w-md text-base leading-relaxed sm:text-lg">
                Track your spending, build better habits, and create the life you want.
              </p>
            </div>
          </div>

          {/* Right Column: Floating Auth Form Card */}
          <div className="flex justify-center lg:col-span-6 lg:justify-end xl:col-span-5">
            <div className="animate-entrance w-full max-w-[460px]">
              <div className="shadow-accent/5 rounded-3xl border border-white/60 bg-white/90 p-7 shadow-xl backdrop-blur-md transition-all duration-300 sm:p-9">
                {/* Brand Header inside Card */}
                <div className="mb-6 flex items-center gap-2">
                  <div className="bg-accent/15 text-accent flex h-7 w-7 items-center justify-center rounded-lg">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <span className="text-accent font-serif text-xl font-bold tracking-tight">
                    Sumio
                  </span>
                </div>

                {/* Form Content Slot */}
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Assurance */}
        <div className="text-foreground/70 flex items-center gap-2 text-xs font-medium sm:text-sm">
          <ShieldCheck className="text-accent h-4 w-4" />
          <span>Your data is safe and secure</span>
        </div>
      </div>
    </div>
  );
}
