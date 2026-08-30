"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";
import type { SizedImage } from "./Stage.types";

interface CountdownProps {
  /** Sasaran hitung mundur, ISO 8601 dengan zona waktu. */
  targetIso: string;
  decorImage: SizedImage;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getTimeLeft(targetMs: number): TimeLeft {
  const diff = Math.max(targetMs - Date.now(), 0);
  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
  };
}

const UNIT_LABELS = ["Days", "Hours", "Minutes", "Seconds"] as const;

export default function Countdown({ targetIso, decorImage }: CountdownProps) {
  const targetMs = Date.parse(targetIso);

  // Hindari hydration mismatch: server merender 00:00:00:00 dan nilai asli
  // baru dihitung setelah mount di client.
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    let timeoutId = 0;

    const tick = () => {
      setTime(getTimeLeft(targetMs));
      // Re-aligned to the wall clock on every tick rather than a flat 1000ms:
      // a fixed interval drifts, and drifts badly once a background tab has
      // been throttled, so the display would visibly skip a second.
      timeoutId = window.setTimeout(tick, SECOND - (Date.now() % SECOND));
    };

    const stop = () => window.clearTimeout(timeoutId);

    // Nothing to show while the tab is hidden, and a per-second setState there
    // is pure waste - the value is refreshed the moment it comes back.
    const handleVisibilityChange = () => {
      stop();
      if (!document.hidden) tick();
    };

    tick();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [targetMs]);

  const display = time ?? ZERO_TIME;
  const isOver =
    time !== null &&
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  const units = [
    display.days,
    display.hours,
    display.minutes,
    display.seconds,
  ];

  // The first thing the reader sees once MainSection arrives, so these lead
  // the sequence: the clock, then the button a beat later, then the RSVP
  // tease leaning in from the side it is set against.
  const bloom = useReveal("right");
  const clock = useReveal("up");
  const saveTheDate = useReveal("up", 0.12);
  const rsvpTease = useReveal("left", 0.06);

  return (
    <section
      aria-label="Wedding countdown and RSVP"
      className="relative w-full h-dvh overflow-hidden @container"
    >
      {/* Bunga dekoratif */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-96 md:top-25 top-52 md:w-[58cqw] md:max-w-62.5 w-[85cqw] max-w-92.5 z-10 rotate-[-22deg] origin-bottom-right select-none"
        {...bloom}
      >
        <Image
          src={decorImage.src}
          alt=""
          width={decorImage.width}
          height={decorImage.height}
          sizes="(max-width: 500px) 85vw, 425px"
          className="w-full h-auto"
        />
      </motion.div>

      <div className="relative z-20 flex flex-col items-center h-full px-[6cqw]">
        {/* Countdown. `role="timer"` is silent by default, which is what we
            want: announcing a fresh value every second talks over everything
            else on the page. */}
        <motion.div
          className="flex items-start gap-[4cqw] mt-[10%]"
          role="timer"
          {...clock}
        >
          {UNIT_LABELS.map((label, index) => (
            <div key={label} className="flex items-start">
              <div className="flex flex-col items-center min-w-[13cqw] md:min-w-14">
                <span className="text-[9cqw] md:text-4xl font-light text-[#2a2a2a] tabular-nums leading-none">
                  {String(units[index]).padStart(2, "0")}
                </span>
                <span className="mt-[1.5cqw] text-[2.6cqw] md:text-sm tracking-wide uppercase text-[#2a2a2a]/60">
                  {label}
                </span>
              </div>
              {index < UNIT_LABELS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="text-[7cqw] md:text-3xl font-light text-[#2a2a2a]/30 mx-[1cqw] leading-none"
                >
                  :
                </span>
              )}
            </div>
          ))}
        </motion.div>

        {isOver && (
          <p className="mt-[3%] text-[3cqw] md:text-sm text-[#7a5c48] font-medium">
            The big day is here! 🎉
          </p>
        )}

        <motion.button
          type="button"
          {...saveTheDate}
          className="pointer-events-auto mt-[6%] px-[7cqw] py-[3cqw] rounded-full bg-[#7a5c48] text-white text-[3cqw] md:text-sm font-semibold tracking-wide shadow-md transition-colors hover:bg-[#6a4e3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a5c48] active:scale-[0.98]"
        >
          Save the Date
        </motion.button>

        {/* RSVP */}
        <motion.div
          className="mt-auto mb-[18%] w-full flex flex-col items-start"
          {...rsvpTease}
        >
          <p className="font-script text-[15cqw] md:text-5xl text-[#2a2a2a] leading-none">
            Rsvp
          </p>
          <p className="font-script text-[8cqw] md:text-2xl text-[#2a2a2a]/60 leading-none my-[1%] pl-[4cqw]">
            &amp;
          </p>
          <p className="font-script text-[15cqw] md:text-5xl text-[#2a2a2a] leading-none mb-[6%] pl-[6cqw]">
            Wishes
          </p>
          <p className="text-[3cqw] md:text-xs text-[#2a2a2a]/80 max-w-[70cqw] text-left">
            Tell us you&apos;re coming and leave a few words—we&apos;d love to
            hear from you!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
