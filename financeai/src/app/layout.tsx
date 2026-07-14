import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FinanceAI",
  description: "AI-Powered Personal Finance Platform",
  icons: {
    icon: "/logo/favicon.ico",
    apple: "/logo/apple-touch-icon.png",
  },
  keywords: [
    "expense tracker",
    "finance",
    "budgeting",
    "analytics",
    "AI",
    "personal finance",
    "money management",
  ],
  openGraph: {
    title: "FinanceAI — Smart Expense Tracker Powered by AI",
    description:
      "Track your expenses effortlessly using AI. Type naturally, upload receipts, and receive intelligent financial insights.",
    url: "https://financeai.vercel.app",
    siteName: "FinanceAI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceAI — Smart Expense Tracker Powered by AI",
    description:
      "Track your expenses effortlessly using AI. Type naturally, upload receipts, and receive intelligent financial insights.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
