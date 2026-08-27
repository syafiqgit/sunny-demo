"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "./components/Stage";
import MainSection from "./components/MainSection";

const SECTION_COUNT = 8;
const LOADING_DURATION_MS = 2000;
const OPEN_THRESHOLD = 0.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

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

      setScrollProgress(clampedProgress);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
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

  const handleOpen = useCallback(() => {
    setHasOpened(true);
    setTimeout(() => {
      scrollToSection(1);
    }, 50);
  }, [scrollToSection]);

  const handleBackToStage = useCallback(() => {
    scrollToSection(6);
  }, [scrollToSection]);

  const coverToStage = clamp(scrollProgress, 0, 1);
  // Diizinkan hingga 1.2 agar Stage dapat mendeteksi transisi saat scroll masuk ke MainSection
  const stageRevealProgress = clamp((scrollProgress - 1) / 5, 0, 1.2);
  const mainSectionProgress = clamp(scrollProgress - 6, 0, 1);

  const coverOpacity = clamp(1 - coverToStage * 2, 0, 1);
  const stageOpacity = clamp(coverToStage * 2, 0, 1);

  return (
    <main className="mobile-canvas relative">
      {/* Loading Overlay */}
      <div
        aria-hidden={!isLoading}
        className={`absolute inset-0 z-[100] flex items-center justify-center bg-black/25 transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="animate-pulse font-serif text-7xl text-white drop-shadow-md md:text-8xl">
          A
        </span>
      </div>

      <div className="relative h-[100dvh] w-full overflow-hidden">
        {/* Main Scroll Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={`absolute inset-0 z-0 snap-y snap-mandatory overscroll-y-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            !hasOpened ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {/* Index 0: Cover */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 1: Stage - FASE 1: Quote Awal */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 2: Stage - FASE 2: Informasi Pria */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 3: Stage - FASE 3: Informasi Wanita */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 4: Stage - FASE 4: Informasi Acara */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 5: Stage - FASE 5: Dress Code */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 6: Stage - FASE 6: Zoom Out Full Stage & Closing Quote */}
          <div className="h-[100dvh] snap-start snap-always" />
          {/* Index 7: Main Section */}
          <div className="h-[100dvh] snap-start snap-always" />
        </div>

        {/* Visual Layer */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* COVER PAGE */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{ opacity: coverOpacity }}
          >
            <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
          </div>

          {/* STAGE */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{ opacity: stageOpacity }}
          >
            {!isLoading && <Stage revealProgress={stageRevealProgress} />}
          </div>

          {/* MAIN SECTION */}
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