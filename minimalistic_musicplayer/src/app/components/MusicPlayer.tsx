import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { tracks } from "../data/tracks";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // 4:05 als Beispiel
  const [volume, setVolume] = useState(70);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];

  // Simuliere Audio-Wiedergabe
  useEffect(() => {
    let interval: number;
    if (isPlaying && currentTime < duration) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch (error) {
      console.error("Playback could not be started:", error);
    }
  };

  const changeTrack = async (direction: -1 | 1) => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = isPlaying;

    if (isPlaying) {
      audio.pause();
    }

    setCurrentTrackIndex(
      (prev) => (prev + direction + tracks.length) % tracks.length,
    );

    if (!wasPlaying) return;

    queueMicrotask(async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error("Playback could not be resumed:", error);
      }
    });
  };



  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      setCurrentTime(Math.floor(percentage * duration));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="w-full max-w-md mx-auto px-8 py-10 bg-neutral-50 rounded-2xl shadow-sm border border-neutral-200">
      <div className="flex items-center justify-center gap-5 mb-8">
        <button
          type="button"
          onClick={() => changeTrack(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition-all hover:bg-neutral-300 active:scale-95"
          aria-label="Previous track"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={togglePlayPause}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-neutral-900 text-white transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-white" />
          ) : (
            <Play className="w-7 h-7 fill-white ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={() => changeTrack(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 transition-all hover:bg-neutral-300 active:scale-95"
          aria-label="Next track"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="relative h-1.5 bg-neutral-200 rounded-full cursor-pointer group"
        >
          <div
            className="absolute h-full bg-neutral-900 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between mb-8 text-sm text-neutral-600">
        <span className="font-mono">{formatTime(currentTime)}</span>
        <span className="font-mono">{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="w-5 h-5 text-neutral-600 flex-shrink-0" />
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(23 23 23) 0%, rgb(23 23 23) ${volume}%, rgb(229 229 229) ${volume}%, rgb(229 229 229) 100%)`,
            }}
            aria-label="Lautstärke"
          />
        </div>
        <span className="text-sm text-neutral-600 font-mono w-8 text-right">
          {volume}
        </span>
      </div>

      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        src={currentTrack.src}
        preload="metadata"
        onLoadedMetadata={() => setDuration(Math.floor(audioRef.current?.duration ?? 0))}
        onTimeUpdate={() => setCurrentTime(Math.floor(audioRef.current?.currentTime ?? 0))}
        onEnded={() => {
          changeTrack(1);
        }}
      />
    </div>
  );
}
