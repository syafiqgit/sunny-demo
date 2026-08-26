"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const WEDDING_DATE = new Date("2027-01-01T00:00:00+07:00"); // GANTI ke tanggal asli

function getTimeLeft(target: Date) {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown() {
  const [time, setTime] = useState(() => getTimeLeft(WEDDING_DATE));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(WEDDING_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden [container-type:inline-size]">
      {/* Bunga dekoratif: asset asli milik Countdown, vivid, nempel
          kanan dari area couple sampai bawah layar. GANTI src ke
          path asset kamu. Posisi/ukuran ini tebakan awal dari
          proporsi target -- koreksi setelah lihat hasil render. */}
      <div className="pointer-events-none absolute left-96 md:top-25 top-52 md:w-[58cqw] md:max-w-[250px] w-[85cqw] max-w-[370px] z-10 -rotate-[22deg] origin-bottom-right">
        <Image
          src="/images/sunny_decor2.webp" // GANTI ke path asset bunga kamu
          alt=""
          width={600}
          height={900}
          className="w-full h-auto"
        />
      </div>

      <div className="relative z-20 flex flex-col items-center h-full px-[6cqw]">
        <div className="flex gap-[4cqw] mt-[10%]">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <span className="text-[9cqw] md:text-4xl font-light text-[#2a2a2a] tabular-nums">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="text-[2.8cqw] md:text-sm text-[#2a2a2a]/80">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="pointer-events-auto mt-[6%] px-[7cqw] py-[3cqw] rounded-full bg-[#7a5c48] text-white text-[3cqw] md:text-sm font-semibold tracking-wide shadow-md"
        >
          SAVE THE DATE
        </button>

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
            Tell us you&apos;re coming and leave a few words—we&apos;d love to
            hear from you!
          </p>
          <span className="mt-[4%] text-[2.6cqw] md:text-[11px] text-[#2a2a2a]/50 animate-bounce self-center">
            Swipe up
          </span>
        </div>
      </div>
    </section>
  );
}
