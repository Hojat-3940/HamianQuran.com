"use client";

import { useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const audioUrl =
    "https://verses.quran.foundation/Alafasy/mp3/001001.mp3";

  const playAudio = async () => {
    setError("");

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);

        audioRef.current.onended = () => {
          setPlaying(false);
        };

        audioRef.current.onerror = () => {
          setPlaying(false);
          setError("پخش صوت با خطا مواجه شد.");
        };
      }

      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (err) {
      console.error(err);
      setPlaying(false);
      setError("مرورگر اجازه پخش صوت را نداد.");
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          lineHeight: "2",
          marginBottom: "10px",
        }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>

      <div style={{ marginBottom: "15px", color: "#666" }}>
        سوره حمد — آیه ۱
      </div>

      <button
        onClick={playAudio}
        style={{
          padding: "12px 25px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {playing ? "⏸ توقف" : "🔊 پخش صوت"}
      </button>

      {error && (
        <div style={{ marginTop: "12px", color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
}
