"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "./components/Stage";
import MainSection from "./components/MainSection";

const SECTION_COUNT = 3; // 0 = cover, 1 = stage, 2 = story+countdown+rsvp
const LOADING_DURATION_MS = 2000;
const OPEN_THRESHOLD = 0.5;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollProgress >= OPEN_THRESHOLD && !hasOpened) setHasOpened(true);
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

  const handleOpen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.clientHeight, behavior: "smooth" });
  }, []);

  const coverToStage = Math.min(Math.max(scrollProgress, 0), 1);
  const stageToCombined = Math.min(Math.max(scrollProgress - 1, 0), 1);

  return (
    <main className="mobile-canvas relative">
      {/* Loading overlay: transparan gelap tipis agar cover page tetap
          terlihat samar di belakangnya, bukan blur solid seperti sebelumnya. */}
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
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="absolute inset-0 z-0 snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="h-[100dvh] snap-start snap-always" />
          <div className="h-[100dvh] snap-start snap-always" />
          <div className="h-[100dvh] snap-start snap-always" />
        </div>

        {/* pointer-events-none di root: mencegah wrapper full-screen ini
            menutup track scroll di bawahnya walau semua child sudah none. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: coverToStage < 0.5 ? 1 : 0 }}
          >
            {/* CoverPage dirender segera (tidak menunggu isLoading selesai)
                supaya terlihat samar di balik overlay loading yang transparan. */}
            <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
          </div>

          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: coverToStage >= 0.5 ? 1 : 0 }}
          >
            {!isLoading && <Stage revealProgress={stageToCombined} />}
          </div>

          <div
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={{ transform: `translateY(${(1 - stageToCombined) * 100}%)` }}
          >
            {!isLoading && <MainSection />}
          </div>
        </div>
      </div>
    </main>
  );
}
