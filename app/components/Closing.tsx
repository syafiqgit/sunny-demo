"use client";

import Image from "next/image";

const GIFT_URL = "#"; // GANTI ke link rekening/e-wallet/wishlist kado
const COUPLE_NAMES = "Vincent & Natasha";

export default function Closing() {
  return (
    <section
      aria-label="Wedding gift and closing message"
      className="relative flex w-full min-h-dvh flex-col items-center justify-center px-[6cqw] py-[15%] @container"
    >
      <div className="mb-[15%] flex w-full max-w-[420px] items-center gap-[5%]">
        <div
          aria-hidden="true"
          className="relative aspect-[3/4] w-[35%] select-none"
        >
          <Image
            src="/images/sunny_decor3.webp"
            alt=""
            fill
            sizes="150px"
            className="object-contain"
          />
        </div>

        <div className="flex w-[60%] flex-col items-start text-left">
          <h2 className="mb-[2%] font-script text-[9cqw] text-[#2a2a2a] md:text-4xl">
            Wedding Gift
          </h2>
          <p className="mb-[6%] text-[3cqw] leading-relaxed text-[#3a3a3a] md:text-[11px]">
            We are so grateful for your love and support, any gift you share
            means the world to us.
          </p>
          <a
            href={GIFT_URL}
            className="rounded-[999px] bg-[#785b4d] px-[8%] py-[4%]
            text-[2.8cqw] font-bold uppercase tracking-widest text-white
            transition-colors hover:bg-[#63493d] focus-visible:outline
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-[#785b4d] active:opacity-90 md:px-6 md:py-2.5
            md:text-[10px]"
          >
            SEND GIFT
          </a>
        </div>
      </div>

      <div className="relative mb-[12%] aspect-[1/1.4] w-[70cqw] max-w-[340px]">
        <div className="absolute inset-0 overflow-hidden rounded-[999px] border-[2px] border-white shadow-md md:border-[3px]">
          <Image
            src="/images/cover-bg.jpg"
            alt={COUPLE_NAMES + " wedding photo"}
            fill
            sizes="(max-width: 340px) 70cqw, 340px"
            className="object-cover"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[10%] -right-[15%] z-10 flex -rotate-[5deg] flex-col select-none"
        >
          <span className="font-script text-[13cqw] leading-[0.7] text-[#333] md:text-6xl">
            Vincent and
          </span>
          <span className="ml-[20%] mt-[2%] font-script text-[13cqw] text-[#333] md:text-6xl">
            Natasha
          </span>
        </div>
      </div>

      <div className="mt-auto flex w-full max-w-[480px] flex-col items-center">
        <p className="px-[4%] text-center text-[3.2cqw] font-medium leading-relaxed text-[#2a2a2a] md:text-[13px]">
          We cannot wait to share this special moment with you. Your presence
          will make our day even more meaningful.
        </p>

        <span
          aria-hidden="true"
          className="mt-[8%] animate-bounce text-[2.6cqw] font-medium text-[#2a2a2a]/50 md:text-[11px]"
        >
          Swipe up
        </span>
      </div>
    </section>
  );
}
