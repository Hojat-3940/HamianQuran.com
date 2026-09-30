"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  audio?: string;
};

export default function AudioPlayer({
  audio = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const player = audioRef.current;

    if (!player) return;

    player.pause();
    player.currentTime = 0;
    setPlaying(false);
    setError("");

    player.load();
  }, [audio]);

  async function playAudio() {
    const player = audioRef.current;

    if (!player) return;

    setError("");

    try {
      if (player.paused) {
        await player.play();
      } else {
        player.pause();
      }
    } catch (err) {
      console.error("Audio playback error:", err);
      setPlaying(false);
      setError("پخش صوت انجام نشد. دوباره تلاش کنید.");
    }
  }

  return (
    <div className="mt-4">
      <audio
        ref={audioRef}
        preload="auto"
        src={audio}
        onPlay={() => {
          setPlaying(true);
          setError("");
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onEnded={() => {
          setPlaying(false);
        }}
        onError={() => {
          setPlaying(false);
          setError("فایل صوتی قابل پخش نیست.");
        }}
      />

      <button
        type="button"
        onClick={playAudio}
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-95 hover:bg-black/5"
        style={{
          borderColor: "var(--border)",
        }}
        aria-label={playing ? "توقف صوت" : "پخش صوت"}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}

        {playing ? "توقف صوت" : "پخش صوت"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
