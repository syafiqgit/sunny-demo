"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "./components/Stage";
import MainSection from "./components/MainSection";

const SECTION_COUNT = 3;
const LOADING_DURATION_MS = 2000;
const OPEN_THRESHOLD = 0.5;

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

      const clampedProgress = Math.min(
        Math.max(rawProgress, 0),
        SECTION_COUNT - 1,
      );

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

  /**
   * Scroll ke section utama berdasarkan index.
   * 0 = Cover
   * 1 = Stage
   * 2 = Main Section
   */
  const scrollToSection = useCallback((sectionIndex: number) => {
    const el = containerRef.current;

    if (!el) return;

    const targetIndex = Math.min(Math.max(sectionIndex, 0), SECTION_COUNT - 1);

    el.scrollTo({
      top: targetIndex * el.clientHeight,
      behavior: "smooth",
    });
  }, []);

  /**
   * Cover -> Stage
   */
  const handleOpen = useCallback(() => {
    scrollToSection(1);
  }, [scrollToSection]);

  /**
   * Main Section -> Stage
   */
  const handleBackToStage = useCallback(() => {
    scrollToSection(1);
  }, [scrollToSection]);

  const coverToStage = Math.min(Math.max(scrollProgress, 0), 1);

  const stageToCombined = Math.min(Math.max(scrollProgress - 1, 0), 1);

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
          {/* COVER */}
          <div className="h-[100dvh] snap-start snap-always" />

          {/* STAGE */}
          <div className="h-[100dvh] snap-start snap-always" />

          {/* MAIN SECTION */}
          <div className="h-[100dvh] snap-start snap-always" />
        </div>

        {/* Visual Layer */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* COVER */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: coverToStage < 0.5 ? 1 : 0,
            }}
          >
            <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
          </div>

          {/* STAGE */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: coverToStage >= 0.5 ? 1 : 0,
            }}
          >
            {!isLoading && <Stage revealProgress={stageToCombined} />}
          </div>

          {/* MAIN SECTION */}
          <div
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={{
              transform: `translateY(${(1 - stageToCombined) * 100}%)`,
            }}
          >
            {!isLoading && <MainSection onBackToStage={handleBackToStage} />}
          </div>
        </div>
      </div>
    </main>
  );
}
