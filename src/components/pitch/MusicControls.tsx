import { Volume2, VolumeX, Pause, Play, RotateCcw } from "lucide-react";
import type { SectionMusicControls } from "@/lib/pitch/useSectionMusic";

export function MusicControls({ controls }: { controls: SectionMusicControls }) {
  const { isMuted, isPlaying, volume, toggleMute, togglePlayPause, restart, setVolume } = controls;

  return (
    <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
      <button
        onClick={togglePlayPause}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="text-white/80 hover:text-white"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        className="text-white/80 hover:text-white"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        aria-label="Music volume"
        className="h-1 w-16 cursor-pointer accent-white/80"
      />
      <button
        onClick={restart}
        aria-label="Restart music"
        className="text-white/80 hover:text-white"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}