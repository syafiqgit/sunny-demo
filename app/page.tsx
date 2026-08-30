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
const STAGE_CHAPTERS = [0, 0.29, 0.41, 0.54, 0.74, 1];
const LAST_STAGE_CHAPTER = STAGE_CHAPTERS.length - 1;
// Further wheel/touch input is ignored until this clears, so one gesture
// (a mouse tick, or a whole trackpad swipe, which fires dozens of wheel
// events) advances exactly one chapter.
//
// Sized against the measured first leg, the longest: rest -> groom springs
// for ~1.9s (zoom lands at ~0.8s, the pan runs to ~1.9s). At the old 950ms
// a second scroll arrived with the pan only a third travelled and skipped
// the groom entirely; this holds until the motion has all but settled.
// How far past the last beat MainSection's own scroll carries the stage. The
// stage keyframes run to 1.2, where the closing quote has gone and the camera
// has leaned in - see HANDOFF_ZOOM in Stage.tsx.
const STAGE_HANDOFF_REVEAL = 0.2;
// Where the hand-off flips. The 6 -> 7 boundary is a mandatory snap point, so
// the scroll never rests part-way across it: a wheel tick nudges it forward
// and CSS snap pulls it straight back, over and over. Driving the panel off
// that position made it jitter instead of glide, so the crossing is treated
// as the discrete thing it already is - one flip, then the compositor
// animates the panel and Stage's own spring carries the camera.
const MAIN_SECTION_ENTER = 6.5;
const MAIN_SECTION_ENTER_MS = 700;
// Opening the invitation. The 0 -> 1 boundary is a mandatory snap point like
// the MainSection one, so the crossing is a flip here too and the two layers
// dissolve into each other on their own clock rather than tracking a scroll
// position that snaps. The threshold is low so the blend starts as the scroll
// leaves the cover, not half way to the stage.
// How much of the panel's leading edge is feathered while it is travelling.
// A hard edge on a translucent panel cuts the scene in two - crisp above the
// line, veiled below it - which reads as the panel wedging into the stage
// rather than arriving over it. The feather is only worn in motion; once the
// panel has landed its top edge is the top of the screen and a soft band
// there would just wash out the countdown.
const PANEL_FEATHER = "linear-gradient(to bottom, transparent 0%, #000 18%)";
const COVER_EXIT = 0.2;
const COVER_FADE_MS = 900;
// Where the stage waits while the cover is still up: the top of its own zoom,
// pan still centred (the pan only starts at 0.15). Opening releases it and
// the camera falls back to the resting framing - the same dolly-out the stage
// plays when you retreat from the groom, which is what makes this a reveal
// rather than a cut.
const STAGE_ENTRANCE_REVEAL = 0.15;
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
  // Tracks where the panel has actually come to rest, so it can be compared
  // with where it is headed: the two differ exactly while it is in motion.
  const [panelSettled, setPanelSettled] = useState(false);

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

  // The container is eight empty spacer divs behind the fixed overlay - its
  // scroll position is never itself on screen, and everything visible is
  // derived from thresholds on it. So animating a jump buys nothing and costs
  // the whole travel time before the threshold flips; long jumps pass
  // "instant" and let the layer they hand over to do the animating.
  // ("auto" would not do it - it defers to the container's own
  // scroll-behavior, which is smooth.)
  const scrollToSection = useCallback(
    (sectionIndex: number, behavior: ScrollBehavior = "smooth") => {
      const el = containerRef.current;
      if (!el) return;

      const targetIndex = clamp(sectionIndex, 0, SECTION_COUNT - 1);

      el.scrollTo({
        top: targetIndex * el.clientHeight,
        behavior,
      });
    },
    [],
  );

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
  // release the dock and go straight to MainSection.
  //
  // That last step used to hand off to section 6, where MainSection is still
  // parked off-screen. The reader then had to make a second, separate gesture
  // - and it had to be big enough to clear the 6 -> 7 snap midpoint, or CSS
  // snap pulled it back to 6, so a plain wheel tick got them nowhere. One
  // tick out of the last beat now lands the panel. Section 6 stays what
  // handleBackToStage returns to: the stage's own resting section, not a
  // stop on the way out.
  //
  // The jump itself is instant. Smooth-scrolling six viewport heights held
  // the panel still for ~680ms before the threshold flipped, for a scroll
  // position nobody can see; the panel's own transition is the animation.
  const advanceChapter = useCallback(() => {
    if (chapterLockRef.current) return;
    chapterLockRef.current = true;

    if (stageChapterRef.current >= LAST_STAGE_CHAPTER) {
      chapterModeRef.current = false;
      chapterLockRef.current = false;
      scrollToSection(SECTION_COUNT - 1, "instant");
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
  const mainSectionIn = scrollProgress >= MAIN_SECTION_ENTER;
  // Driven by stageChapter (one wheel/swipe tick = one beat) rather than
  // continuous scroll position - see the wheel/touch handlers above. The one
  // exception is the hand-off out of the last beat, which is a plain scroll:
  // crossing into MainSection carries it on past 1, so the stage is still
  // moving underneath as the panel arrives - the spring inside Stage does the
  // easing, which is why this can be a flip rather than a ramp. Guarded on
  // the last chapter because the scrollbar can be dragged past the dock, and
  // adding the tail to any earlier beat would land on the wrong framing.
  const stageRevealProgress = !hasOpened
    ? STAGE_ENTRANCE_REVEAL
    : STAGE_CHAPTERS[stageChapter] +
      (stageChapter === LAST_STAGE_CHAPTER
        ? STAGE_HANDOFF_REVEAL * Number(mainSectionIn)
        : 0);

  const atStage = coverToStage >= COVER_EXIT;
  // True from the moment the panel is sent on its way until it arrives, in
  // either direction.
  const panelMoving = mainSectionIn !== panelSettled;

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
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: atStage ? 0 : 1,
              transition: `opacity ${COVER_FADE_MS}ms ease-in-out`,
            }}
          >
            <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
          </div>

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: atStage ? 1 : 0,
              transition: `opacity ${COVER_FADE_MS}ms ease-in-out`,
            }}
          >
            {!isLoading && <Stage revealProgress={stageRevealProgress} />}
          </div>

          <div
            className="pointer-events-none absolute inset-0 will-change-transform ease-out"
            onTransitionEnd={(event) => {
              if (event.propertyName === "transform") {
                setPanelSettled(mainSectionIn);
              }
            }}
            style={{
              transform: mainSectionIn
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, 100%, 0)",
              transitionProperty: "transform",
              transitionDuration: `${MAIN_SECTION_ENTER_MS}ms`,
              maskImage: panelMoving ? PANEL_FEATHER : undefined,
              WebkitMaskImage: panelMoving ? PANEL_FEATHER : undefined,
            }}
          >
            {!isLoading && <MainSection onBackToStage={handleBackToStage} />}
          </div>
        </div>
      </div>
    </main>
  );
}
