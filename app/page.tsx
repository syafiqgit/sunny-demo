"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "./components/Stage";
import MainSection from "./components/MainSection";

const SECTION_COUNT = 3; // 0 = cover, 1 = stage, 2 = story+countdown+rsvp

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollProgress >= 0.5 && !hasOpened) setHasOpened(true);
  }, [scrollProgress, hasOpened]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const raw = el.scrollTop / el.clientHeight;
      const clamped = Math.min(Math.max(raw, 0), SECTION_COUNT - 1);
      setScrollProgress(clamped);
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const handleOpen = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  const coverToStage = Math.min(Math.max(scrollProgress, 0), 1);
  const stageToCombined = Math.min(Math.max(scrollProgress - 1, 0), 1);

  return (
    <main className="mobile-canvas relative">
      <div
        className={`absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-white text-7xl md:text-8xl font-serif animate-pulse drop-shadow-md">
          A
        </span>
      </div>

      <div className="relative w-full h-[100dvh] overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="absolute inset-0 z-0 overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="h-[100dvh] snap-start snap-always" />
          <div className="h-[100dvh] snap-start snap-always" />
          <div className="h-[100dvh] snap-start snap-always" />
        </div>

        {/* FIX: pointer-events-none di sini. Ini root cause-nya —
            tanpa ini, wrapper full-screen ini "menutup" track scroll
            di bawahnya walau semua child-nya sudah none. */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{
              opacity: coverToStage < 0.5 ? 1 : 0,
            }}
          >
            {!isLoading && (
              <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
            )}
          </div>

          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: coverToStage >= 0.5 ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            {!isLoading && <Stage revealProgress={stageToCombined} />}
          </div>

          <div
            className="absolute inset-0 will-change-transform pointer-events-none"
            style={{
              transform: `translateY(${(1 - stageToCombined) * 100}%)`,
            }}
          >
            {!isLoading && <MainSection />}
          </div>
        </div>
      </div>
    </main>
  );
}
