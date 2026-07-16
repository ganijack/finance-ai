"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, ExternalLink, MessageCircle, Mail, X } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#", isModal: true },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: ExternalLink, href: "https://github.com/ganijack", label: "GitHub" },
  { icon: MessageCircle, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@financeai.com", label: "Email" },
];

export function LandingFooter() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {/* About Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAbout(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative z-10 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowAbout(false)}
              className="self-end flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <ProfileCard
              avatarUrl="https://avatars.githubusercontent.com/u/ganijack"
              name="Thoriq Abdillah F.K."
              title="AI Engineer"
              handle="ganijack"
              status="Building FinanceAI 🚀"
              contactText="Contact"
              enableTilt={true}
              behindGlowEnabled={true}
              behindGlowColor="rgba(99, 102, 241, 0.5)"
              innerGradient="linear-gradient(145deg, #3730a380 0%, #7c3aed44 100%)"
              onContactClick={() => {
                window.location.href = "mailto:hello@financeai.com";
              }}
            />
          </div>
        </div>
      )}

      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 sm:py-16">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                  <Wallet className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Finance<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs mb-5 leading-relaxed">
                Smart expense tracking powered by artificial intelligence. Take control of your finances with modern tools.
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      {"isModal" in link && link.isModal ? (
                        <button
                          onClick={() => setShowAbout(true)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FinanceAI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ using Next.js, Supabase & AI
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
