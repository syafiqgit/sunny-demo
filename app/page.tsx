"use client";

import { useState, useEffect } from "react";
import CoverPage from "./components/CoverPage";
import Stage from "./components/Stage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false); // State untuk buka undangan

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="mobile-canvas relative">
      {/* Loading Overlay */}
      <div
        className={`absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-white text-7xl md:text-8xl font-serif animate-pulse drop-shadow-md">
          A
        </span>
      </div>

      {/* 
        CONTAINER UTAMA
        Menampung Stage dan CoverPage.
      */}
      <div className="relative w-full h-[100dvh] overflow-hidden">
        {/* Layer Bawah: STAGE (Isi Undangan) */}
        <div className="absolute inset-0 z-0">
          {/* Hanya dirender penuh jika loading sudah selesai untuk performa */}
          {!isLoading && <Stage />}
        </div>

        {/* Layer Atas: COVER PAGE (Akan slide ke atas saat tombol diklik) */}
        <div
          className={`absolute inset-0 z-10 transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isOpened ? "-translate-y-full shadow-2xl" : "translate-y-0"
          }`}
        >
          {/* Kirim props onOpen ke CoverPage agar tombolnya berfungsi */}
          <CoverPage onOpen={() => setIsOpened(true)} />
        </div>
      </div>
    </main>
  );
}
