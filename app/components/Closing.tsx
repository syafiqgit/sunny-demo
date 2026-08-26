"use client";

import Image from "next/image";

export default function Closing() {
  return (
    <section className="relative flex w-full min-h-[100dvh] flex-col items-center justify-center px-[6cqw] py-[15%] [container-type:inline-size]">
      {/* Top: Wedding Gift Box */}
      <div className="flex w-full max-w-[420px] items-center gap-[5%] mb-[15%]">
        {/* Bunga Kiri */}
        <div className="relative w-[35%] aspect-[3/4]">
          <Image
            src="/images/sunny_decor3.webp" // Ganti dengan asset bunga kuning
            alt="Flower Bouquet"
            fill
            className="object-contain"
          />
        </div>

        {/* Teks & Button Kanan */}
        <div className="flex w-[60%] flex-col items-start text-left">
          <h2 className="font-script text-[9cqw] md:text-4xl text-[#2a2a2a] mb-[2%]">
            Wedding Gift
          </h2>
          <p className="text-[3cqw] md:text-[11px] leading-relaxed text-[#3a3a3a] mb-[6%]">
            We're so grateful for your love and support, any gift you share
            means the world to us.
          </p>
          <button className="bg-[#785b4d] hover:bg-[#63493d] transition-colors text-white text-[2.8cqw] md:text-[10px] font-bold tracking-widest uppercase px-[8%] py-[4%] md:px-6 md:py-2.5 rounded-[999px]">
            Send Gift
          </button>
        </div>
      </div>

      {/* Middle: Photo Oval + Floating Text */}
      {/* Parent container di-set overflow-visible supaya teks bisa tembus keluar */}
      <div className="relative w-[70cqw] max-w-[340px] aspect-[1/1.4] mb-[12%]">
        {/* Inner container untuk border & crop foto (overflow-hidden) */}
        <div className="absolute inset-0 overflow-hidden rounded-[999px] border-[2px] md:border-[3px] border-white shadow-md">
          <Image
            src="/images/cover-bg.jpg" // Ganti dengan foto couple
            alt="Vincent & Natasha"
            fill
            className="object-cover"
          />
        </div>

        {/* Floating Names (Absolute position di pojok kanan bawah cermin) */}
        <div className="absolute -bottom-[10%] -right-[15%] flex flex-col z-10 rotate-[-5deg] pointer-events-none">
          <span className="font-script text-[13cqw] md:text-6xl text-[#333] leading-[0.7]">
            Vincent &
          </span>
          <span className="font-script text-[13cqw] md:text-6xl text-[#333] ml-[20%] mt-[2%]">
            Natasha
          </span>
        </div>
      </div>

      {/* Bottom: Thank You Message & Swipe Up */}
      <div className="flex flex-col items-center mt-auto w-full max-w-[480px]">
        <p className="text-center text-[3.2cqw] md:text-[13px] leading-relaxed text-[#2a2a2a] px-[4%] font-medium">
          We can't wait to share this special moment with you. Your presence
          will make our day even more meaningful.
        </p>

        <span className="mt-[8%] text-[2.6cqw] md:text-[11px] font-medium text-[#2a2a2a]/50 animate-bounce">
          Swipe up
        </span>
      </div>
    </section>
  );
}
