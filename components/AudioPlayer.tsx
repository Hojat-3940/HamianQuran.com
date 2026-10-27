
"use client";

import { useEffect, useRef, useState } from "react";

const SUPABASE_BASE =
  "https://lswterikzwmldijimxrg.supabase.co/storage/v1/object/public/member-media/Untitled%20folder";

const audioUrl = (ayah: number) =>
  `${SUPABASE_BASE}/00100${ayah}.mp3`;

const verses = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  "الرَّحْمَٰنِ الرَّحِيمِ",
  "مَالِكِ يَوْمِ الدِّينِ",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
  "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
  "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
];

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ayah, setAyah] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  async function playAyah(number: number) {
    audioRef.current?.pause();

    const audio = new Audio(audioUrl(number));
    audioRef.current = audio;
    setAyah(number);
    setError("");

    audio.onended = () => {
      if (audioRef.current !== audio) return;

      if (number < 7) {
        void playAyah(number + 1);
      } else {
        setPlaying(false);
      }
    };

    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      setPlaying(false);
      setError(
        `پخش فایل صوتی آیه ${number} ناموفق بود. مسیر فایل را بررسی کنید.`
      );
    };

    try {
      await audio.play();
      if (audioRef.current === audio) {
        setPlaying(true);
      }
    } catch {
      if (audioRef.current === audio) {
        setPlaying(false);
        setError("پخش صوت انجام نشد. دوباره تلاش کنید.");
      }
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    setError("");

    if (audio && !audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (audio && audio.src === audioUrl(ayah)) {
      try {
        await audio.play();
        if (audioRef.current === audio) {
          setPlaying(true);
        }
      } catch {
        setPlaying(false);
        setError("پخش صوت انجام نشد. دوباره تلاش کنید.");
      }
      return;
    }

    await playAyah(ayah);
  }

  function changeAyah(next: number) {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setError("");
    setAyah(next);
  }

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <section
      dir="rtl"
      className="mt-5 rounded-xl border p-5 text-center"
    >
      <p className="mb-2 text-xl font-bold">
        صوت ترجمه فارسی سوره حمد
      </p>

      <p className="mb-3 text-sm text-muted">
        آیه {ayah} از ۷
      </p>

      <p className="mb-4 text-lg leading-9">
        {verses[ayah - 1]}
      </p>

      <button
        type="button"
        onClick={togglePlayback}
        className="rounded-xl border px-5 py-3"
      >
        {playing ? "⏸ توقف" : "🔊 پخش صوت ترجمه"}
      </button>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          disabled={ayah === 1}
          onClick={() => changeAyah(ayah - 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          آیه قبلی
        </button>

        <button
          type="button"
          disabled={ayah === 7}
          onClick={() => changeAyah(ayah + 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          آیه بعدی
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
