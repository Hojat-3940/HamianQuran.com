"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Language,
  useLanguage,
} from "./LanguageProvider";

const languages: {
  code: Language;
  label: string;
}[] = [
  { code: "fa", label: "فارسی" },
  { code: "tr", label: "Türkçe" },
  { code: "ur", label: "اردو" },
  { code: "id", label: "Indonesia" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const currentLanguage =
    languages.find((item) => item.code === language) ??
    languages[0];

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
        onClick={() => setOpen((value) => !value)}
        className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-black/5"
        style={{
          borderColor: "var(--border)",
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        🌐 {currentLanguage.label}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 min-w-[170px] rounded-xl border bg-white p-2 shadow-lg"
          style={{
            borderColor: "var(--border)",
          }}
          role="menu"
        >
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() =>
                selectLanguage(item.code)
              }
              className={`block w-full rounded-lg px-3 py-2 text-right text-sm transition hover:bg-black/5 ${
                language === item.code
                  ? "font-bold"
                  : ""
              }`}
              role="menuitem"
            >
              {language === item.code && "✓ "}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
