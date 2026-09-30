"use client";

import { uiTranslations } from "./uiTranslations";
import { useLanguage } from "./LanguageProvider";

type TranslationKey = keyof typeof uiTranslations.fa;

type LanguageTextProps = {
  k: TranslationKey;
};

export default function LanguageText({
  k,
}: LanguageTextProps) {
  const { language } = useLanguage();

  return <>{uiTranslations[language][k]}</>;
}
