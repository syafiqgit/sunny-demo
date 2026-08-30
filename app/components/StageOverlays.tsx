"use client";

import Image from "next/image";
import {
  Camera,
  ChevronUp,
  MapPin,
  Shirt,
  Sparkles,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import type {
  BrideInfo,
  ClosingQuoteInfo,
  DressCodeInfo,
  EventDetail,
  GroomInfo,
  OverlayMotion,
} from "./Stage.types";
import { DEFAULT_DRESS_CODE } from "./Stage.types";

interface StageOverlaysProps extends OverlayMotion {
  groom: GroomInfo;
  bride: BrideInfo;
  matrimony: EventDetail;
  reception: EventDetail;
  dressCode: DressCodeInfo;
  closingQuote: ClosingQuoteInfo;
  streamingUrl: string;
  greatVibesClassName: string;
}

function QuoteOverlay({
  opacity,
  y,
  text,
  citation,
  opening = false,
}: {
  opacity: OverlayMotion["openingQuoteOpacity"];
  y?: OverlayMotion["closingQuoteY"];
  text: string;
  citation?: string;
  opening?: boolean;
}) {
  return (
    <motion.div
      className="absolute top-[8%] inset-x-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ opacity, ...(y ? { y } : {}) }}
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
          {opening
            ? '"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate."'
            : `"${text}"`}
        </p>
        {citation && (
          <cite className="text-[clamp(13px,2.6cqw,16px)] font-bold text-[#2a2a2a] not-italic">
            {citation}
          </cite>
        )}
      </blockquote>
    </motion.div>
  );
}

function PersonOverlay({
  person,
  relation,
  opacity,
  x,
  y,
  greatVibesClassName,
}: {
  person: GroomInfo | BrideInfo;
  relation: string;
  opacity: OverlayMotion["groomOpacity"];
  x: OverlayMotion["groomX"];
  y?: OverlayMotion["groomY"];
  greatVibesClassName: string;
}) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[11%] z-50 flex flex-col items-center text-center px-6 pointer-events-none"
      style={{ opacity, x, ...(y ? { y } : {}) }}
    >
      <span
        className={`${greatVibesClassName} text-[clamp(52px,13cqw,72px)] leading-none text-[#2a2a2a] select-none`}
      >
        {person.scriptName}
      </span>
      <p className="-mt-1 text-[clamp(15px,3.6cqw,18px)] font-bold text-[#2a2a2a] tracking-tight">
        {person.fullName}
      </p>
      <div className="mt-3 flex flex-col items-center text-[clamp(11px,2.6cqw,13px)] text-[#2a2a2a] leading-snug">
        <span className="font-normal opacity-90">{relation}</span>
        <p className="font-semibold mt-0.5">
          {person.parentsLine1}
          <br />
          {person.parentsLine2}
        </p>
      </div>
      <a
        href={`https://instagram.com/${person.instagramHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a]/70 bg-white/20 px-3.5 py-1 text-[clamp(11px,2.5cqw,13px)] font-medium text-[#2a2a2a] backdrop-blur-xs transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2a]"
      >
        <Camera className="h-3.5 w-3.5 stroke-2" />
        <span>{person.instagramHandle}</span>
      </a>
    </motion.div>
  );
}

function EventCard({
  event,
  align = "left",
  greatVibesClassName,
}: {
  event: EventDetail;
  align?: "left" | "right";
  greatVibesClassName: string;
}) {
  return (
    <div
      className={`relative z-10 w-full max-w-77.5 ${align === "left" ? "self-start" : "self-end"} rounded-2xl bg-white/75 p-4.5 sm:p-5 backdrop-blur-md border border-white/60 shadow-xs transition-all ${align === "right" ? "text-right" : ""}`}
    >
      <span
        className={`${greatVibesClassName} block text-[clamp(34px,8cqw,44px)] leading-none text-[#6d574d] select-none mb-1`}
      >
        {event.title}
      </span>
      <div className="space-y-0.5 text-[#2a2a2a]">
        <p className="text-[clamp(12px,2.8cqw,14px)] font-bold tracking-tight">
          {event.date}
        </p>
        <p className="text-[clamp(11px,2.4cqw,13px)] font-medium text-[#4a4a4a]">
          {event.time}
        </p>
      </div>
      <div className="pt-2 mt-2 border-t border-[#6d574d]/15">
        <p className="text-[clamp(12px,2.6cqw,13.5px)] font-bold text-[#2a2a2a]">
          {event.venue}
        </p>
        <p className="text-[clamp(10.5px,2.3cqw,12px)] text-[#555555] leading-snug mt-0.5">
          {event.address}
        </p>
      </div>
      {event.mapsUrl && (
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#6d574d] px-3.5 py-1.5 text-[clamp(11px,2.2cqw,12px)] font-medium text-white shadow-xs transition-colors hover:bg-[#5a473e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d574d]"
        >
          <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Google Maps</span>
        </a>
      )}
    </div>
  );
}

export default function StageOverlays({
  openingQuoteOpacity,
  groom,
  bride,
  matrimony,
  reception,
  dressCode,
  closingQuote,
  streamingUrl,
  groomOpacity,
  groomX,
  groomY,
  brideOpacity,
  brideX,
  eventOpacity,
  eventY,
  dressCodeOpacity,
  dressCodeY,
  closingQuoteOpacity,
  closingQuoteY,
  greatVibesClassName,
}: StageOverlaysProps) {
  const colors = dressCode.colors || DEFAULT_DRESS_CODE.colors!;

  return (
    <>
      <QuoteOverlay
        opacity={openingQuoteOpacity}
        text=""
        citation="Matthew 19:6"
        opening
      />
      <PersonOverlay
        person={groom}
        relation="Son of"
        opacity={groomOpacity}
        x={groomX}
        y={groomY}
        greatVibesClassName={greatVibesClassName}
      />
      <PersonOverlay
        person={bride}
        relation="Daughter of"
        opacity={brideOpacity}
        x={brideX}
        greatVibesClassName={greatVibesClassName}
      />
      <motion.div
        className="absolute inset-x-0 top-[4%] bottom-[7%] z-50 flex flex-col justify-between px-4 sm:px-8 pointer-events-none"
        style={{ opacity: eventOpacity, y: eventY }}
      >
        <EventCard
          event={matrimony}
          greatVibesClassName={greatVibesClassName}
        />
        <EventCard
          event={reception}
          align="right"
          greatVibesClassName={greatVibesClassName}
        />
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
      <motion.div
        className="absolute inset-x-0 top-[12%] bottom-[12%] z-50 flex items-center justify-center px-4 sm:px-6 pointer-events-none"
        style={{ opacity: dressCodeOpacity, y: dressCodeY }}
      >
        <div className="w-full max-w-90 rounded-2xl bg-white/80 p-6 sm:p-7 backdrop-blur-md border border-white/70 shadow-md text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6d574d]/10 text-[#6d574d] mb-2">
            <Shirt className="w-5 h-5 stroke-2" />
          </div>
          <span
            className={`${greatVibesClassName} block text-[clamp(38px,9cqw,48px)] leading-none text-[#6d574d] select-none`}
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
            {colors.map((color) => (
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
      <QuoteOverlay
        opacity={closingQuoteOpacity}
        y={closingQuoteY}
        text={closingQuote.text}
        citation={closingQuote.citation}
      />
      <div className="absolute bottom-[clamp(12px,2cqw,20px)] inset-x-0 z-50 flex flex-col items-center justify-center text-[#2a2a2a] animate-bounce pointer-events-none">
        <ChevronUp className="w-4 h-4 mb-0.5" strokeWidth={2.5} />
        <span className="text-[clamp(10px,2cqw,12px)] font-semibold tracking-tight">
          Swipe up
        </span>
      </div>
    </>
  );
}
