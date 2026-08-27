"use client";

import { useEffect } from "react";
import { Great_Vibes } from "next/font/google";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import StageOverlays from "./StageOverlays";
import StageScene from "./StageScene";
import {
  DEFAULT_BRIDE,
  DEFAULT_CLOSING_QUOTE,
  DEFAULT_DRESS_CODE,
  DEFAULT_GROOM,
  DEFAULT_MATRIMONY,
  DEFAULT_RECEPTION,
  type StageProps,
} from "./Stage.types";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export type {
  BrideInfo,
  ClosingQuoteInfo,
  ColorSwatch,
  DressCodeInfo,
  EventDetail,
  GroomInfo,
  StageProps,
} from "./Stage.types";

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

  const scale = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2],
    [1, 2.35, 2.35, 2.45, 2.45, 1, 1],
  );
  const translateX = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2],
    ["0%", "-20%", "20%", "-60%", "-60%", "0%", "0%"],
  );
  const translateY = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2],
    ["0%", "-10%", "-10%", "-6%", "-6%", "0%", "0%"],
  );

  const openingQuoteOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const scrimOpacity = useTransform(
    progress,
    [0.1, 0.2, 0.88, 0.96],
    [0, 1, 1, 0],
  );
  const groomOpacity = useTransform(
    progress,
    [0, 0.1, 0.2, 0.3, 0.38, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const groomY = useTransform(progress, [0, 0.1, 0.2, 1], [40, 40, 0, 0]);
  const groomX = useTransform(
    progress,
    [0, 0.3, 0.38, 1],
    ["0%", "0%", "100%", "100%"],
  );
  const brideOpacity = useTransform(
    progress,
    [0, 0.32, 0.4, 0.5, 0.58, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const brideX = useTransform(
    progress,
    [0, 0.32, 0.4, 0.5, 0.58, 1],
    ["-100%", "-100%", "0%", "0%", "-100%", "-100%"],
  );
  const eventOpacity = useTransform(
    progress,
    [0, 0.52, 0.6, 0.7, 0.78, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const eventY = useTransform(
    progress,
    [0, 0.52, 0.6, 0.7, 0.78, 1],
    [30, 30, 0, 0, -20, -20],
  );
  const dressCodeOpacity = useTransform(
    progress,
    [0, 0.72, 0.8, 0.88, 0.94, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const dressCodeY = useTransform(
    progress,
    [0, 0.72, 0.8, 0.88, 0.94, 1],
    [30, 30, 0, 0, -20, -20],
  );
  const closingQuoteOpacity = useTransform(
    progress,
    [0, 0.9, 0.98, 1, 1.08],
    [0, 0, 1, 1, 0],
  );
  const closingQuoteY = useTransform(
    progress,
    [0, 0.9, 0.98, 1, 1.08],
    [30, 30, 0, 0, -20],
  );

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-[#7bbff1] @container">
      <StageScene
        scale={scale}
        translateX={translateX}
        translateY={translateY}
        scrimOpacity={scrimOpacity}
      />
      <StageOverlays
        openingQuoteOpacity={openingQuoteOpacity}
        groom={groom}
        bride={bride}
        matrimony={matrimony}
        reception={reception}
        dressCode={dressCode}
        closingQuote={closingQuote}
        streamingUrl={streamingUrl}
        groomOpacity={groomOpacity}
        groomX={groomX}
        groomY={groomY}
        brideOpacity={brideOpacity}
        brideX={brideX}
        eventOpacity={eventOpacity}
        eventY={eventY}
        dressCodeOpacity={dressCodeOpacity}
        dressCodeY={dressCodeY}
        closingQuoteOpacity={closingQuoteOpacity}
        closingQuoteY={closingQuoteY}
        greatVibesClassName={greatVibes.className}
      />
    </section>
  );
}
