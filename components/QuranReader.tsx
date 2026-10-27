
"use client";

import { Bookmark, Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

type Verse = {
  id: number;
  verse_key: string;
  arabic: string;
  translation?: string;
};

type QuranReaderProps = {
  verses: Verse[];
};

const SUPABASE_AUDIO_BASE =
  "https://lswterikzwmldijimxrg.supabase.co/storage/v1/object/public/member-media/Untitled%20folder";

function getPersianTranslationAudio(verseKey: string) {
  const [surah, ayah] = verseKey.split(":").map(Number);

  // فایل‌های صوت ترجمه فعلاً فقط برای سوره حمد موجودند.
  if (surah !== 1 || ayah < 1 || ayah > 7) {
    return null;
  }

  return `${SUPABASE_AUDIO_BASE}/00100${ayah}.mp3`;
}

function getArabicAudio(verseId: number) {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verseId}.mp3`;
}

export default function QuranReader({
  verses,
}: QuranReaderProps) {
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
      localStorage.setItem("hamian-saved", JSON.stringify(next));
    } catch {
      // ذخیره محلی ممکن است در بعضی مرورگرها غیرفعال باشد.
    }
  }

  async function share(verse: Verse) {
    const text = `${verse.arabic}${
      verse.translation ? `\n\n${verse.translation}` : ""
    }`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `آیه ${verse.verse_key}`,
          text,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(verse.id);

        window.setTimeout(() => {
          setCopied(null);
        }, 2000);
      }
    } catch {
      // اشتراک‌گذاری لغو شده است.
    }
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
        const numberInSurah = Number(
          verse.verse_key.split(":")[1]
        );

        const translationAudio =
          getPersianTranslationAudio(verse.verse_key);

        return (
          <article
            key={verse.id}
            id={`ayah-${verse.verse_key}`}
            className="card p-5 md:p-7"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#bd8e35]">
                سوره و آیه {verse.verse_key}
              </span>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => toggleSave(verse.id)}
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
                ﴿{numberInSurah}﴾
              </span>
            </p>

            {verse.translation && (
              <div
                className="mt-5 border-t pt-4 text-[15px] leading-8 text-muted"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="mb-2 font-bold">ترجمه فارسی</p>
                <p>{verse.translation}</p>
              </div>
            )}

            <div
              className="mt-5 border-t pt-4"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="mb-2 font-bold">🔊 صوت عربی آیه</p>

              <audio
                key={`arabic-${verse.id}`}
                controls
                preload="none"
                className="w-full"
                src={getArabicAudio(verse.id)}
              >
                مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
              </audio>
            </div>

            {translationAudio && (
              <div className="mt-4">
                <p className="mb-2 font-bold">
                  🔊 صوت ترجمه فارسی آیه
                </p>

                <audio
                  key={`translation-${verse.verse_key}`}
                  controls
                  preload="none"
                  className="w-full"
                  src={translationAudio}
                >
                  مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
                </audio>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
