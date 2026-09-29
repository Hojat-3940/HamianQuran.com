"use client";

import { Bookmark, Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";

type Verse = {
  id: number;
  verse_key: string;
  numberInSurah: number;
  arabic: string;
  translation?: string;
};

export default function QuranReader({
  verses,
}: {
  verses: Verse[];
}) {
  const [saved, setSaved] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hamian-saved");

      if (stored) {
        setSaved(JSON.parse(stored));
      }
    } catch {
      setSaved([]);
    }
  }, []);

  function toggleSave(number: number) {
    const next = saved.includes(number)
      ? saved.filter((item) => item !== number)
      : [...saved, number];

    setSaved(next);

    try {
      localStorage.setItem(
        "hamian-saved",
        JSON.stringify(next)
      );
    } catch {}
  }

  async function share(verse: Verse) {
    const text = `${verse.arabic}\n\n${
      verse.translation || ""
    }`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `آیه ${verse.verse_key}`,
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(verse.id);

        setTimeout(() => {
          setCopied(null);
        }, 2000);
      }
    } catch {}
  }

  if (!verses.length) {
    return (
      <div className="card p-6 text-center">
        <p>آیه‌ای برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {verses.map((verse) => {
        const audioUrl =
          `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verse.id}.mp3`;

        return (
          <article
            key={verse.id}
            id={`ayah-${verse.verse_key}`}
            className="card p-5 md:p-7"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#bd8e35]">
                آیه {verse.verse_key}
              </span>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    toggleSave(verse.id)
                  }
                  className="rounded-lg p-2 hover:bg-black/5"
                  title="نشان‌گذاری"
                  aria-label="نشان‌گذاری آیه"
                >
                  <Bookmark
                    size={18}
                    fill={
                      saved.includes(verse.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

                <button
                  type="button"
                  onClick={() => share(verse)}
                  className="rounded-lg p-2 hover:bg-black/5"
                  title="اشتراک‌گذاری"
                  aria-label="اشتراک‌گذاری آیه"
                >
                  {copied === verse.id ? (
                    <Check size={18} />
                  ) : (
                    <Share2 size={18} />
                  )}
                </button>
              </div>
            </div>

            <p className="font-arabic text-right text-[29px] leading-[2.35] md:text-[35px]">
              {verse.arabic}{" "}
              <span className="text-lg text-[#bd8e35]">
                ﴿{verse.numberInSurah}﴾
              </span>
            </p>

            {verse.translation && (
              <div
                className="mt-6 border-t pt-5 text-[15px] leading-8 text-muted"
                style={{ borderColor: "var(--border)" }}
              >
                {verse.translation}
              </div>
            )}

            <AudioPlayer audio={audioUrl} />
          </article>
        );
      })}
    </div>
  );
}
