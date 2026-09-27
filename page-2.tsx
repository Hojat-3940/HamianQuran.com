"use client";

import { useState } from "react";

type Verse = {
  verse_key: string;
  text_uthmani: string;
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
      setError("دریافت متن قرآن انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl">
      <header>
        <h1>HamianQuran.com</h1>
        <p>قرآن کریم</p>
      </header>

      <section>
        <h2>۳۰ جزء قرآن کریم</h2>

        <div>
          {Array.from({ length: 30 }, (_, index) => {
            const number = index + 1;

            return (
              <button
                key={number}
                onClick={() => loadJuz(number)}
                style={{
                  margin: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                جزء {number}
              </button>
            );
          })}
        </div>
      </section>

      {juz !== null && (
        <section>
          <h2>متن عربی جزء {juz}</h2>

          {loading && <p>در حال دریافت متن قرآن...</p>}

          {error && <p>{error}</p>}

          {!loading &&
            !error &&
            verses.map((verse) => (
              <p
                key={verse.verse_key}
                style={{
                  fontSize: "24px",
                  lineHeight: "2.2",
                  textAlign: "right",
                  marginBottom: "20px",
                }}
              >
                {verse.text_uthmani} <span>﴿{verse.verse_key}﴾</span>
              </p>
            ))}
        </section>
      )}
    </main>
  );
}
