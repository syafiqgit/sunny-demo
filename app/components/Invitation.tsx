"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import MusicToggle, { type MusicToggleHandle } from "./MusicToggle";
import CoverPage from "@/app/components/sections/CoverPage";
import MainSection from "@/app/components/sections/MainSection";
import Stage from "@/app/components/stage/Stage";
import { useChapterScroll } from "@/app/hooks/useChapterScroll";
import type { TemplateConfig } from "@/app/lib/content";

interface InvitationProps {
  /** Seluruh isi tema. Lihat app/lib/content.ts. */
  template: TemplateConfig;
}

const SECTION_COUNT = 8;
const LOADING_DURATION_MS = 2000;

// Nama tamu datang dari query string (?to=Budi), dibaca di sisi klien.
//
// Bukan lewat `searchParams` di server: itu membuat route-nya dinamis dan
// membatalkan prerender. Bukan pula setState di dalam effect - store di bawah
// tidak pernah memancarkan perubahan, jadi React merender snapshot server
// (undefined) ke HTML lalu merender ulang dengan snapshot klien begitu
// hydration selesai. Persis satu transisi, dan itu masih tertutup layar
// loading 2 detik sehingga pergantiannya tidak terlihat. Pola yang sama
// dipakai RsvpWishes untuk membaca jam pembaca.
const GUEST_PARAM = "to";
const GUEST_NAME_MAX = 60;

// Snapshot harus stabil antar-render, jadi hasilnya di-cache dan hanya dihitung
// ulang kalau query string-nya benar-benar berubah (navigasi antar-undangan di
// sisi klien).
let cachedSearch: string | null = null;
let cachedGuestName: string | undefined;

const subscribeNever = () => () => {};

function getGuestName(): string | undefined {
  const search = window.location.search;
  if (search !== cachedSearch) {
    cachedSearch = search;
    const raw = new URLSearchParams(search).get(GUEST_PARAM);
    cachedGuestName = raw?.trim().slice(0, GUEST_NAME_MAX) || undefined;
  }
  return cachedGuestName;
}

const getServerGuestName = () => undefined;

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
// events) advances exactly one chapter. Sized against the measured first leg,
// the longest: rest -> groom springs for ~1.9s (the zoom lands at ~0.8s, the
// pan runs to ~1.9s). At the old 950ms a second scroll arrived with the pan
// only a third travelled and skipped the groom entirely.
const CHAPTER_LOCK_MS = 1500;

// How far past the last beat MainSection's own scroll carries the stage. The
// stage keyframes run to 1.2, where the closing quote has gone and the camera
// has leaned in - see HANDOFF_ZOOM in Stage.tsx.
const STAGE_HANDOFF_REVEAL = 0.2;
// Where the stage waits while the cover is still up: the top of its own zoom,
// pan still centred (the pan only starts at 0.15). Opening releases it and
// the camera falls back to the resting framing - the same dolly-out the stage
// plays when you retreat from the groom, which is what makes this a reveal
// rather than a cut.
const STAGE_ENTRANCE_REVEAL = 0.15;

// Where the hand-off flips. The 6 -> 7 boundary is a mandatory snap point, so
// the scroll never rests part-way across it: a wheel tick nudges it forward
// and CSS snap pulls it straight back, over and over. Driving the panel off
// that position made it jitter instead of glide, so the crossing is treated
// as the discrete thing it already is - one flip, then the compositor
// animates the panel and Stage's own spring carries the camera.
const MAIN_SECTION_ENTER = 6.5;
const MAIN_SECTION_ENTER_MS = 700;

// Opening the invitation. The 0 -> 1 boundary is a mandatory snap point like
// the MainSection one, so this crossing is a flip too and the two layers
// dissolve into each other on their own clock rather than tracking a scroll
// position that snaps. The threshold is low so the blend starts as the scroll
// leaves the cover, not half way to the stage.
const COVER_EXIT = 0.2;
const COVER_FADE_MS = 900;
const OPEN_THRESHOLD = 0.5;

// How much of the panel's leading edge is feathered while it is travelling.
// A hard edge on a translucent panel cuts the scene in two - crisp above the
// line, veiled below it - which reads as the panel wedging into the stage
// rather than arriving over it. The feather is only worn in motion; once the
// panel has landed its top edge is the top of the screen and a soft band
// there would just wash out the countdown.
const PANEL_FEATHER = "linear-gradient(to bottom, transparent 0%, #000 18%)";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Invitation({ template }: InvitationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const guestName = useSyncExternalStore(
    subscribeNever,
    getGuestName,
    getServerGuestName,
  );
  const [hasOpened, setHasOpened] = useState(false);
  const [stageChapter, setStageChapter] = useState(0);
  // The scroll position itself is never on screen - only these two thresholds
  // on it are. Keeping them as booleans rather than as the raw progress is
  // what stops every scroll frame from re-rendering the whole tree (and with
  // it the stage, the cover and the panel) for a number nothing renders.
  const [atStage, setAtStage] = useState(false);
  const [mainSectionIn, setMainSectionIn] = useState(false);
  // Where the panel has actually come to rest, so it can be compared with
  // where it is headed: the two differ exactly while it is in motion.
  const [panelSettled, setPanelSettled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const hasOpenedRef = useRef(false);

  // Whether wheel/touch input is currently being intercepted to drive
  // stageChapter instead of native scroll - i.e. "docked" at the stage.
  const chapterModeRef = useRef(false);
  const chapterLockRef = useRef(false);
  const chapterLockTimerRef = useRef<number | null>(null);
  const stageChapterRef = useRef(0);
  const musicRef = useRef<MusicToggleHandle>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsLoading(false),
      LOADING_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (openFrameRef.current !== null) {
        cancelAnimationFrame(openFrameRef.current);
      }
      if (chapterLockTimerRef.current !== null) {
        window.clearTimeout(chapterLockTimerRef.current);
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

      el.scrollTo({
        top: clamp(sectionIndex, 0, SECTION_COUNT - 1) * el.clientHeight,
        behavior,
      });
    },
    [],
  );

  // Re-engaging the dock after a plain continuous scroll. Both "Open
  // Invitation" and handleBackToStage set chapterModeRef directly, but a
  // reader who retreats to the cover and then simply scrolls forward natively
  // would not otherwise re-dock, and stageRevealProgress (chapter-driven, not
  // scroll-driven) would sit frozen while the scroll sailed past it.
  //
  // Only on the rising edge: the hand-off out of the last beat also releases
  // chapterMode and drives the scroll from 1 up to 7, and without the "from
  // below 1" guard that same climb would snap it straight back to section 1.
  const readScrollPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el || el.clientHeight === 0) return;

    const previous = progressRef.current;
    const progress = clamp(
      el.scrollTop / el.clientHeight,
      0,
      SECTION_COUNT - 1,
    );
    progressRef.current = progress;

    if (!hasOpenedRef.current && progress >= OPEN_THRESHOLD) {
      hasOpenedRef.current = true;
      setHasOpened(true);
    }

    setAtStage(progress >= COVER_EXIT);
    setMainSectionIn(progress >= MAIN_SECTION_ENTER);

    if (
      hasOpenedRef.current &&
      !chapterModeRef.current &&
      previous < 1 &&
      progress >= 1
    ) {
      chapterModeRef.current = true;
      scrollToSection(1);
    }
  }, [scrollToSection]);

  // One read per frame at most. Scroll events outrun the display on every
  // platform, and coalescing them here is what keeps the handler off the
  // critical path of the compositor.
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      readScrollPosition();
    });
  }, [readScrollPosition]);

  const lockChapter = useCallback(() => {
    chapterLockRef.current = true;
    if (chapterLockTimerRef.current !== null) {
      window.clearTimeout(chapterLockTimerRef.current);
    }
    chapterLockTimerRef.current = window.setTimeout(() => {
      chapterLockRef.current = false;
      chapterLockTimerRef.current = null;
    }, CHAPTER_LOCK_MS);
  }, []);

  const goToChapter = useCallback(
    (next: number) => {
      stageChapterRef.current = next;
      setStageChapter(next);
      lockChapter();
    },
    [lockChapter],
  );

  // One tick forward: advance to the next beat, or - from the last one -
  // release the dock and go straight to MainSection.
  //
  // That last step used to hand off to section 6, where MainSection is still
  // parked off-screen; the reader then had to make a second gesture big enough
  // to clear the 6 -> 7 snap midpoint, so a plain wheel tick got them nowhere.
  // Section 6 stays what handleBackToStage returns to: the stage's own resting
  // section, not a stop on the way out. The jump itself is instant - smooth-
  // scrolling six viewport heights held the panel still for ~680ms before the
  // threshold flipped, for a scroll position nobody can see.
  const advanceChapter = useCallback(() => {
    if (chapterLockRef.current) return;

    if (stageChapterRef.current >= LAST_STAGE_CHAPTER) {
      chapterModeRef.current = false;
      scrollToSection(SECTION_COUNT - 1, "instant");
      return;
    }

    goToChapter(stageChapterRef.current + 1);
  }, [goToChapter, scrollToSection]);

  // One tick back: retreat a beat, or - from the first one - undock and hand
  // back to the cover.
  const retreatChapter = useCallback(() => {
    if (chapterLockRef.current) return;

    if (stageChapterRef.current <= 0) {
      chapterModeRef.current = false;
      scrollToSection(0);
      return;
    }

    goToChapter(stageChapterRef.current - 1);
  }, [goToChapter, scrollToSection]);

  useChapterScroll({
    targetRef: containerRef,
    activeRef: chapterModeRef,
    onForward: advanceChapter,
    onBackward: retreatChapter,
  });

  const handleOpen = useCallback(() => {
    // First, and synchronously: this is the reader's one deliberate click, and
    // every autoplay policy wants the play() call inside that gesture.
    musicRef.current?.play();

    hasOpenedRef.current = true;
    setHasOpened(true);
    stageChapterRef.current = 0;
    setStageChapter(0);
    chapterModeRef.current = true;

    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
    }
    openFrameRef.current = requestAnimationFrame(() => {
      openFrameRef.current = null;
      scrollToSection(1);
    });
  }, [scrollToSection]);

  const handleBackToStage = useCallback(() => {
    chapterModeRef.current = true;
    scrollToSection(6);
  }, [scrollToSection]);

  // Driven by stageChapter (one wheel/swipe tick = one beat) rather than by
  // continuous scroll position. The one exception is the hand-off out of the
  // last beat, which is a plain scroll: crossing into MainSection carries the
  // camera on past 1, so the stage is still moving underneath as the panel
  // arrives - the spring inside Stage does the easing, which is why this can
  // be a flip rather than a ramp. Guarded on the last chapter because the
  // scrollbar can be dragged past the dock, and adding the tail to any
  // earlier beat would land on the wrong framing.
  const stageRevealProgress = !hasOpened
    ? STAGE_ENTRANCE_REVEAL
    : STAGE_CHAPTERS[stageChapter] +
      (stageChapter === LAST_STAGE_CHAPTER && mainSectionIn
        ? STAGE_HANDOFF_REVEAL
        : 0);

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
          className={`scrollbar-none absolute inset-0 z-0 snap-y snap-mandatory scroll-smooth overscroll-y-contain ${
            hasOpened ? "overflow-y-auto" : "overflow-hidden"
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
            <CoverPage
              coupleNames={template.coupleNames}
              weddingDate={template.weddingDate}
              coverImage={template.coverImage}
              guestName={guestName}
              onOpen={handleOpen}
              hasOpened={hasOpened}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: atStage ? 1 : 0,
              transition: `opacity ${COVER_FADE_MS}ms ease-in-out`,
            }}
          >
            {!isLoading && (
              <Stage
                {...template.stage}
                coupleNames={template.coupleNames}
                revealProgress={stageRevealProgress}
              />
            )}
          </div>

          <div
            className="pointer-events-none absolute inset-0 ease-out"
            onTransitionEnd={(event) => {
              // Guarded against bubbling: a button's own transition inside the
              // panel would otherwise be read as the panel landing.
              if (
                event.target === event.currentTarget &&
                event.propertyName === "transform"
              ) {
                setPanelSettled(mainSectionIn);
              }
            }}
            style={{
              transform: mainSectionIn
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, 100%, 0)",
              transitionProperty: "transform",
              transitionDuration: `${MAIN_SECTION_ENTER_MS}ms`,
              // Both hints are worn only in flight. A permanent will-change
              // keeps a full-screen compositor layer alive behind everything
              // else, and the feather costs a masking pass on a panel that is
              // already translucent and blurring what sits under it.
              willChange: panelMoving ? "transform" : undefined,
              maskImage: panelMoving ? PANEL_FEATHER : undefined,
              WebkitMaskImage: panelMoving ? PANEL_FEATHER : undefined,
            }}
          >
            {!isLoading && (
              <MainSection
                template={template}
                onBackToStage={handleBackToStage}
              />
            )}
          </div>
        </div>
      </div>

      <MusicToggle ref={musicRef} src={template.musicSrc} visible={hasOpened} />
    </main>
  );
}
