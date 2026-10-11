"use client";

import Link from "next/link";
import { Wallet, ExternalLink, Mail } from "lucide-react";

const navigationLinks = [
  { label: "Fitur", href: "/#features" },
  { label: "Cara Kerja", href: "/how-it-works" },
  { label: "Tentang Kami", href: "/about" },
];

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/privacy-policy" },
];

const accountLinks = [
  { label: "Masuk", href: "/login" },
  { label: "Daftar Akun", href: "/register" },
];

const socialLinks = [
  { icon: ExternalLink, href: "https://github.com/ganijack", label: "GitHub (@ganijack)" },
  { icon: ExternalLink, href: "https://www.linkedin.com/in/thoriq-abdillah-falian-kusuma-433615289/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:admin@financeai.com", label: "admin@financeai.com" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 sm:py-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Finance<span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm mb-5 leading-relaxed">
              Platform untuk mengotomatisasi pencatatan pesanan WhatsApp dan pembukuan keuangan bisnis Anda.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2.5 rounded-lg border border-border bg-background"
                    aria-label={social.label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{social.label.split(" ")[0]}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Menu</h4>
            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Legalitas</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Akses</h4>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} FinanceAI. Hak cipta dilindungi.
          </p>
          <p>
            Dikembangkan oleh <a href="https://github.com/ganijack" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium text-foreground">Thoriq Abdillah</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
