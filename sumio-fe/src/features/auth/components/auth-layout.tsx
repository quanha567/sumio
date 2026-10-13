import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import beachIllustration from "@/assets/illustrations/auth-beach.jpg";
import { IconBadge } from "@/components/common";
import { BrandLogo } from "@/components/layout";
import { Card, Heading, Text } from "@/components/ui";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden">
      {/* Background Ambience & Beach Artwork */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={beachIllustration}
          alt=""
          className="h-full w-full object-cover object-left opacity-75 saturate-[1.05] filter md:object-center md:opacity-90"
        />
        {/* Soft vignette and readability gradient overlay */}
        <div className="from-background/90 via-background/60 to-background/95 lg:from-background/50 lg:via-background/25 lg:to-background/95 absolute inset-0 bg-linear-to-r" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between p-6 sm:p-8 lg:p-12">
        {/* Top bar with Brand for mobile/tablet */}
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center transition-transform hover:scale-102">
            <BrandLogo />
          </Link>
        </div>

        {/* Hero & Form Split Section */}
        <div className="my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Slogan & Brand Narrative */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-7">
            <div className="animate-entrance max-w-xl">
              <Text size="lg" weight="medium">
                Small steps today,
              </Text>
              <Heading
                level={1}
                className="text-accent mt-1 font-serif text-4xl sm:text-5xl lg:text-6xl"
              >
                <span className="font-semibold italic">bigger dreams</span>{" "}
                <br className="hidden sm:inline" />
                tomorrow
                <span
                  className="ml-3 inline-block text-3xl drop-shadow-xs filter sm:text-4xl"
                  role="img"
                  aria-label="sun"
                >
                  ☀️
                </span>
              </Heading>
              <Text variant="muted" size="base" className="mt-4 max-w-md leading-relaxed">
                Track your spending, build better habits, and create the life you want.
              </Text>
            </div>
          </div>

          {/* Right Column: Floating Auth Form Card */}
          <div className="flex justify-center lg:col-span-6 lg:justify-end xl:col-span-5">
            <div className="animate-entrance w-full max-w-[460px]">
              <Card intent="raised" padding="lg">
                <BrandLogo className="mb-6" />

                {/* Form Content Slot */}
                {children}
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Security Assurance */}
        <div className="flex items-center gap-2">
          <IconBadge icon={ShieldCheck} tone="accent" size="sm" shape="circle" />
          <Text variant="caption">Your data is safe and secure</Text>
        </div>
      </div>
    </div>
  );
}
