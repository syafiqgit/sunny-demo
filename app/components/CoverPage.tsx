"use client";

import { memo } from "react";
import Image from "next/image";
import { Mail, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface CoverPageProps {
  onOpen?: () => void;
  hasOpened?: boolean;
  guestName?: string;
}

const COUPLE_NAMES = "Vincent & Natasha";
const WEDDING_DATE = "Saturday, April 25, 2026";
const DEFAULT_GUEST_NAME = "Guest";

function CoverPage({
  onOpen,
  hasOpened = false,
  guestName = DEFAULT_GUEST_NAME,
}: CoverPageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="cover-title"
      className="relative h-dvh w-full overflow-hidden bg-[#f5f6f1]"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/cover-bg.jpg"
          alt={`Wedding of ${COUPLE_NAMES}`}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 500px) 100vw, 500px"
          className="object-cover object-top"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-[#f5f6f1] via-[#f5f6f1]/85 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex w-full flex-col items-center px-4 pb-[max(4rem,env(safe-area-inset-bottom))] text-center text-[#333333]">
        <p className="text-sm tracking-wide">The Wedding of</p>
        <h1
          id="cover-title"
          className="my-1 max-w-full font-script text-[clamp(2.75rem,12vw,3.75rem)] leading-none"
        >
          {COUPLE_NAMES}
        </h1>
        <p className="text-sm font-medium tracking-wide">{WEDDING_DATE}</p>

        <div className="h-6" aria-hidden="true" />

        <div className="flex flex-col items-center gap-1">
          <p className="text-[15px]">Dear,</p>
          <p className="text-[17px] font-bold">{guestName}</p>
        </div>

        <div className="h-6" aria-hidden="true" />

        <div className="flex min-h-12 items-center justify-center">
          <AnimatePresence mode="wait">
            {!hasOpened ? (
              <motion.button
                key="open-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -10, filter: "blur(4px)" }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: "easeOut",
                }}
                type="button"
                onClick={onOpen}
                className="pointer-events-auto flex min-h-12 min-w-56 items-center justify-center gap-2.5 rounded-[11px] bg-[#786455] px-6 py-3 text-[13px] font-semibold uppercase tracking-normal text-white shadow-md transition-[background-color,box-shadow,transform] hover:bg-[#635246] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#786455] active:scale-95"
              >
                <Mail
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                />
                Open Invitation
              </motion.button>
            ) : (
              <motion.div
                key="scroll-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : 0.1,
                  ease: "easeOut",
                }}
                className="flex flex-col items-center"
              >
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 animate-bounce drop-shadow-sm motion-reduce:animate-none"
                  strokeWidth={2.5}
                />
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-[#333333]/90 drop-shadow-sm">
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

// Memoised: the page re-renders whenever a scroll threshold flips, and without
// this that reconciles this whole subtree each time - which is what put
// 60-100ms frames in the middle of the hand-off.
export default memo(CoverPage);
