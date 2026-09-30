"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  audio: string;
};

export default function AudioPlayer({
  audio,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const player = audioRef.current;

    setPlaying(false);
    setError(false);

    if (player) {
      player.pause();
      player.currentTime = 0;
      player.load();
    }
  }, [audio]);

  async function togglePlay() {
    const player = audioRef.current;

    if (!player) return;

    setError(false);

    try {
      if (player.paused) {
        await player.play();
      } else {
        player.pause();
      }
    } catch {
      setPlaying(false);
      setError(true);
    }
  }

  return (
    <div className="mt-4">
      <audio
        ref={audioRef}
        src={audio}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          setError(false);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onEnded={() => {
          setPlaying(false);
        }}
        onError={() => {
          setPlaying(false);
          setError(true);
        }}
      />

      <button
        type="button"
        onClick={togglePlay}
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-black/5"
        style={{
          borderColor: "var(--border)",
        }}
      >
        {playing ? (
          <Pause size={17} />
        ) : (
          <Play size={17} />
        )}

        {playing ? "توقف" : "پخش آیه"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          پخش صوت انجام نشد. لطفاً دوباره تلاش کنید.
        </p>
      )}
    </div>
  );
}
