
"use client";

import { useState } from "react";
import QuranReader from "@/components/QuranReader";
import LanguageSelector from "@/components/LanguageSelector";
import LanguageText from "@/components/LanguageText";
import { supabase } from "@/lib/supabase";

type ReaderVerse = {
  id: number;
  verse_key: string;
  arabic: string;
  translation?: string;
};

type TranslationItem = {
  sura: number;
  aya: number;
  translation: string;
};

const TRANSLATION_API =
  "https://quranenc.com/api/v1/translation/sura/persian_ih";

const JUZ_STARTS = [
  [1, 1], [2, 142], [2, 253], [3, 93], [4, 24],
  [4, 148], [5, 82], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1],
  [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47],
  [46, 1], [51, 31], [58, 1], [67, 1], [78, 1]
];

const JUZ_ENDS = [
  [2, 141], [2, 252], [3, 92], [4, 23], [4, 147],
  [5, 81], [6, 110], [7, 87], [8, 40], [9, 92],
  [11, 5], [12, 52], [14, 52], [16, 128], [18, 74],
  [20, 135], [22, 78], [25, 20], [27, 55], [29, 45],
  [33, 30], [36, 27], [39, 31], [41, 46], [45, 37],
  [51, 30], [57, 29], [66, 12], [77, 50], [114, 6]
];

function compareVerse(
  a: [number, number],
  b: [number, number]
) {
  return a[0] - b[0] || a[1] - b[1];
}

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
      const start = JUZ_STARTS[juzNumber - 1];
      const end = JUZ_ENDS[juzNumber - 1];

      const { data, error: dbError } = await supabase
        .from("quran_verses")
        .select("id, surah_number, ayah_number, arabic_text")
        .order("surah_number", { ascending: true })
        .order("ayah_number", { ascending: true });

      if (dbError) throw dbError;

      const arabicVerses: ReaderVerse[] = (data || [])
        .filter((v) => {
          const position: [number, number] = [
            v.surah_number,
            v.ayah_number
          ];

          return (
            compareVerse(position, start) >= 0 &&
            compareVerse(position, end) <= 0
          );
        })
        .map((v) => ({
          id: v.id,
          verse_key: `${v.surah_number}:${v.ayah_number}`,
          arabic: v.arabic_text,
          translation: ""
        }));

      if (!arabicVerses.length) {
        throw new Error("آیات این جزء در پایگاه داده پیدا نشدند.");
      }

      const surahNumbers = Array.from(
        new Set(
          arabicVerses.map((v) =>
            Number(v.verse_key.split(":")[0])
          )
        )
      );

      try {
        const results = await Promise.all(
          surahNumbers.map(async (surah) => {
            const response = await fetch(
              `${TRANSLATION_API}/${surah}`
            );

            if (!response.ok) throw new Error("Translation error");

            return await response.json() as TranslationItem[];
          })
        );

        const translationMap = new Map<string, string>();

        results.flat().forEach((item) => {
          translationMap.set(
            `${item.sura}:${item.aya}`,
            item.translation
          );
        });

        arabicVerses.forEach((v) => {
          v.translation = translationMap.get(v.verse_key) || "";
        });

        if (arabicVerses.some((v) => !v.translation)) {
          setTranslationWarning(
            "بعضی ترجمه‌ها دریافت نشدند."
          );
        }
      } catch {
        setTranslationWarning(
          "ترجمه فارسی دریافت نشد؛ متن عربی موجود است."
        );
      }

      setVerses(arabicVerses);

    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "دریافت قرآن انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen px-4 py-6 md:px-8">
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            همین قرآن
          </h1>
        </div>
        <LanguageSelector />
      </header>

      <section className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-xl font-bold">
          <LanguageText k="allJuz" />
        </h2>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {Array.from({ length: 30 }, (_, index) => index + 1)
            .map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => loadJuz(number)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition hover:bg-black/5 ${
                  juz === number ? "font-bold" : ""
                }`}
                style={{ borderColor: "var(--border)" }}
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
              در حال دریافت قرآن از پایگاه داده...
            </div>
          )}

          {error && (
            <div role="alert" className="card p-6 text-center text-red-600">
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
        متن عربی قرآن: پایگاه داده اختصاصی همین قرآن
      </footer>
    </main>
  );
}
