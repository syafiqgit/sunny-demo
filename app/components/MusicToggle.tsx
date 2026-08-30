"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { Disc3 } from "lucide-react";

export interface MusicToggleHandle {
  /**
   * Start playback.
   *
   * Browsers only honour this from inside a user gesture, which is why it is
   * imperative: it is called straight from the "Open Invitation" click rather
   * than from an effect that merely happens to run afterwards. If the policy
   * refuses anyway the disc simply stays stopped and the reader can start it
   * themselves.
   */
  play: () => void;
}

interface MusicToggleProps {
  src: string;
  /** The control only appears once the invitation has been opened. */
  visible: boolean;
  ref?: Ref<MusicToggleHandle>;
}

// Quiet enough to read over, present enough to be worth playing.
const VOLUME = 0.55;

export default function MusicToggle({ src, visible, ref }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Whether the track was running when the tab went away, so coming back
  // resumes only what the reader had actually left playing.
  const resumeOnReturnRef = useRef(false);

  const getAudio = useCallback(() => {
    let audio = audioRef.current;

    if (!audio) {
      // Built on demand: nothing is fetched for a reader who never opens the
      // invitation, and the track never competes with the cover image for
      // bandwidth on first paint.
      audio = new Audio(src);
      audio.loop = true;
      audio.volume = VOLUME;
      // The element is the source of truth - media keys, the OS and the
      // browser itself can all pause it behind our back.
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    return audio;
  }, [src]);

  const play = useCallback(() => {
    void getAudio()
      .play()
      .catch(() => setIsPlaying(false));
  }, [getAudio]);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (audio.paused) {
      play();
    } else {
      audio.pause();
    }
  }, [getAudio, play]);

  useImperativeHandle(ref, () => ({ play }), [play]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        resumeOnReturnRef.current = !audio.paused;
        audio.pause();
      } else if (resumeOnReturnRef.current) {
        resumeOnReturnRef.current = false;
        void audio.play().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      const audio = audioRef.current;
      if (audio) {
        audio.onplay = null;
        audio.onpause = null;
        audio.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      aria-pressed={isPlaying}
      // Kept mounted but inert before the invitation is opened, so the
      // audio element it owns survives every re-render of the page.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-90 grid h-11 w-11 place-items-center rounded-full bg-[#2a2a2a]/85 text-[#f5f6f1] shadow-lg ring-1 ring-white/25 backdrop-blur-xs transition-[opacity,transform,background-color] duration-500 hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 ${
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none scale-90 opacity-0"
      }`}
    >
      <Disc3
        aria-hidden="true"
        strokeWidth={1.75}
        // The record keeps turning only while the track does. Pausing the
        // animation rather than removing it leaves the disc where it stopped,
        // so starting again carries on instead of snapping back to zero.
        className={`h-6 w-6 animate-spin transition-opacity motion-reduce:animate-none ${
          isPlaying ? "opacity-100" : "opacity-70"
        }`}
        style={{
          animationDuration: "6s",
          animationTimingFunction: "linear",
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      />
    </button>
  );
}
