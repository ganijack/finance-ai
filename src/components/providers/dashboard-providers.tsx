"use client";

import { CurrencyProvider } from "@/components/providers/currency-provider";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  );
}
