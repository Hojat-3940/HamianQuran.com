"use client";

import { Bookmark, Check, Pause, Play, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WordTimestamp = {
  text: string;
  start: number;
  end: number;
};

type Verse = {
  numberInSurah: number;
  arabic: string;
  translation: string;
  audio?: string;
  /** Optional word timings in seconds. Add these when the audio source supports them. */
  words?: WordTimestamp[];
};

export default function QuranReader({ verses }: { verses: Verse[] }) {
  const [playing, setPlaying] = useState<number | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("hamian-saved") || "[]"));
    } catch {}

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const stopWordTracking = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentWord(null);
  };

  const toggleSave = (n: number) => {
    const next = saved.includes(n)
      ? saved.filter((x) => x !== n)
      : [...saved, n];
    setSaved(next);
    localStorage.setItem("hamian-saved", JSON.stringify(next));
  };

  const startWordTracking = (verse: Verse, audio: HTMLAudioElement) => {
    stopWordTracking();
    if (!verse.words?.length) return;

    const update = () => {
      const time = audio.currentTime;
      const index = verse.words!.findIndex(
        (word) => time >= word.start && time < word.end
      );
      setCurrentWord(index >= 0 ? index : null);
    };

    update();
    timerRef.current = window.setInterval(update, 40);
  };

  const play = (verse: Verse) => {
    if (!verse.audio) return;

    if (playing === verse.numberInSurah) {
      audioRef.current?.pause();
      setPlaying(null);
      stopWordTracking();
      return;
    }

    audioRef.current?.pause();
    stopWordTracking();

    const audio = new Audio(verse.audio);
    audioRef.current = audio;

    audio.onended = () => {
      setPlaying(null);
      stopWordTracking();
    };

    audio.onerror = () => {
      setPlaying(null);
      stopWordTracking();
    };

    audio.onplay = () => {
      setPlaying(verse.numberInSurah);
      startWordTracking(verse, audio);
    };

    audio.play().catch(() => {
      setPlaying(null);
      stopWordTracking();
    });
  };

  const share = async (verse: Verse) => {
    const text = `${verse.arabic}\n\n${verse.translation}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `آیه ${verse.numberInSurah}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(verse.numberInSurah);
        setTimeout(() => setCopied(null), 1600);
      }
    } catch {}
  };

  const renderArabic = (verse: Verse) => {
    if (!verse.words?.length) {
      return (
        <>
          {verse.arabic}{" "}
          <span className="text-lg text-[#bd8e35]">﴿{verse.numberInSurah}﴾</span>
        </>
      );
    }

    return (
      <>
        {verse.words.map((word, index) => (
          <button
            key={`${verse.numberInSurah}-${index}-${word.start}`}
            type="button"
            onClick={() => {
              const audio = audioRef.current;
              if (!audio || playing !== verse.numberInSurah) {
                play(verse);
                return;
              }
              audio.currentTime = word.start;
              setCurrentWord(index);
            }}
            className={`mx-0.5 rounded-md px-0.5 transition-colors ${
              playing === verse.numberInSurah && currentWord === index
                ? "bg-yellow-300 text-black"
                : "hover:bg-black/5"
            }`}
            aria-label={`پخش کلمه ${index + 1}`}
          >
            {word.text}
          </button>
        ))}{" "}
        <span className="text-lg text-[#bd8e35]">﴿{verse.numberInSurah}﴾</span>
      </>
    );
  };

  return (
    <div className="space-y-4">
      {verses.map((verse) => (
        <article
          key={verse.numberInSurah}
          id={`ayah-${verse.numberInSurah}`}
          className="card p-5 md:p-7"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-[#bd8e35]">
              آیه {verse.numberInSurah}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => toggleSave(verse.numberInSurah)}
                className="rounded-lg p-2 hover:bg-black/5"
                title="نشان‌گذاری"
                type="button"
              >
                <Bookmark
                  size={18}
                  fill={
                    saved.includes(verse.numberInSurah)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
              <button
                onClick={() => share(verse)}
                className="rounded-lg p-2 hover:bg-black/5"
                title="اشتراک‌گذاری"
                type="button"
              >
                {copied === verse.numberInSurah ? (
                  <Check size={18} />
                ) : (
                  <Share2 size={18} />
                )}
              </button>
            </div>
          </div>

          <p className="font-arabic text-right text-[29px] leading-[2.35] md:text-[35px]">
            {renderArabic(verse)}
          </p>

          <div
            className="mt-6 border-t pt-5 text-[15px] leading-8 text-muted"
            style={{ borderColor: "var(--border)" }}
          >
            {verse.translation}
          </div>

          {verse.audio && (
            <button
              onClick={() => play(verse)}
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:border-primary"
              style={{ borderColor: "var(--border)" }}
            >
              {playing === verse.numberInSurah ? (
                <Pause size={17} />
              ) : (
                <Play size={17} />
              )}
              {playing === verse.numberInSurah ? "توقف" : "پخش آیه"}
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
