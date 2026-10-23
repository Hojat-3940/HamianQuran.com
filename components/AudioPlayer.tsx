"use client";

import { useRef, useState } from "react";

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

  const playAudio = async () => {
    setError("");

    try {
      let audio = audioRef.current;

      if (!audio || audio.src !== audioUrl(ayah)) {
        audio?.pause();
        audio = new Audio(audioUrl(ayah));
        audioRef.current = audio;

        audio.onended = () => setPlaying(false);
        audio.onerror = () => {
          setPlaying(false);
          setError("فایل صوتی باز نشد. لینک یا دسترسی فایل را بررسی کنید.");
        };
      }

      if (!audio.paused) {
        audio.pause();
        setPlaying(false);
        return;
      }

      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setError("پخش صوت انجام نشد. دوباره تلاش کنید.");
    }
  };

  const changeAyah = (next: number) => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(false);
    setError("");
    setAyah(next);
  };

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
