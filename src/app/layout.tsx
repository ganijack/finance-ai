import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FinanceAI — Pembukuan Bisnis & Otomasi WhatsApp",
  description: "Platform untuk mencatat transaksi keuangan dan mengotomatisasi pesanan bisnis melalui WhatsApp.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo/favicon.ico",
    apple: "/logo/apple-touch-icon.png",
  },
  keywords: [
    "pembukuan whatsapp",
    "catat keuangan",
    "bot whatsapp bisnis",
    "finance",
    "qris payment",
    "laporan keuangan",
  ],
  openGraph: {
    title: "FinanceAI — Pembukuan Bisnis & Otomasi WhatsApp",
    description:
      "Catat transaksi, terima pembayaran otomatis, dan pantau laporan keuangan bisnis langsung dari WhatsApp.",
    url: "https://financeai.web.id",
    siteName: "FinanceAI",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceAI — Pembukuan Bisnis & Otomasi WhatsApp",
    description:
      "Catat transaksi, terima pembayaran otomatis, dan pantau laporan keuangan bisnis langsung dari WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans overflow-x-hidden`} suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col overflow-x-hidden w-full max-w-[100vw]">
              {children}
            </div>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
