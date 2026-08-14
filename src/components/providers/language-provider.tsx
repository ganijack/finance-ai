"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { en, TranslationKey } from "@/lib/i18n/en";
import { id } from "@/lib/i18n/id";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLang = localStorage.getItem("financeai-language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "id")) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("financeai-language", lang);
  };

  const t = (key: TranslationKey): string => {
    // Return key if not mounted to prevent hydration mismatch for translations
    // but in practice it's better to just render English on server and swap on client.
    // However, to keep it simple and SEO-friendly for default lang, we'll just return the current state.
    const dictionary = language === "id" ? id : en;
    return dictionary[key] || en[key] || key;
  };

  if (!mounted) {
    // Render with default 'en' before hydration to avoid mismatch
    return (
      <LanguageContext.Provider value={{ language: "en", setLanguage, t: (key) => en[key] || key }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
