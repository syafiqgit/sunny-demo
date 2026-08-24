"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "./components/Stage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<0 | 1>(0); // 0 = cover, 1 = stage
  const [hasOpened, setHasOpened] = useState(false); // permanen, buat ganti tombol->indikator
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeSection === 1 && !hasOpened) setHasOpened(true);
  }, [activeSection, hasOpened]);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      // snap ke section terdekat (0 atau 1), BUKAN nilai kontinu -- ini yang
      // bikin fade-nya jadi animasi timed yang slow & konsisten, tidak
      // ngikutin kecepatan scroll jari/mouse secara langsung.
      const p = el.scrollTop / el.clientHeight;
      setActiveSection(p >= 0.5 ? 1 : 0);
    });
  }, []);

  const handleOpen = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="mobile-canvas relative">
      {/* Loading overlay -- tetap sama */}
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
        {/* TRACK: tetap sama, nangkep gesture scroll */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="absolute inset-0 z-0 overflow-y-auto snap-y snap-mandatory scroll-smooth overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="h-[100dvh] snap-start snap-always" />
          <div className="h-[100dvh] snap-start snap-always" />
        </div>

        {/* VISUAL: durasi dinaikkan ke 1000ms (slow, "menghilang-muncul"),
            ease-in-out biar mulus di awal & akhir transisi, bukan linear. */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSection === 0 ? "opacity-100" : "opacity-0"
            }`}
          >
            {!isLoading && (
              <CoverPage onOpen={handleOpen} hasOpened={hasOpened} />
            )}
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSection === 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            {!isLoading && <Stage />}
          </div>
        </div>
      </div>
    </main>
  );
}
