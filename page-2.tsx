"use client";

import { useState } from "react";
import QuranReader from "./QuranReader";

type Verse = {
  id: number;
  verse_key: string;
  text_uthmani: string;
  words?: unknown[];
};

export default function HomePage() {
  const [juz, setJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadJuz(juzNumber: number) {
    setJuz(juzNumber);
    setLoading(true);
    setError("");
    setVerses([]);

    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${juzNumber}`
      );

      if (!response.ok) {
        throw new Error("خطا در دریافت متن قرآن");
      }

      const data = await response.json();

      setVerses(data.verses || []);
    } catch {
      setError(
        "دریافت متن قرآن انجام نشد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  const readerVerses = verses.map((verse) => ({
    id: verse.id,
    verse_key: verse.verse_key,
    numberInSurah: Number(
      verse.verse_key.split(":")[1]
    ),
    arabic: verse.text_uthmani,
    translation: "",
  }));

  return (
    <main dir="rtl" className="min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1>HamianQuran.com</h1>
        <p>قرآن کریم</p>
      </header>

      <section>
        <h2>۳۰ جزء قرآن کریم</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 30 }, (_, index) => {
            const number = index + 1;

            return (
              <button
                key={number}
                type="button"
                onClick={() => loadJuz(number)}
                className="rounded-xl border px-4 py-2"
                style={{
                  borderColor: "var(--border)",
                }}
              >
                جزء {number}
              </button>
            );
          })}
        </div>
      </section>

      {juz !== null && (
        <section className="mt-8">
          <h2 className="mb-6">
            متن عربی جزء {juz}
          </h2>

          {loading && (
            <p>در حال دریافت متن قرآن...</p>
          )}

          {error && (
            <p className="text-red-600">{error}</p>
          )}

          {!loading && !error && (
            <QuranReader verses={readerVerses} />
          )}
        </section>
      )}
    </main>
  );
}
