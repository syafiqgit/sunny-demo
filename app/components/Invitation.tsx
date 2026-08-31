"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useMotionValue } from "framer-motion";
import MusicToggle, { type MusicToggleHandle } from "./MusicToggle";
import CoverPage from "@/app/components/sections/CoverPage";
import MainSection from "@/app/components/sections/MainSection";
import Stage from "@/app/components/stage/Stage";
import { useWheelScrub } from "@/app/hooks/useWheelScrub";
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

// The stage's reveal value at each beat of the story - groom; bride; the
// empty-grass event framing; dress code; closing quote - lifted straight from
// the hold windows already tuned into Stage.tsx's own keyframes. One entry per
// section of the scroller, starting at section 1.
//
// These are interpolated, not stepped through. The scroll position between two
// sections lands the camera between their two entries, so the whole move stays
// under the gesture: a finger - or a trackpad swipe, via useWheelScrub - drags
// the camera, and it comes to rest on the beat the gesture ended nearest.
//
// That is what replaced intercepting every gesture to *fire* the camera at the
// next beat. A fired camera cannot be steered, cannot be stopped part way, and
// has to be protected by a deaf period long enough to cover its own slowest
// leg - 1.5s, measured against the first. All three went away.
//
// There is still no separate "centred, no pan" stop: the first leg runs
// straight from rest (0) to the groom hold (0.29), and the centred framing is
// only a moment it passes through - stopping there as its own section read as
// the zoom stalling.
const STAGE_CHAPTERS = [0, 0.29, 0.41, 0.54, 0.74, 1];
const STAGE_FIRST_SECTION = 1;
const STAGE_LAST_SECTION = STAGE_FIRST_SECTION + STAGE_CHAPTERS.length - 1;

// How far past the last beat the arrival of MainSection carries the stage. The
// stage keyframes run to 1.2, where the closing quote has gone and the camera
// has leaned in - see HANDOFF_ZOOM in Stage.tsx.
//
// A flip rather than a ramp, unlike every beat above it: the 6 -> 7 boundary is
// a mandatory snap point, so the scroll never rests part way across it, and
// reading a position that snaps back and forth would jitter the camera. It
// rides the same threshold the panel does, and the spring inside Stage turns
// the flip back into a move.
const STAGE_HANDOFF_REVEAL = 0.2;
// Where the stage waits while the cover is still up: the top of its own zoom,
// pan still centred (the pan only starts at 0.15). Opening releases it and
// the camera falls back to the resting framing - the same dolly-out the stage
// plays when you retreat from the groom, which is what makes this a reveal
// rather than a cut.
const STAGE_ENTRANCE_REVEAL = 0.15;

// Where the hand-off flips - see STAGE_HANDOFF_REVEAL. Driving the panel off
// the scroll position made it jitter instead of glide, so the crossing is
// treated as the discrete thing it already is: one flip, then the compositor
// animates the panel.
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

/**
 * The scroll position, read as the stage's own 0..1.2 story position.
 *
 * Sections 1..6 are the beats and are read continuously. The cover leg (0..1)
 * is held at the first beat instead: the camera's move out of the cover is the
 * dolly-out that opening triggers, not something the reader scrubs.
 */
function stageRevealAt(scrollProgress: number, handedOff: boolean) {
  const beat = clamp(
    scrollProgress - STAGE_FIRST_SECTION,
    0,
    STAGE_CHAPTERS.length - 1,
  );
  const index = Math.floor(beat);
  const from = STAGE_CHAPTERS[index];
  // Undefined only on the last beat, where there is nothing left to lean
  // towards and the fraction below is 0 anyway.
  const to = STAGE_CHAPTERS[index + 1] ?? from;
  const reveal = from + (to - from) * (beat - index);

  return handedOff ? reveal + STAGE_HANDOFF_REVEAL : reveal;
}

export default function Invitation({ template }: InvitationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const guestName = useSyncExternalStore(
    subscribeNever,
    getGuestName,
    getServerGuestName,
  );
  const [hasOpened, setHasOpened] = useState(false);
  // The scroll position itself is never on screen - only these two thresholds
  // on it are. Keeping them as booleans rather than as the raw progress is
  // what stops every scroll frame from re-rendering the whole tree (and with
  // it the stage, the cover and the panel) for a number nothing renders.
  const [atStage, setAtStage] = useState(false);
  const [mainSectionIn, setMainSectionIn] = useState(false);
  // Where the panel has actually come to rest, so it can be compared with
  // where it is headed: the two differ exactly while it is in motion.
  const [panelSettled, setPanelSettled] = useState(false);

  // The camera position is the one thing that does change every frame, so it
  // is handed to Stage as a MotionValue and written straight into. React never
  // sees it move - which is what makes a per-frame drive affordable at all.
  const stageProgress = useMotionValue(STAGE_ENTRANCE_REVEAL);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const hasOpenedRef = useRef(false);
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
    };
  }, []);

  // The container is eight empty spacer divs behind the fixed overlay - its
  // scroll position is never itself on screen, and everything visible is
  // derived from it. So animating a jump buys nothing and costs the whole
  // travel time before the thresholds flip; long jumps pass "instant" and let
  // the layer they hand over to do the animating. ("auto" would not do it - it
  // defers to the container's own scroll-behavior, which is smooth.)
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

  const readScrollPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el || el.clientHeight === 0) return;

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

    const handedOff = progress >= MAIN_SECTION_ENTER;
    setAtStage(progress >= COVER_EXIT);
    setMainSectionIn(handedOff);

    // Guarded, so a stray scroll behind the cover cannot pull the camera off
    // its entrance framing before the reader has opened anything.
    if (hasOpenedRef.current) {
      stageProgress.set(stageRevealAt(progress, handedOff));
    }
  }, [stageProgress]);

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

  // Touch is not here on purpose - it scrolls the container natively and the
  // camera follows. Only the wheel needs driving; see useWheelScrub.
  useWheelScrub({
    targetRef: containerRef,
    enabledRef: hasOpenedRef,
    sectionCount: SECTION_COUNT,
  });

  const handleOpen = useCallback(() => {
    // First, and synchronously: this is the one deliberate click the reader
    // makes, and every autoplay policy wants the play() call inside it.
    musicRef.current?.play();

    hasOpenedRef.current = true;
    setHasOpened(true);
    // Synchronously too, so the dolly-out starts on the click rather than on
    // whichever scroll event the smooth scroll below happens to emit first.
    stageProgress.set(stageRevealAt(progressRef.current, false));

    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
    }
    openFrameRef.current = requestAnimationFrame(() => {
      openFrameRef.current = null;
      scrollToSection(STAGE_FIRST_SECTION);
    });
  }, [scrollToSection, stageProgress]);

  const handleBackToStage = useCallback(() => {
    scrollToSection(STAGE_LAST_SECTION);
  }, [scrollToSection]);

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
                revealProgress={stageProgress}
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
