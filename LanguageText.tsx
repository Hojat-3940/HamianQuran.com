"use client";

import { uiTranslations } from "./uiTranslations";
import { useLanguage } from "./LanguageProvider";

type Key = keyof typeof uiTranslations.fa;

export default function LanguageText({
  k,
}: {
  k: Key;
}) {
  const { language } = useLanguage();

  return <>{uiTranslations[language][k]}</>;
}
