"use client";

import Image from "next/image";
import { Camera, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { instagramUrl, safeHref } from "../lib/url";
import type {
  BrideInfo,
  DressCodeInfo,
  EventDetail,
  GroomInfo,
  OverlayMotion,
  QuoteInfo,
  StageAssets,
} from "./Stage.types";

interface StageOverlaysProps extends OverlayMotion {
  groom: GroomInfo;
  bride: BrideInfo;
  matrimony: EventDetail;
  reception: EventDetail;
  dressCode: DressCodeInfo;
  openingQuote: QuoteInfo;
  closingQuote: QuoteInfo;
  streamingUrl: string;
  assets: Pick<StageAssets, "quoteCloud" | "eventWash">;
  greatVibesClassName: string;
}

// Every layer here is laid out against the stage's 500px design width, so a
// full-viewport `sizes` would have the optimizer ship a phone-width image for
// a box that is never wider than half of one.
const CLOUD_SIZES = "(max-width: 500px) 130vw, 650px";
const WASH_SIZES = "(max-width: 500px) 160vw, 800px";

// Shared by the maps and live-stream links: both open a third-party site in a
// new tab, so both need the opener isolated.
const EXTERNAL_LINK = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const BUTTON_CLASS =
  "pointer-events-auto inline-flex items-center rounded-md bg-[#6d574d] px-[2.7cqw] py-[1.75cqw] text-[clamp(9px,2.07cqw,11px)] font-medium text-[#f4f3f1] shadow-xs transition-colors hover:bg-[#5a473e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d574d]";

function QuoteOverlay({
  opacity,
  scale,
  quote,
  cloudSrc,
}: {
  opacity: OverlayMotion["openingQuoteOpacity"];
  scale?: OverlayMotion["openingQuoteScale"];
  quote: QuoteInfo;
  cloudSrc: string;
}) {
  return (
    <motion.div
      className="absolute top-[8%] inset-x-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ opacity, ...(scale ? { scale } : {}) }}
    >
      <div className="absolute w-[130%] max-w-250 h-225 translate-y-[2%] opacity-90">
        <Image
          src={cloudSrc}
          alt=""
          fill
          sizes={CLOUD_SIZES}
          quality={90}
          className="object-contain object-center"
          aria-hidden="true"
        />
      </div>

      <blockquote className="relative z-10 flex flex-col items-center text-center px-[6.4cqw] mt-[8cqw] drop-shadow-xs">
        <p className="text-[clamp(12px,2.4cqw,14px)] text-[#2a2a2a] font-medium leading-[1.6] mb-[2.4cqw]">
          &ldquo;{quote.text}&rdquo;
        </p>
        {quote.citation && (
          <cite className="text-[clamp(13px,2.6cqw,16px)] font-bold text-[#2a2a2a] not-italic">
            {quote.citation}
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
        href={instagramUrl(person.instagramHandle)}
        {...EXTERNAL_LINK}
        className="pointer-events-auto mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a]/70 bg-white/20 px-3.5 py-1 text-[clamp(11px,2.5cqw,13px)] font-medium text-[#2a2a2a] backdrop-blur-xs transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2a]"
      >
        <Camera className="h-3.5 w-3.5 stroke-2" />
        <span>{person.instagramHandle}</span>
      </a>
    </motion.div>
  );
}

/**
 * One event's details, set straight onto the cloud wash rather than into a
 * card. Every measurement here was read off the reference frame of this beat
 * and scaled from its 643px width to the stage's 500px design width: the type
 * sizes, the 8.5cqw side margin, the tighter gap under each heading and the
 * wider one before the venue line, and the button's own box.
 */
function EventDetailBlock({
  event,
  align = "left",
  greatVibesClassName,
}: {
  event: EventDetail;
  align?: "left" | "right";
  greatVibesClassName: string;
}) {
  const right = align === "right";
  const mapsUrl = safeHref(event.mapsUrl);

  return (
    <div
      className={`flex flex-col ${right ? "items-end text-right" : "items-start text-left"}`}
    >
      <span
        className={`${greatVibesClassName} block text-[clamp(29px,7.5cqw,40px)] leading-[1.15] text-[#6d574d] select-none`}
      >
        {event.title}
      </span>
      <p className="mt-[0.7cqw] text-[clamp(10px,2.33cqw,12.5px)] font-bold text-[#1e1f21] tracking-tight">
        {event.date}
      </p>
      <p className="mt-[0.5cqw] text-[clamp(10px,2.4cqw,12.5px)] text-[#33373a]">
        {event.time}
      </p>
      <p className="mt-[1.9cqw] text-[clamp(9.5px,2.16cqw,11.5px)] font-bold text-[#1e1f21]">
        {event.venue}
      </p>
      <p className="mt-[0.5cqw] text-[clamp(9px,2.07cqw,11px)] text-[#33373a] leading-snug">
        {event.address}
      </p>
      {mapsUrl && (
        <a href={mapsUrl} {...EXTERNAL_LINK} className={`mt-[2.2cqw] ${BUTTON_CLASS}`}>
          Google Maps
        </a>
      )}
    </div>
  );
}

export default function StageOverlays({
  openingQuoteOpacity,
  openingQuoteScale,
  washOpacity,
  groom,
  bride,
  matrimony,
  reception,
  dressCode,
  openingQuote,
  closingQuote,
  streamingUrl,
  assets,
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
  greatVibesClassName,
}: StageOverlaysProps) {
  const streamHref = safeHref(streamingUrl);

  return (
    <>
      <QuoteOverlay
        opacity={openingQuoteOpacity}
        scale={openingQuoteScale}
        quote={openingQuote}
        cloudSrc={assets.quoteCloud}
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
      {/* The event beat's own backdrop. It carries only the opacity, not the
          block's slide, so the wash sits still while the text rides in. */}
      <motion.div
        className="absolute inset-x-[-30%] top-[-10%] bottom-[10%] z-50 pointer-events-none"
        style={{ opacity: washOpacity }}
        aria-hidden="true"
      >
        <Image
          src={assets.eventWash}
          alt=""
          fill
          sizes={WASH_SIZES}
          quality={90}
          className="object-cover object-center"
        />
      </motion.div>
      {/* Bands read off the reference frame: the headings start 11.6% down and
          the last button ends 17.3% up, with justify-between reproducing its
          two near-equal gaps on its own. */}
      <motion.div
        className="absolute inset-x-0 top-[11.6%] bottom-[17.3%] z-50 flex flex-col justify-between px-[8.5cqw] pointer-events-none"
        style={{ opacity: eventOpacity, y: eventY }}
      >
        <EventDetailBlock
          event={matrimony}
          greatVibesClassName={greatVibesClassName}
        />
        <EventDetailBlock
          event={reception}
          align="right"
          greatVibesClassName={greatVibesClassName}
        />
        <div className="flex flex-col items-center text-center">
          <p className="text-[clamp(9px,2.07cqw,11px)] text-[#2a2a28] leading-relaxed px-[1cqw]">
            For guests who are unable to attend, you can watch the event through
            the link below.
          </p>
          {streamHref && (
            <a
              href={streamHref}
              {...EXTERNAL_LINK}
              className={`mt-[2.6cqw] ${BUTTON_CLASS}`}
            >
              Live Streaming
            </a>
          )}
        </div>
      </motion.div>
      {/* The dress code shares the event beat's framing exactly - same camera,
          same wash - so only the two overlays cross-fade. Proportions are the
          reference's, scaled from its 652px frame to the 500px design width:
          the pair of swatches is 9.5cqw across and overlaps by 0.9cqw. */}
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center px-[8.5cqw] text-center pointer-events-none"
        style={{ opacity: dressCodeOpacity, y: dressCodeY }}
      >
        <span
          className={`${greatVibesClassName} block text-[clamp(34px,8.6cqw,46px)] leading-[1.15] text-[#6d574d] select-none`}
        >
          {dressCode.title}
        </span>
        <p className="mt-[2.4cqw] text-[clamp(10px,2.33cqw,12.5px)] text-[#1e1f21] leading-relaxed">
          {dressCode.description}
        </p>
        <div className="mt-[6cqw] flex items-center justify-center">
          {dressCode.colors.map((color, index) => (
            <span
              key={color.name}
              title={color.name}
              className="w-[9.5cqw] h-[9.5cqw] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              style={{
                backgroundColor: color.hex,
                // Each swatch laps over the one before it, as in the reference.
                marginLeft: index === 0 ? undefined : "-0.9cqw",
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </motion.div>
      <QuoteOverlay
        opacity={closingQuoteOpacity}
        quote={closingQuote}
        cloudSrc={assets.quoteCloud}
      />
      <div className="absolute bottom-[clamp(12px,2cqw,20px)] inset-x-0 z-50 flex flex-col items-center justify-center text-[#2a2a2a] animate-bounce motion-reduce:animate-none pointer-events-none">
        <ChevronUp className="w-4 h-4 mb-0.5" strokeWidth={2.5} />
        <span className="text-[clamp(10px,2cqw,12px)] font-semibold tracking-tight">
          Swipe up
        </span>
      </div>
    </>
  );
}
