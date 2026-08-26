"use client"; // Wajib jika menggunakan hooks (useEffect) & Framer Motion di App Router

import { useEffect } from "react";
import Image from "next/image";
import { Mail, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CoverPageProps {
  onOpen?: () => void;
  hasOpened?: boolean;
}

const COUPLE_NAMES = "Vincent & Natasha";
const WEDDING_DATE = "Saturday, April 25, 2026";
// GANTI: Idealnya diambil dari query param/props untuk personalisasi
const GUEST_NAME = "Guest";

export default function CoverPage({
  onOpen,
  hasOpened = false,
}: CoverPageProps) {
  // LOGIC: Mengunci scroll jika undangan belum dibuka
  useEffect(() => {
    if (!hasOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function (Defensive programming)
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasOpened]);

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
      {/* LAYER 1: Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cover-bg.jpg"
          alt={`Wedding of ${COUPLE_NAMES}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      {/* LAYER 2: Gradient Overlay (Memastikan teks tetap terbaca) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[65%] bg-gradient-to-t from-[#f5f6f1] via-[#f5f6f1]/80 to-transparent"
      />

      {/* LAYER 3: Content */}
      <div className="absolute inset-x-0 bottom-10 z-10 flex w-full flex-col items-center px-4 text-center">
        <p className="mb-0 text-[12px] font-normal tracking-wide text-[#333333]">
          The Wedding of
        </p>
        <h1 className="my-1 whitespace-nowrap font-script text-[2.25rem] leading-[1.2] text-[#333333] md:text-[2.5rem]">
          {COUPLE_NAMES}
        </h1>
        <p className="text-[12px] font-medium tracking-wide text-[#333333]">
          {WEDDING_DATE}
        </p>

        <div className="h-6" />

        <div className="flex flex-col items-center gap-1">
          <p className="text-[12px] font-normal text-[#333333]">Dear,</p>
          <p className="text-[15px] font-bold text-[#333333]">{GUEST_NAME}</p>
        </div>

        <div className="h-6" />

        {/* Action Area dengan Framer Motion untuk transisi yang elegan */}
        <div className="h-[44px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!hasOpened ? (
              <motion.button
                key="open-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                type="button"
                onClick={onOpen}
                className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-md bg-[#786455] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-md transition-all hover:bg-[#635246] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#786455] active:scale-95"
              >
                <Mail className="w-[14px] h-[14px]" strokeWidth={2.5} />
                Open Invitation
              </motion.button>
            ) : (
              <motion.div
                key="scroll-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="flex flex-col items-center text-[#333333]"
              >
                <ChevronDown
                  className="w-5 h-5 animate-bounce drop-shadow-sm"
                  strokeWidth={2.5}
                />
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] drop-shadow-sm text-[#333333]/90">
                  Scroll Down
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
