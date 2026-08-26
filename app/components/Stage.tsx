import Image from "next/image";
import { ChevronsUp } from "lucide-react";

export interface StageProps {
  /** 0 = normal (section Stage), 1 = full masuk Countdown */
  revealProgress?: number;
}

export default function Stage({ revealProgress = 0 }: StageProps) {
  // Defensive logic: Pastikan progress selalu di antara 0 dan 1
  const clampedProgress = Math.max(0, Math.min(1, revealProgress));
  const quoteOpacity = 1 - clampedProgress;
  const overlayOpacity = clampedProgress * 0.75;

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#7bbff1] [container-type:inline-size]">
      {/* 
        Art Direction Container: 
        Mempertahankan aspect ratio 3:4 agar komposisi gambar tetap utuh seperti object-cover
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto min-w-full min-h-full aspect-[3/4] bg-[#7bbff1] overflow-hidden">
        {/* LAYER 1: Background Langit (Decorative) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sunny_bg2_ext.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom scale-[1.05]"
            priority
            aria-hidden="true"
          />
        </div>

        {/* LAYER 2: Pohon Midground (Decorative) */}
        <div className="absolute bottom-0 w-full z-10 pointer-events-none">
          <Image
            src="/images/sunny_bg1_ext.webp"
            alt=""
            width={1000}
            height={1500}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto scale-[1.1] origin-bottom"
            aria-hidden="true"
          />
        </div>

        {/* LAYER 3: Couple (Meaningful Content) */}
        <div className="absolute bottom-[15cqw] left-1/2 -translate-x-1/2 w-[55%] max-w-[320px] z-20 pointer-events-none">
          <Image
            src="/images/couple.png"
            alt="Ilustrasi Vincent dan Natasha"
            width={600}
            height={900}
            sizes="(max-width: 768px) 55vw, 320px"
            className="w-full h-auto drop-shadow-md"
            priority
          />
        </div>

        {/* LAYER 4: Bunga Foreground Kiri/Belakang (Decorative) */}
        <div className="absolute bottom-0 w-full z-30 pointer-events-none">
          <Image
            src="/images/sunny_fg1_ext.webp"
            alt=""
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto scale-[1.2] origin-bottom translate-y-[2%]"
            aria-hidden="true"
          />
        </div>

        {/* LAYER 5: Bunga Foreground Kanan/Depan (Decorative) */}
        <div className="absolute bottom-0 w-full z-40 pointer-events-none">
          <Image
            src="/images/sunny_fg2_ext.webp"
            alt=""
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-auto scale-[1.3] origin-bottom translate-x-[3%] translate-y-[2%]"
            aria-hidden="true"
          />
        </div>

        {/* Dim overlay: Pudarkan Stage sebanding revealProgress */}
        <div
          className="absolute inset-0 z-[45] bg-white pointer-events-none"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      </div>

      {/* LAYER 6 & 7: QUOTE SECTION */}
      <div
        className="absolute top-[8%] inset-x-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-150"
        style={{ opacity: quoteOpacity }}
      >
        {/* Background Cloud Overlay */}
        <div className="absolute w-[130%] max-w-[1000px] h-[900px] translate-y-[2%] opacity-90">
          <Image
            src="/images/cloud3_80_min.png"
            alt=""
            fill
            sizes="100vw"
            className="object-contain object-center"
            aria-hidden="true"
          />
        </div>

        {/* Quote Content (Semantic Blockquote) */}
        <blockquote className="relative z-10 flex flex-col items-center text-center px-[6.4cqw] mt-[8cqw] drop-shadow-sm">
          <p className="text-[clamp(12px,2.4cqw,14px)] text-[#2a2a2a] font-medium leading-[1.6] mb-[2.4cqw]">
            "So they are no longer two, but one flesh. Therefore what God has
            <br className="hidden sm:block" />
            joined together, let no one separate."
          </p>
          <cite className="text-[clamp(13px,2.6cqw,16px)] font-bold text-[#2a2a2a] not-italic">
            Matthew 19:6
          </cite>
        </blockquote>
      </div>

      {/* LAYER 8: Swipe Up Indicator */}
      <div
        className="absolute bottom-[clamp(16px,2.4cqw,24px)] inset-x-0 z-50 flex flex-col items-center justify-center text-white animate-bounce pointer-events-none"
        style={{ opacity: quoteOpacity }}
      >
        <ChevronsUp
          className="w-5 h-5 mb-0.5 drop-shadow-md text-white/90"
          strokeWidth={2.5}
        />
        <span className="text-[clamp(11px,2.2cqw,13px)] font-semibold mt-1 drop-shadow-md tracking-wide text-white/90">
          Swipe up
        </span>
      </div>
    </section>
  );
}
