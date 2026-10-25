
"use client";

import { useEffect, useRef, useState } from "react";

const verses = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  "الرَّحْمَٰنِ الرَّحِيمِ",
  "مَالِكِ يَوْمِ الدِّينِ",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
  "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
  "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
];

const audioUrl = (ayah: number) =>
  `https://lswterikzwmldijimxrg.supabase.co/storage/v1/object/public/member-media/00100${ayah}.mp3`;

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ayah, setAyah] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const playAyah = async (number: number) => {
    setError("");

    const audio = new Audio(audioUrl(number));
    audioRef.current?.pause();
    audioRef.current = audio;

    audio.onended = () => {
      if (audioRef.current !== audio) return;

      if (number < 7) {
        setAyah(number + 1);
        void playAyah(number + 1);
      } else {
        setPlaying(false);
      }
    };

    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      setPlaying(false);
      setError("پخش فایل صوتی ناموفق بود. اتصال اینترنت را بررسی کنید.");
    };

    try {
      await audio.play();

      if (audioRef.current === audio) {
        setPlaying(true);
      }
    } catch {
      if (audioRef.current === audio) {
        setPlaying(false);
        setError("پخش صوت انجام نشد. دوباره دکمه پخش را بزنید.");
      }
    }
  };

  const playAudio = async () => {
    setError("");

    const audio = audioRef.current;

    if (audio && !audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (audio && audio.src === audioUrl(ayah)) {
      try {
        await audio.play();
        if (audioRef.current === audio) setPlaying(true);
      } catch {
        if (audioRef.current === audio) {
          setPlaying(false);
          setError("پخش صوت انجام نشد. دوباره تلاش کنید.");
        }
      }
      return;
    }

    await playAyah(ayah);
  };

  const changeAyah = (next: number) => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setError("");
    setAyah(next);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        marginTop: 20,
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 27,
          lineHeight: 2,
          marginBottom: 10,
        }}
      >
        {verses[ayah - 1]}
      </div>

      <div style={{ marginBottom: 16, color: "#666" }}>
        سوره حمد — آیه {ayah} از ۷
      </div>

      <button
        onClick={playAudio}
        style={{
          padding: "12px 22px",
          margin: 5,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontSize: 17,
        }}
      >
        {playing ? "⏸ توقف" : "🔊 پخش صوت"}
      </button>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => changeAyah(Math.max(1, ayah - 1))}
          disabled={ayah === 1}
          style={{ padding: 10, margin: 5 }}
        >
          آیه قبلی
        </button>

        <button
          onClick={() => changeAyah(Math.min(7, ayah + 1))}
          disabled={ayah === 7}
          style={{ padding: 10, margin: 5 }}
        >
          آیه بعدی
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
}

