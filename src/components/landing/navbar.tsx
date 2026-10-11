"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Fitur", href: "/#features" },
  { label: "Cara Kerja", href: "/how-it-works" },
  { label: "Tentang Kami", href: "/about" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: logo + login button on same row */}
        <div className="flex md:hidden items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs">
              <Link href="/register">Coba Gratis</Link>
            </Button>
          </div>
        </div>

        {/* Mobile: nav links row */}
        <div className="flex md:hidden items-center justify-center gap-2 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop: all in one row */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <BrandLogo />
          </Link>

          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs px-4">
              <Link href="/register">Coba Gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
