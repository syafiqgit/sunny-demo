"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "@/app/components/Stage";
import MainSection from "./components/MainSection";

const SECTION_COUNT = 8;
const LOADING_DURATION_MS = 2000;
const OPEN_THRESHOLD = 0.5;

// Each entry is the stageRevealProgress value for that beat of the story -
// groom; bride; the empty-grass event framing; dress code; closing quote -
// lifted straight from the hold windows already tuned into Stage.tsx's own
// keyframes. One wheel/swipe tick moves exactly one entry; the spring inside
// Stage does the animating between them.
//
// There is no separate "centred, no pan" stop: the very first tick springs
// straight from rest (0) to the groom hold (0.29), and the centred framing
// only appears as a mid-flight moment of that one continuous animation -
// stopping there as its own tick read as the zoom stalling, requiring a
// second scroll just to carry on to the groom.
const STAGE_CHAPTERS = [0, 0.29, 0.41, 0.54, 0.84, 1];
const LAST_STAGE_CHAPTER = STAGE_CHAPTERS.length - 1;
// Further wheel/touch input is ignored until this clears, so one gesture
// (a mouse tick, or a whole trackpad swipe, which fires dozens of wheel
// events) advances exactly one chapter.
//
// Sized against the measured first leg, the longest: rest -> groom springs
// for ~1.9s (zoom lands at ~0.8s, the pan runs to ~1.9s). At the old 950ms
// a second scroll arrived with the pan only a third travelled and skipped
// the groom entirely; this holds until the motion has all but settled.
const CHAPTER_LOCK_MS = 1500;
const WHEEL_THRESHOLD = 4;
const TOUCH_THRESHOLD = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const [stageChapter, setStageChapter] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  // Whether wheel/touch input is currently being intercepted to drive
  // stageChapter instead of native scroll - i.e. "docked" at the stage.
  const chapterModeRef = useRef(false);
  const chapterLockRef = useRef(false);
  const chapterLockTimerRef = useRef<number | null>(null);
  const stageChapterRef = useRef(0);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (scrollProgress >= OPEN_THRESHOLD && !hasOpened) {
      setHasOpened(true);
    }
  }, [scrollProgress, hasOpened]);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;

      const rawProgress = el.scrollTop / el.clientHeight;
      const clampedProgress = clamp(rawProgress, 0, SECTION_COUNT - 1);

      if (clampedProgress !== lastProgressRef.current) {
        lastProgressRef.current = clampedProgress;
        setScrollProgress(clampedProgress);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (openFrameRef.current !== null) {
        cancelAnimationFrame(openFrameRef.current);
      }
    };
  }, []);

  const scrollToSection = useCallback((sectionIndex: number) => {
    const el = containerRef.current;
    if (!el) return;

    const targetIndex = clamp(sectionIndex, 0, SECTION_COUNT - 1);

    el.scrollTo({
      top: targetIndex * el.clientHeight,
      behavior: "smooth",
    });
  }, []);

  const releaseChapterLock = useCallback(() => {
    if (chapterLockTimerRef.current !== null) {
      window.clearTimeout(chapterLockTimerRef.current);
    }
    chapterLockTimerRef.current = window.setTimeout(() => {
      chapterLockRef.current = false;
      chapterLockTimerRef.current = null;
    }, CHAPTER_LOCK_MS);
  }, []);

  // One tick forward: advance to the next beat, or - from the last one -
  // release the dock and hand off to native scroll into MainSection, at the
  // exact section (6) whose stageRevealProgress the last chapter already
  // matches, so nothing visually jumps at the handoff.
  const advanceChapter = useCallback(() => {
    if (chapterLockRef.current) return;
    chapterLockRef.current = true;

    if (stageChapterRef.current >= LAST_STAGE_CHAPTER) {
      chapterModeRef.current = false;
      chapterLockRef.current = false;
      scrollToSection(6);
      return;
    }

    const next = stageChapterRef.current + 1;
    stageChapterRef.current = next;
    setStageChapter(next);
    releaseChapterLock();
  }, [releaseChapterLock, scrollToSection]);

  // One tick back: retreat a beat, or - from the first one - undock and
  // hand back to the cover.
  const retreatChapter = useCallback(() => {
    if (chapterLockRef.current) return;
    chapterLockRef.current = true;

    if (stageChapterRef.current <= 0) {
      chapterModeRef.current = false;
      chapterLockRef.current = false;
      scrollToSection(0);
      return;
    }

    const next = stageChapterRef.current - 1;
    stageChapterRef.current = next;
    setStageChapter(next);
    releaseChapterLock();
  }, [releaseChapterLock, scrollToSection]);

  const handleOpen = useCallback(() => {
    setHasOpened(true);
    stageChapterRef.current = 0;
    setStageChapter(0);
    chapterModeRef.current = true;

    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
    }

    openFrameRef.current = requestAnimationFrame(() => {
      scrollToSection(1);
      openFrameRef.current = null;
    });
  }, [scrollToSection]);

  const handleBackToStage = useCallback(() => {
    chapterModeRef.current = true;
    scrollToSection(6);
  }, [scrollToSection]);

  // Safety net for reaching the stage by plain continuous scroll instead of
  // the "Open Invitation" button or handleBackToStage - both of those set
  // chapterModeRef directly, but a user who retreats to the cover and then
  // just scrolls forward natively wouldn't otherwise re-engage the dock, and
  // stageRevealProgress (chapter-driven, not scroll-driven) would sit frozen
  // while scrollProgress sailed straight past it to MainSection.
  //
  // Must only fire on the rising edge (crossing up into >=1 from below) -
  // advanceChapter's own hand-off to MainSection also releases chapterMode
  // and drives scrollProgress from 1 up to 6, and without the "from below 1"
  // guard this effect re-triggers on that same climb and snaps it straight
  // back to section 1, undoing the hand-off before it can land.
  const prevScrollProgressRef = useRef(0);
  useEffect(() => {
    const prev = prevScrollProgressRef.current;
    prevScrollProgressRef.current = scrollProgress;

    if (hasOpened && !chapterModeRef.current && prev < 1 && scrollProgress >= 1) {
      chapterModeRef.current = true;
      scrollToSection(1);
    }
  }, [scrollProgress, hasOpened, scrollToSection]);

  // Docked at the stage (chapterModeRef true), wheel/touch input is
  // intercepted here and drives stageChapter one tick at a time instead of
  // scrolling the container - native scroll stays untouched everywhere else
  // (cover entrance, the section-6/MainSection boundary, MainSection's own
  // free scroll), so the chapter lock never fights those.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      if (!chapterModeRef.current) return;
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      event.preventDefault();
      if (event.deltaY > 0) {
        advanceChapter();
      } else {
        retreatChapter();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!chapterModeRef.current) return;

      const currentY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchStartYRef.current - currentY;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      if (deltaY > 0) {
        advanceChapter();
      } else {
        retreatChapter();
      }
      touchStartYRef.current = currentY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      if (chapterLockTimerRef.current !== null) {
        window.clearTimeout(chapterLockTimerRef.current);
      }
    };
  }, [advanceChapter, retreatChapter]);

  const coverToStage = clamp(scrollProgress, 0, 1);
  // Driven by stageChapter (one wheel/swipe tick = one beat) rather than
  // continuous scroll position - see the wheel/touch handlers above.
  const stageRevealProgress = STAGE_CHAPTERS[stageChapter];
  const mainSectionProgress = clamp(scrollProgress - 6, 0, 1);

  const coverOpacity = clamp(1 - coverToStage * 2, 0, 1);
  const stageOpacity = clamp(coverToStage * 2, 0, 1);

  return (
    <main aria-busy={isLoading} className="mobile-canvas relative">
      <div
        aria-hidden={!isLoading}
        className={`absolute inset-0 z-100 flex items-center justify-center bg-black/25 transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="animate-pulse font-serif text-7xl text-white drop-shadow-md md:text-8xl">
          A
        </span>
      </div>

      <div className="relative h-dvh w-full overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={`absolute inset-0 z-0 snap-y snap-mandatory overscroll-y-contain scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden ${
            !hasOpened ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {Array.from({ length: SECTION_COUNT }, (_, sectionIndex) => (
            <div key={sectionIndex} className="h-dvh snap-start snap-always" />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{ opacity: coverOpacity }}
          >
            <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
          </div>

          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{ opacity: stageOpacity }}
          >
            {!isLoading && <Stage revealProgress={stageRevealProgress} />}
          </div>

          <div
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={{
              transform: `translate3d(0, ${(1 - mainSectionProgress) * 100}%, 0)`,
            }}
          >
            {!isLoading && <MainSection onBackToStage={handleBackToStage} />}
          </div>
        </div>
      </div>
    </main>
  );
}
