"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const WEDDING_DATE = new Date("2027-01-01T00:00:00+07:00"); // GANTI ke tanggal asli

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export default function Countdown() {
  // Hindari hydration mismatch: render 00:00:00:00 di server,
  // hitung nilai asli setelah mount di client.
  const [time, setTime] = useState<TimeLeft>(ZERO_TIME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft(WEDDING_DATE));

    let rafId: number;
    let lastTick = 0;

    // Pakai requestAnimationFrame + throttle 1s alih-alih setInterval
    // supaya tidak drift dan otomatis pause saat tab tidak aktif.
    const tick = (now: number) => {
      if (now - lastTick >= 1000) {
        lastTick = now;
        setTime(getTimeLeft(WEDDING_DATE));
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  const isOver =
    mounted &&
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section
      aria-label="Wedding countdown and RSVP"
      className="relative w-full h-[100dvh] overflow-hidden [container-type:inline-size]"
    >
      {/* Bunga dekoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-96 md:top-25 top-52 md:w-[58cqw] md:max-w-[250px] w-[85cqw] max-w-[370px] z-10 -rotate-[22deg] origin-bottom-right select-none"
      >
        <Image
          src="/images/sunny_decor2.webp" // GANTI ke path asset bunga kamu
          alt=""
          width={600}
          height={900}
          priority={false}
          className="w-full h-auto"
        />
      </div>

      <div className="relative z-20 flex flex-col items-center h-full px-[6cqw]">
        {/* Countdown */}
        <div
          className="flex items-start gap-[4cqw] mt-[10%]"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
        >
          {units.map((u, i) => (
            <div key={u.label} className="flex items-start">
              <div className="flex flex-col items-center min-w-[13cqw] md:min-w-[3.5rem]">
                <span className="text-[9cqw] md:text-4xl font-light text-[#2a2a2a] tabular-nums leading-none">
                  {String(u.value).padStart(2, "0")}
                </span>
                <span className="mt-[1.5cqw] text-[2.6cqw] md:text-sm tracking-wide uppercase text-[#2a2a2a]/60">
                  {u.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span
                  aria-hidden="true"
                  className="text-[7cqw] md:text-3xl font-light text-[#2a2a2a]/30 mx-[1cqw] leading-none"
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {isOver && (
          <p className="mt-[3%] text-[3cqw] md:text-sm text-[#7a5c48] font-medium">
            The big day is here! 🎉
          </p>
        )}

        <button
          type="button"
          className="pointer-events-auto mt-[6%] px-[7cqw] py-[3cqw] rounded-full bg-[#7a5c48] text-white text-[3cqw] md:text-sm font-semibold tracking-wide shadow-md transition-colors hover:bg-[#6a4e3c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a5c48] active:scale-[0.98]"
        >
          Save the Date
        </button>

        {/* RSVP */}
        <div className="mt-auto mb-[18%] w-full flex flex-col items-start">
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
            Tell us you&apos;re coming and leave a few words—we&apos;d love
            to hear from you!
          </p>
          <span className="mt-[4%] text-[2.6cqw] md:text-[11px] text-[#2a2a2a]/50 animate-bounce self-center">
            Swipe up
          </span>
        </div>
      </div>
    </section>
  );
}