
"use client";

import { useState } from "react";
import QuranReader from "@/components/QuranReader";
import LanguageSelector from "@/components/LanguageSelector";
import LanguageText from "@/components/LanguageText";

type ApiVerse = {
  id: number;
  verse_key: string;
  text_uthmani: string;
};

type TranslationItem = {
  sura: number;
  aya: number;
  translation: string;
};

type ReaderVerse = {
  id: number;
  verse_key: string;
  arabic: string;
  translation?: string;
};

const QURAN_API = "https://api.quran.com/api/v4";
const TRANSLATION_API =
  "https://quranenc.com/api/v1/translation/sura/persian_ih";

export default function HomePage() {
  const [juz, setJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<ReaderVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [translationWarning, setTranslationWarning] =
    useState("");

  async function loadJuz(juzNumber: number) {
    setJuz(juzNumber);
    setVerses([]);
    setError("");
    setTranslationWarning("");
    setLoading(true);

    try {
      const response = await fetch(
        `${QURAN_API}/quran/verses/uthmani?juz_number=${juzNumber}`
      );

      if (!response.ok) {
        throw new Error("Quran request failed");
      }

      const data = await response.json();

      const arabicVerses: ReaderVerse[] = (
        data.verses || []
      ).map((verse: ApiVerse) => ({
        id: verse.id,
        verse_key: verse.verse_key,
        arabic: verse.text_uthmani,
        translation: "",
      }));

      if (arabicVerses.length === 0) {
        setVerses([]);
        return;
      }

      // دریافت ترجمه هر سوره فقط یک بار
      const surahNumbers = Array.from(
        new Set(
          arabicVerses.map((verse) =>
            Number(verse.verse_key.split(":")[0])
          )
        )
      );

      const translationResults = await Promise.all(
        surahNumbers.map(async (surahNumber) => {
          const translationResponse = await fetch(
            `${TRANSLATION_API}/${surahNumber}`
          );

          if (!translationResponse.ok) {
            throw new Error(
              `Translation request failed: ${surahNumber}`
            );
          }

          const items: TranslationItem[] =
            await translationResponse.json();

          return items;
        })
      );

      const translationMap = new Map<string, string>();

      translationResults.flat().forEach((item) => {
        translationMap.set(
          `${item.sura}:${item.aya}`,
          item.translation
        );
      });

      const completeVerses = arabicVerses.map((verse) => ({
        ...verse,
        translation:
          translationMap.get(verse.verse_key) || "",
      }));

      setVerses(completeVerses);

      if (
        completeVerses.some((verse) => !verse.translation)
      ) {
        setTranslationWarning(
          "بعضی ترجمه‌ها دریافت نشدند. لطفاً اتصال اینترنت را بررسی کنید."
        );
      }
    } catch {
      setError(
        "دریافت اطلاعات قرآن یا ترجمه انجام نشد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen px-4 py-6 md:px-8"
    >
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            HamianQuran.com
          </h1>

          <p className="mt-1 text-muted">
            <LanguageText k="quran" />
          </p>
        </div>

        <LanguageSelector />
      </header>

      <section className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-xl font-bold">
          <LanguageText k="allJuz" />
        </h2>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {Array.from(
            { length: 30 },
            (_, index) => index + 1
          ).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => loadJuz(number)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition hover:bg-black/5 ${
                juz === number ? "font-bold" : ""
              }`}
              style={{
                borderColor: "var(--border)",
              }}
            >
              <LanguageText k="juz" /> {number}
            </button>
          ))}
        </div>
      </section>

      {juz !== null && (
        <section className="mx-auto mt-8 max-w-5xl">
          <h2 className="mb-5 text-xl font-bold">
            <LanguageText k="juz" /> {juz}
          </h2>

          {loading && (
            <div className="card p-6 text-center">
              در حال دریافت متن قرآن و ترجمه فارسی...
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="card p-6 text-center text-red-600"
            >
              {error}
              <button
                type="button"
                onClick={() => loadJuz(juz)}
                className="mr-3 rounded-lg border px-3 py-2"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          {translationWarning && !loading && (
            <p className="mb-4 text-sm text-amber-700">
              {translationWarning}
            </p>
          )}

          {!loading && !error && (
            <QuranReader verses={verses} />
          )}
        </section>
      )}

      <footer className="mx-auto mt-8 max-w-5xl text-center text-xs text-muted">
        منبع ترجمه فارسی: QuranEnc.com
      </footer>
    </main>
  );
}

