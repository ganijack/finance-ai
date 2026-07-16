"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Menu, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "AI", href: "/ai" },
  { label: "About", href: "/about" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0 md:h-16 gap-2 md:gap-0">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BrandLogo />
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-4 sm:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-2 py-1 sm:px-3.5 sm:py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
              >
                <span>
                  {link.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 border-0">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
