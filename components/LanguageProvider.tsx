"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language =
  | "fa"
  | "tr"
  | "ur"
  | "id"
  | "en"
  | "ar";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext =
  createContext<LanguageContextType | null>(null);

const rtlLanguages: Language[] = ["fa", "ur", "ar"];

const supportedLanguages: Language[] = [
  "fa",
  "tr",
  "ur",
  "id",
  "en",
  "ar",
];

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("fa");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "hamian-language"
      ) as Language | null;

      if (
        saved &&
        supportedLanguages.includes(saved)
      ) {
        setLanguageState(saved);
      }
    } catch {
      // زبان پیش‌فرض فارسی باقی می‌ماند.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;

    document.documentElement.dir =
      rtlLanguages.includes(language)
        ? "rtl"
        : "ltr";
  }, [language]);

  function setLanguage(language: Language) {
    setLanguageState(language);

    try {
      localStorage.setItem(
        "hamian-language",
        language
      );
    } catch {
      // اگر localStorage در دسترس نبود، سایت همچنان کار می‌کند.
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage باید داخل LanguageProvider استفاده شود."
    );
  }

  return context;
}
