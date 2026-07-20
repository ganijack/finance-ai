"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrencyByCode, type CurrencyInfo } from "@/lib/currencies";
import { formatCurrency } from "@/lib/utils";

interface CurrencyContextType {
  currency: string;
  currencyInfo: CurrencyInfo;
  loading: boolean;
  format: (amount: number) => string;
  changeCurrency: (newCurrency: string) => Promise<void>;
  refreshCurrency: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("IDR");
  const [loading, setLoading] = useState(true);

  const fetchCurrency = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const settings = await res.json();
        setCurrency(settings.currency || "IDR");
      }
    } catch {
      // Default to IDR on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  const format = useCallback(
    (amount: number) => formatCurrency(amount, currency),
    [currency]
  );

  const changeCurrency = useCallback(
    async (newCurrency: string) => {
      const oldCurrency = currency;
      if (oldCurrency === newCurrency) return;

      // Call the conversion API
      const res = await fetch("/api/currency/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: oldCurrency, to: newCurrency }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to convert currency");
      }

      // Update settings
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: newCurrency }),
      });

      setCurrency(newCurrency);
    },
    [currency]
  );

  const currencyInfo = getCurrencyByCode(currency);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyInfo,
        loading,
        format,
        changeCurrency,
        refreshCurrency: fetchCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
