"use client";

import { useEffect, useRef, useState } from "react";
import {
  Language,
  useLanguage,
} from "./LanguageProvider";

const languages: {
  code: Language;
  label: string;
  flag: string;
}[] = [
  {
    code: "fa",
    label: "فارسی",
    flag: "🇮🇷",
  },
  {
    code: "tr",
    label: "Türkçe",
    flag: "🇹🇷",
  },
  {
    code: "ur",
    label: "اردو",
    flag: "🇵🇰",
  },
  {
    code: "id",
    label: "Indonesia",
    flag: "🇮🇩",
  },
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "🇸🇦",
  },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const [open, setOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  const selected =
    languages.find(
      (item) => item.code === language
    ) ?? languages[0];

  useEffect(() => {
    function close(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener(
        "mousedown",
        close
      );
    };
  }, []);

  function selectLanguage(code: Language) {
    setLanguage(code);
    setOpen(false);
  }

  return (
    <div
      ref={menuRef}
      className="relative inline-block"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <span>🌐</span>
        <span>{selected.label}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border p-2 shadow-lg"
          style={{
            borderColor: "var(--border)",
            background: "var(--background)",
          }}
        >
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() =>
                selectLanguage(item.code)
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-black/5"
            >
              <span>{item.flag}</span>

              <span>{item.label}</span>

              {language === item.code && (
                <span className="mr-auto">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
