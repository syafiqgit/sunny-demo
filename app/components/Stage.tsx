"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  ChevronUp,
  MapPin,
  Video,
  Shirt,
  Sparkles,
} from "lucide-react";
import { Great_Vibes } from "next/font/google";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export interface GroomInfo {
  scriptName: string;
  fullName: string;
  parentsLine1: string;
  parentsLine2: string;
  instagramHandle: string;
}

export interface BrideInfo {
  scriptName: string;
  fullName: string;
  parentsLine1: string;
  parentsLine2: string;
  instagramHandle: string;
}

export interface EventDetail {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface DressCodeInfo {
  title?: string;
  subtitle?: string;
  description?: string;
  colors?: ColorSwatch[];
  note?: string;
}

export interface ClosingQuoteInfo {
  text: string;
  citation?: string;
}

export interface StageProps {
  revealProgress?: number;
  groom?: GroomInfo;
  bride?: BrideInfo;
  matrimony?: EventDetail;
  reception?: EventDetail;
  dressCode?: DressCodeInfo;
  closingQuote?: ClosingQuoteInfo;
  streamingUrl?: string;
}

const DEFAULT_GROOM: GroomInfo = {
  scriptName: "Vincent",
  fullName: "Vincent Raphael",
  parentsLine1: "Mr. Vincent's Father &",
  parentsLine2: "Mrs. Vincent's Mother",
  instagramHandle: "vincent",
};

const DEFAULT_BRIDE: BrideInfo = {
  scriptName: "Natasha",
  fullName: "Natasha Aurelia",
  parentsLine1: "Mr. Natasha's Father &",
  parentsLine2: "Mrs. Natasha's Mother",
  instagramHandle: "natasha",
};

const DEFAULT_MATRIMONY: EventDetail = {
  title: "Holy Matrimony",
  date: "Saturday, April 25, 2026",
  time: "13.00 - 14.00 WIB",
  venue: "Plaza Rafaela Garden",
  address: "Jl. Suryalaya Indah, Buah Batu, Bandung",
  mapsUrl: "https://maps.google.com",
};

const DEFAULT_RECEPTION: EventDetail = {
  title: "Reception",
  date: "Saturday, April 25, 2026",
  time: "14.00 - 17.00 WIB",
  venue: "Plaza Rafaela Garden",
  address: "Jl. Suryalaya Indah, Buah Batu, Bandung",
  mapsUrl: "https://maps.google.com",
};

const DEFAULT_DRESS_CODE: DressCodeInfo = {
  title: "Dress Code",
  subtitle: "Attire Palette",
  description:
    "We kindly request our honored guests to wear attire following our event color palette:",
  colors: [
    { name: "Sage Green", hex: "#8A9A86" },
    { name: "Cream", hex: "#F4EBE1" },
    { name: "Terracotta", hex: "#C87D55" },
    { name: "Warm Earth", hex: "#6D574D" },
  ],
  note: "Formal / Semi-Formal Attire",
};

const DEFAULT_CLOSING_QUOTE: ClosingQuoteInfo = {
  text: "And over all these virtues put on love, which binds them all together in perfect unity.",
  citation: "Colossians 3:14",
};

export default function Stage({
  revealProgress = 0,
  groom = DEFAULT_GROOM,
  bride = DEFAULT_BRIDE,
  matrimony = DEFAULT_MATRIMONY,
  reception = DEFAULT_RECEPTION,
  dressCode = DEFAULT_DRESS_CODE,
  closingQuote = DEFAULT_CLOSING_QUOTE,
  streamingUrl = "#",
}: StageProps) {
  const rawProgress = useMotionValue(revealProgress);

  useEffect(() => {
    rawProgress.set(revealProgress);
  }, [revealProgress, rawProgress]);

  const progress = useSpring(rawProgress, {
    stiffness: 35,
    damping: 28,
    mass: 1.2,
    restDelta: 0.0005,
  });

  // =========================================================================
  // PERGERAKAN KAMERA PRESISI
  // =========================================================================
  const scale = useTransform(
    progress,
    [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2],
    [1.0, 2.35, 2.35, 2.45, 2.45, 1.0, 1.0],
  );

  const translateX = useTransform(
    progress,
    [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2],
    ["0%", "-20%", "20%", "-60%", "-60%", "0%", "0%"],
  );

  const translateY = useTransform(
    progress,
    [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2],
    ["0%", "-10%", "-10%", "-6%", "-6%", "0%", "0%"],
  );

  // Opening Quote Section
  const openingQuoteOpacity = useTransform(progress, [0.0, 0.1], [1, 0]);

  // Soft bottom gradient overlay (Hanya aktif dari 0.2 sampai 0.88, fade out saat zoom out)
  const scrimOpacity = useTransform(
    progress,
    [0.1, 0.2, 0.88, 0.96],
    [0, 1, 1, 0],
  );

  // Groom Info Card
  const groomOpacity = useTransform(
    progress,
    [0.0, 0.1, 0.2, 0.3, 0.38, 1.0],
    [0, 0, 1, 1, 0, 0],
  );
  const groomY = useTransform(progress, [0.0, 0.1, 0.2, 1.0], [40, 40, 0, 0]);
  const groomX = useTransform(
    progress,
    [0.0, 0.3, 0.38, 1.0],
    ["0%", "0%", "100%", "100%"],
  );

  // Bride Info Card
  const brideOpacity = useTransform(
    progress,
    [0.0, 0.32, 0.4, 0.5, 0.58, 1.0],
    [0, 0, 1, 1, 0, 0],
  );
  const brideX = useTransform(
    progress,
    [0.0, 0.32, 0.4, 0.5, 0.58, 1.0],
    ["-100%", "-100%", "0%", "0%", "-100%", "-100%"],
  );

  // Event Details Section (Layer 10)
  const eventOpacity = useTransform(
    progress,
    [0.0, 0.52, 0.6, 0.7, 0.78, 1.0],
    [0, 0, 1, 1, 0, 0],
  );
  const eventY = useTransform(
    progress,
    [0.0, 0.52, 0.6, 0.7, 0.78, 1.0],
    [30, 30, 0, 0, -20, -20],
  );

  // Dress Code Section (Layer 11)
  const dressCodeOpacity = useTransform(
    progress,
    [0.0, 0.72, 0.8, 0.88, 0.94, 1.0],
    [0, 0, 1, 1, 0, 0],
  );
  const dressCodeY = useTransform(
    progress,
    [0.0, 0.72, 0.8, 0.88, 0.94, 1.0],
    [30, 30, 0, 0, -20, -20],
  );

  // Closing Quote Section
  const closingQuoteOpacity = useTransform(
    progress,
    [0.0, 0.9, 0.98, 1.0, 1.08],
    [0, 0, 1, 1, 0],
  );
  const closingQuoteY = useTransform(
    progress,
    [0.0, 0.9, 0.98, 1.0, 1.08],
    [30, 30, 0, 0, -20],
  );

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-[#7bbff1] @container">
      {/* BACKGROUND SCENE CONTAINER */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full aspect-3/4 bg-[#7bbff1] overflow-hidden will-change-transform"
        style={{
          x: "-50%",
          y: "-50%",
          scale,
          translateX,
          translateY,
          transformOrigin: "50% 45%",
        }}
      >
        {/* LAYER 1: Background Langit */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sunny_bg2_ext.webp"
            alt=""
            fill
            sizes="100vw"
            quality={95}
            className="object-cover object-bottom scale-[1.05]"
            priority
            aria-hidden="true"
          />
        </div>

        {/* LAYER 2: Pohon Midground */}
        <div className="absolute bottom-0 w-full z-10 pointer-events-none">
          <Image
            src="/images/sunny_bg1_ext.webp"
            alt=""
            width={1000}
            height={1500}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={95}
            className="w-full h-auto scale-[1.1] origin-bottom"
            aria-hidden="true"
          />
        </div>

        {/* LAYER 3: Couple Cutout */}
        <div className="absolute bottom-[18cqw] left-1/2 -translate-x-1/2 w-[58%] max-w-85 z-20 pointer-events-none">
          <Image
            src="/images/inv_787_BSoyubpg.jpg"
            alt="Ilustrasi Vincent dan Natasha"
            width={600}
            height={900}
            sizes="(max-width: 768px) 58vw, 340px"
            quality={100}
            className="w-full h-auto drop-shadow-md"
            priority
          />
        </div>

        {/* LAYER 4: Bunga Foreground Kiri */}
        <div className="absolute bottom-0 w-full z-30 pointer-events-none">
          <Image
            src="/images/sunny_fg1_ext.webp"
            alt=""
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={95}
            className="w-full h-auto scale-[1.2] origin-bottom translate-y-[2%]"
            aria-hidden="true"
          />
        </div>

        {/* LAYER 5: Bunga Foreground Kanan */}
        <div className="absolute bottom-0 w-full z-40 pointer-events-none">
          <Image
            src="/images/sunny_fg2_ext.webp"
            alt=""
            width={1000}
            height={1000}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={95}
            className="w-full h-auto scale-[1.3] origin-bottom translate-x-[3%] translate-y-[2%]"
            aria-hidden="true"
          />
        </div>

        {/* Soft Bottom Gradient Overlay */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[65%] z-45 bg-linear-to-t from-[#fcf9f2] via-[#fcf9f2]/80 to-transparent pointer-events-none"
          style={{ opacity: scrimOpacity }}
          aria-hidden="true"
        />
      </motion.div>

      {/* OPENING QUOTE SECTION */}
      <motion.div
        className="absolute top-[8%] inset-x-0 z-50 flex items-center justify-center pointer-events-none"
        style={{ opacity: openingQuoteOpacity }}
      >
        <div className="absolute w-[130%] max-w-250 h-225 translate-y-[2%] opacity-90">
          <Image
            src="/images/cloud3_80_min.png"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            className="object-contain object-center"
            aria-hidden="true"
          />
        </div>

        <blockquote className="relative z-10 flex flex-col items-center text-center px-[6.4cqw] mt-[8cqw] drop-shadow-xs">
          <p className="text-[clamp(12px,2.4cqw,14px)] text-[#2a2a2a] font-medium leading-[1.6] mb-[2.4cqw]">
            "So they are no longer two, but one flesh. Therefore what God has
            <br className="hidden sm:block" />
            joined together, let no one separate."
          </p>
          <cite className="text-[clamp(13px,2.6cqw,16px)] font-bold text-[#2a2a2a] not-italic">
            Matthew 19:6
          </cite>
        </blockquote>
      </motion.div>

      {/* GROOM INFO CARD */}
      <motion.div
        className="absolute inset-x-0 bottom-[11%] z-50 flex flex-col items-center text-center px-6 pointer-events-none"
        style={{
          opacity: groomOpacity,
          x: groomX,
          y: groomY,
        }}
      >
        <span
          className={`${greatVibes.className} text-[clamp(52px,13cqw,72px)] leading-none text-[#2a2a2a] select-none`}
        >
          {groom.scriptName}
        </span>

        <p className="-mt-1 text-[clamp(15px,3.6cqw,18px)] font-bold text-[#2a2a2a] tracking-tight">
          {groom.fullName}
        </p>

        <div className="mt-3 flex flex-col items-center text-[clamp(11px,2.6cqw,13px)] text-[#2a2a2a] leading-snug">
          <span className="font-normal opacity-90">Son of</span>
          <p className="font-semibold mt-0.5">
            {groom.parentsLine1}
            <br />
            {groom.parentsLine2}
          </p>
        </div>

        <a
          href={`https://instagram.com/${groom.instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a]/70 bg-white/20 px-3.5 py-1 text-[clamp(11px,2.5cqw,13px)] font-medium text-[#2a2a2a] backdrop-blur-xs transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2a]"
        >
          <Camera className="h-3.5 w-3.5 stroke-2" />
          <span>{groom.instagramHandle}</span>
        </a>
      </motion.div>

      {/* BRIDE INFO CARD */}
      <motion.div
        className="absolute inset-x-0 bottom-[11%] z-50 flex flex-col items-center text-center px-6 pointer-events-none"
        style={{
          opacity: brideOpacity,
          x: brideX,
        }}
      >
        <span
          className={`${greatVibes.className} text-[clamp(52px,13cqw,72px)] leading-none text-[#2a2a2a] select-none`}
        >
          {bride.scriptName}
        </span>

        <p className="-mt-1 text-[clamp(15px,3.6cqw,18px)] font-bold text-[#2a2a2a] tracking-tight">
          {bride.fullName}
        </p>

        <div className="mt-3 flex flex-col items-center text-[clamp(11px,2.6cqw,13px)] text-[#2a2a2a] leading-snug">
          <span className="font-normal opacity-90">Daughter of</span>
          <p className="font-semibold mt-0.5">
            {bride.parentsLine1}
            <br />
            {bride.parentsLine2}
          </p>
        </div>

        <a
          href={`https://instagram.com/${bride.instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a]/70 bg-white/20 px-3.5 py-1 text-[clamp(11px,2.5cqw,13px)] font-medium text-[#2a2a2a] backdrop-blur-xs transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2a]"
        >
          <Camera className="h-3.5 w-3.5 stroke-2" />
          <span>{bride.instagramHandle}</span>
        </a>
      </motion.div>

      {/* EVENT DETAILS SECTION */}
      <motion.div
        className="absolute inset-x-0 top-[4%] bottom-[7%] z-50 flex flex-col justify-between px-4 sm:px-8 pointer-events-none"
        style={{
          opacity: eventOpacity,
          y: eventY,
        }}
      >
        <div className="relative z-10 w-full max-w-[310px] self-start rounded-2xl bg-white/75 p-4.5 sm:p-5 backdrop-blur-md border border-white/60 shadow-xs transition-all">
          <span
            className={`${greatVibes.className} block text-[clamp(34px,8cqw,44px)] leading-none text-[#6d574d] select-none mb-1`}
          >
            {matrimony.title}
          </span>

          <div className="space-y-0.5 text-[#2a2a2a]">
            <p className="text-[clamp(12px,2.8cqw,14px)] font-bold tracking-tight">
              {matrimony.date}
            </p>
            <p className="text-[clamp(11px,2.4cqw,13px)] font-medium text-[#4a4a4a]">
              {matrimony.time}
            </p>
          </div>

          <div className="pt-2 mt-2 border-t border-[#6d574d]/15">
            <p className="text-[clamp(12px,2.6cqw,13.5px)] font-bold text-[#2a2a2a]">
              {matrimony.venue}
            </p>
            <p className="text-[clamp(10.5px,2.3cqw,12px)] text-[#555555] leading-snug mt-0.5">
              {matrimony.address}
            </p>
          </div>

          {matrimony.mapsUrl && (
            <a
              href={matrimony.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#6d574d] px-3.5 py-1.5 text-[clamp(11px,2.2cqw,12px)] font-medium text-white shadow-xs transition-colors hover:bg-[#5a473e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d574d]"
            >
              <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Google Maps</span>
            </a>
          )}
        </div>

        <div className="relative z-10 w-full max-w-[310px] self-end rounded-2xl bg-white/75 p-4.5 sm:p-5 backdrop-blur-md border border-white/60 shadow-xs transition-all text-right">
          <span
            className={`${greatVibes.className} block text-[clamp(34px,8cqw,44px)] leading-none text-[#6d574d] select-none mb-1`}
          >
            {reception.title}
          </span>

          <div className="space-y-0.5 text-[#2a2a2a]">
            <p className="text-[clamp(12px,2.8cqw,14px)] font-bold tracking-tight">
              {reception.date}
            </p>
            <p className="text-[clamp(11px,2.4cqw,13px)] font-medium text-[#4a4a4a]">
              {reception.time}
            </p>
          </div>

          <div className="pt-2 mt-2 border-t border-[#6d574d]/15">
            <p className="text-[clamp(12px,2.6cqw,13.5px)] font-bold text-[#2a2a2a]">
              {reception.venue}
            </p>
            <p className="text-[clamp(10.5px,2.3cqw,12px)] text-[#555555] leading-snug mt-0.5">
              {reception.address}
            </p>
          </div>

          {reception.mapsUrl && (
            <a
              href={reception.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#6d574d] px-3.5 py-1.5 text-[clamp(11px,2.2cqw,12px)] font-medium text-white shadow-xs transition-colors hover:bg-[#5a473e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d574d]"
            >
              <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Google Maps</span>
            </a>
          )}
        </div>

        <div className="relative z-10 w-full max-w-[320px] mx-auto rounded-xl bg-white/80 p-3.5 backdrop-blur-md border border-white/60 shadow-xs text-center">
          <p className="text-[clamp(10.5px,2.3cqw,12px)] text-[#333333] font-medium leading-snug">
            For guests who are unable to attend, you can watch the event through
            the link below.
          </p>
          <a
            href={streamingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#6d574d] px-4 py-1.5 text-[clamp(11px,2.2cqw,12px)] font-medium text-white shadow-xs transition-colors hover:bg-[#5a473e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d574d]"
          >
            <Video className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Live Streaming</span>
          </a>
        </div>
      </motion.div>

      {/* DRESS CODE SECTION */}
      <motion.div
        className="absolute inset-x-0 top-[12%] bottom-[12%] z-50 flex items-center justify-center px-4 sm:px-6 pointer-events-none"
        style={{
          opacity: dressCodeOpacity,
          y: dressCodeY,
        }}
      >
        <div className="w-full max-w-[360px] rounded-2xl bg-white/80 p-6 sm:p-7 backdrop-blur-md border border-white/70 shadow-md text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6d574d]/10 text-[#6d574d] mb-2">
            <Shirt className="w-5 h-5 stroke-[2]" />
          </div>

          <span
            className={`${greatVibes.className} block text-[clamp(38px,9cqw,48px)] leading-none text-[#6d574d] select-none`}
          >
            {dressCode.title || DEFAULT_DRESS_CODE.title}
          </span>

          <p className="mt-1 text-[clamp(11px,2.4cqw,13px)] font-bold text-[#6d574d] tracking-wider uppercase">
            {dressCode.subtitle || DEFAULT_DRESS_CODE.subtitle}
          </p>

          <p className="mt-3 text-[clamp(11px,2.3cqw,12.5px)] text-[#4a4a4a] leading-relaxed">
            {dressCode.description || DEFAULT_DRESS_CODE.description}
          </p>

          <div className="mt-5 grid grid-cols-4 gap-3 w-full">
            {(dressCode.colors || DEFAULT_DRESS_CODE.colors!).map((color) => (
              <div
                key={color.name}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/10 shadow-xs transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span className="text-[10px] sm:text-[11px] font-medium text-[#333333] leading-tight">
                  {color.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-3.5 border-t border-[#6d574d]/15 w-full flex items-center justify-center gap-1.5 text-[#6d574d]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[clamp(11px,2.3cqw,12.5px)] font-semibold">
              {dressCode.note || DEFAULT_DRESS_CODE.note}
            </span>
          </div>
        </div>
      </motion.div>

      {/* CLOSING QUOTE SECTION */}
      <motion.div
        className="absolute top-[8%] inset-x-0 z-50 flex items-center justify-center pointer-events-none"
        style={{
          opacity: closingQuoteOpacity,
          y: closingQuoteY,
        }}
      >
        <div className="absolute w-[130%] max-w-250 h-225 translate-y-[2%] opacity-90">
          <Image
            src="/images/cloud3_80_min.png"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            className="object-contain object-center"
            aria-hidden="true"
          />
        </div>

        <blockquote className="relative z-10 flex flex-col items-center text-center px-[6.4cqw] mt-[8cqw] drop-shadow-xs">
          <p className="text-[clamp(12px,2.4cqw,14px)] text-[#2a2a2a] font-medium leading-[1.6] mb-[2.4cqw]">
            "{closingQuote.text}"
          </p>
          {closingQuote.citation && (
            <cite className="text-[clamp(13px,2.6cqw,16px)] font-bold text-[#2a2a2a] not-italic">
              {closingQuote.citation}
            </cite>
          )}
        </blockquote>
      </motion.div>

      {/* SWIPE UP INDICATOR */}
      <div className="absolute bottom-[clamp(12px,2cqw,20px)] inset-x-0 z-50 flex flex-col items-center justify-center text-[#2a2a2a] animate-bounce pointer-events-none">
        <ChevronUp className="w-4 h-4 mb-0.5" strokeWidth={2.5} />
        <span className="text-[clamp(10px,2cqw,12px)] font-semibold tracking-tight">
          Swipe up
        </span>
      </div>
    </section>
  );
}
