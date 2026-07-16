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
              avatarUrl="/profile.png"
              miniAvatarUrl="/profile.png"
              name="Thoriq Abdillah F.K."
              title="AI Engineer"
              handle="ganijack"
              status="Building FinanceAI 🚀"
              contactText="LinkedIn"
              enableTilt={true}
              behindGlowEnabled={true}
              behindGlowColor="rgba(99, 102, 241, 0.5)"
              innerGradient="linear-gradient(145deg, #3730a380 0%, #7c3aed44 100%)"
              onContactClick={() => {
                window.open("https://www.linkedin.com/in/thoriq-abdillah-falian-kusuma-433615289/", "_blank");
              }}
            />

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ganijack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
              >
                {/* GitHub SVG */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/thoriq-abdillah-falian-kusuma-433615289/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/70 border border-blue-500/40 text-white text-sm hover:bg-blue-600/90 transition-colors"
              >
                {/* LinkedIn SVG */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 shadow-lg shadow-zinc-500/25">
                  <Wallet className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Finance<span className="bg-gradient-to-r from-zinc-400 to-zinc-400 bg-clip-text text-transparent">AI</span>
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
