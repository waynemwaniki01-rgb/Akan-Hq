import { useEffect, useRef, useState } from "react";
import { SECTION_MUSIC } from "./section-music";

export interface SectionMusicControls {
  isMuted: boolean;
  isPlaying: boolean;
  volume: number; // 0 to 1
  toggleMute: () => void;
  togglePlayPause: () => void;
  restart: () => void;
  setVolume: (v: number) => void;
}

export function useSectionMusic(sectionId: string | null | undefined): SectionMusicControls {
  const nextSrc = sectionId ? SECTION_MUSIC[sectionId] ?? null : null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const volumeRef = useRef(1);

  // This effect is keyed off `nextSrc` (the actual file path), NOT
  // `sectionId`. That's the important part: several section ids can
  // map to the same file (e.g. My Cards/Coaches/Training/Matches/
  // Calendar all -> card-section.mp3, or Board/Simulate/Possession/
  // Compare all -> workspace.mp3). Because React always runs the
  // previous effect's cleanup before the next effect body when a
  // dependency changes, keying this off `sectionId` would pause and
  // wipe the <audio> element on every tab switch even when the file
  // was staying the same — causing a pause-then-restart glitch.
  // Keying off `nextSrc` means the effect (and its cleanup) only runs
  // when the file path actually changes.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);

    if (!nextSrc) return;

    const audio = new Audio(nextSrc);
    audio.loop = true;
    audio.muted = isMuted;
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    const tryPlay = () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const retry = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
            document.removeEventListener("click", retry);
            document.removeEventListener("keydown", retry);
            document.removeEventListener("touchstart", retry);
          };
          document.addEventListener("click", retry, { once: true });
          document.addEventListener("keydown", retry, { once: true });
          document.addEventListener("touchstart", retry, { once: true });
        });
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextSrc]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const setVolume = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    volumeRef.current = clamped;
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped > 0 && audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  return { isMuted, isPlaying, volume, toggleMute, togglePlayPause, restart, setVolume };
}