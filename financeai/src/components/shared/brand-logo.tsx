"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({ className = "", showSubtitle = false }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark logo if not mounted to prevent flash of wrong logo
  const isDark = !mounted || resolvedTheme === "dark";
  const logoSrc = isDark ? "/logo/logo-dark.svg" : "/logo/logo-light.svg";

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative h-10 w-[140px] sm:w-[160px]">
        <Image
          src={logoSrc}
          alt="FinanceAI"
          fill
          priority
          className="object-contain object-left"
        />
      </div>
      {showSubtitle && (
        <span className="mt-1 text-[10px] sm:text-xs text-muted-foreground font-medium tracking-wide">
          AI-Powered Personal Finance Platform
        </span>
      )}
    </div>
  );
}
