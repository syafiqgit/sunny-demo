import Image from "next/image";

interface StageProps {
  /** 0 = normal (section Stage), 1 = full masuk Countdown */
  revealProgress?: number;
}

export default function Stage({ revealProgress = 0 }: StageProps) {
  const quoteOpacity = 1 - revealProgress;

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#7bbff1] [container-type:inline-size]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto min-w-full min-h-full aspect-[3/4] bg-[#7bbff1] overflow-hidden">
        {/* LAYER 1: Background Langit */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sunny_bg2_ext.webp"
            alt="Sky Background"
            fill
            className="object-cover object-bottom scale-[1.05]"
            priority
          />
        </div>

        {/* LAYER 2: Pohon (Midground) */}
        <div className="absolute bottom-0 w-full z-10 pointer-events-none">
          <Image
            src="/images/sunny_bg1_ext.webp"
            alt="Trees Background"
            width={1000}
            height={1500}
            className="w-full h-auto scale-[1.1] origin-bottom"
          />
        </div>

        {/* LAYER 3: Couple */}
        <div className="absolute bottom-[15cqw] left-1/2 -translate-x-1/2 w-[55%] max-w-[320px] z-20 pointer-events-none">
          <Image
            src="/images/couple.png"
            alt="Vincent & Natasha"
            width={600}
            height={900}
            className="w-full h-auto"
          />
        </div>

        {/* LAYER 4: Bunga Foreground Kiri/Belakang */}
        <div className="absolute bottom-0 w-full z-30 pointer-events-none">
          <Image
            src="/images/sunny_fg1_ext.webp"
            alt="Foreground Flowers 1"
            width={1000}
            height={1000}
            className="w-full h-auto scale-[1.2] origin-bottom translate-y-[2%]"
          />
        </div>

        {/* LAYER 5: Bunga Foreground Kanan/Depan */}
        <div className="absolute bottom-0 w-full z-40 pointer-events-none">
          <Image
            src="/images/sunny_fg2_ext.webp"
            alt="Foreground Flowers 2"
            width={1000}
            height={1000}
            className="w-full h-auto scale-[1.3] origin-bottom translate-x-[3%] translate-y-[2%]"
          />
        </div>

        {/* Dim overlay: pudarkan Stage sebanding revealProgress,
            supaya teks Countdown tetap legible di atasnya. Linear
            mengikuti scroll asli (bukan CSS transition timed). */}
        <div
          className="absolute inset-0 z-[45] bg-white pointer-events-none"
          style={{ opacity: revealProgress * 0.75 }}
        />
      </div>

      {/* LAYER 6 & 7: QUOTE SECTION -- fade out begitu masuk Countdown,
          karena posisinya bentrok persis dengan konten Countdown. */}
      <div
        className="absolute top-[8%] inset-x-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ opacity: quoteOpacity }}
      >
        <div className="absolute w-[130%] max-w-[1000px] h-[900px] translate-y-[2%] opacity-90">
          <Image
            src="/images/cloud3_80_min.png"
            alt="Cloud Overlay"
            fill
            className="object-contain object-center"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-[6.4cqw] mt-[8cqw]">
          <p className="text-[2.4cqw] md:text-[13px] text-[#2a2a2a] font-medium leading-[1.6] mb-[2.4cqw]">
            "So they are no longer two, but one flesh. Therefore what God has
            <br />
            joined together, let no one separate."
          </p>
          <p className="text-[2.6cqw] md:text-[14px] font-bold text-[#2a2a2a]">
            Matthew 19:6
          </p>
        </div>
      </div>

      {/* LAYER 8: Swipe Up Indicator -- fade out juga, supaya tidak
          numpuk dengan swipe-up indicator milik Countdown. */}
      <div
        className="absolute bottom-[2.4cqw] inset-x-0 z-50 flex flex-col items-center justify-center text-white animate-bounce pointer-events-none"
        style={{ opacity: quoteOpacity }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-0.5 drop-shadow-sm"
        >
          <path d="m17 11-5-5-5 5" />
          <path d="m17 18-5-5-5 5" />
        </svg>
        <span className="text-[2.2cqw] font-semibold mt-1 drop-shadow-sm">
          Swipe up
        </span>
      </div>
    </section>
  );
}