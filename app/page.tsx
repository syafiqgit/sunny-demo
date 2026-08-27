"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "@/app/components/Stage";
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
  const openFrameRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

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

  const handleOpen = useCallback(() => {
    setHasOpened(true);

    if (openFrameRef.current !== null) {
      cancelAnimationFrame(openFrameRef.current);
    }

    openFrameRef.current = requestAnimationFrame(() => {
      scrollToSection(1);
      openFrameRef.current = null;
    });
  }, [scrollToSection]);

  const handleBackToStage = useCallback(() => {
    scrollToSection(6);
  }, [scrollToSection]);

  const coverToStage = clamp(scrollProgress, 0, 1);
  const stageRevealProgress = clamp((scrollProgress - 1) / 5, 0, 1.2);
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
