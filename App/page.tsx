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

type ReaderVerse = {
  id: number;
  verse_key: string;
  arabic: string;
  translation?: string;
};

export default function HomePage() {
  const [juz, setJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<ReaderVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadJuz(juzNumber: number) {
    setJuz(juzNumber);
    setVerses([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${juzNumber}`
      );

      if (!response.ok) {
        throw new Error("Quran request failed");
      }

      const data = await response.json();

      const readerVerses: ReaderVerse[] = (
        data.verses || []
      ).map((verse: ApiVerse) => ({
        id: verse.id,
        verse_key: verse.verse_key,
        arabic: verse.text_uthmani,
        translation: "",
      }));

      setVerses(readerVerses);
    } catch {
      setError(
        "دریافت متن قرآن انجام نشد. لطفاً دوباره تلاش کنید."
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
              <LanguageText k="loading" />
            </div>
          )}

          {error && (
            <div className="card p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <QuranReader verses={verses} />
          )}
        </section>
      )}
    </main>
  );
}
