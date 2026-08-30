"use client";

import { useEffect } from "react";
import { Great_Vibes } from "next/font/google";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
    stiffness: 25, // Dinaikkan sedikit dari 15 agar lebih responsif saat di-scroll
    damping: 32, // Pengereman tetap halus dan mencegah efek mantul
    mass: 1.8, // Dikurangi dari 3 agar kamera sampai di tujuan lebih cepat
    restDelta: 0.0005,
  });

  // Pushes in on the couple and holds there. The camera origin sits on the
  // couple, so no translation is needed to keep them framed.
  // Pushes in on the couple and holds there.
  const scale = useTransform(
    progress,
    // Jarak zoom-in (0 ke 0.26) kini sama persis dengan zoom-out (0.74 ke 1)
    [0, 0.26, 0.74, 1, 1.2],
    [1, 2.4, 2.4, 1, 1],
  );
  // Three holds at a shared zoom level: groom, bride, then the empty-grass
  // event framing - each a plateau with a transition either side, matched by
  // a pair in the opacity keyframes below so a card is never mid-fade while
  // the camera is still moving, or vice versa.
  //
  // The pan starts at 0.15, exactly where the zoom above finishes, with no
  // flat stretch between them: the centred framing is a moment the camera
  // passes through on its way to the groom, not somewhere it waits. Leaving
  // a gap here (the pan used to idle until 0.20) stalled the camera dead for
  // a third of a second after the zoom landed.
  //
  // Any pan must be in cqw, not %: a percentage resolves against the
  // camera's own width, which is far wider than the screen on tall phones.
  const translateX = useTransform(
    progress,
    [0, 0.15, 0.26, 0.32, 0.38, 0.44, 0.5, 0.58, 0.66, 1, 1.2],
    [
      "0cqw",
      "0cqw",
      "-17cqw", // Kamera tiba di pengantin pria
      "-17cqw", // HOLD (tetap di -30cqw) selama kartu pria tampil
      "17cqw", // Kamera tiba di pengantin wanita
      "17cqw", // HOLD (tetap di 27cqw) selama kartu wanita tampil
      "-22cqw",
      "-22cqw",
      "0cqw",
      "0cqw",
      "0cqw",
    ],
  );
  const translateY = useTransform(
    progress,
    [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2],
    ["0%", "0%", "0%", "0%", "0%", "0%", "0%"],
  );

  const openingQuoteOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const scrimOpacity = useTransform(
    progress,
    [0.1, 0.2, 0.88, 0.96],
    [0, 1, 1, 0],
  );
  // Fades in across 0.17-0.27, overlapping the pan rather than waiting for
  // it to land, so the card rides in with the camera.
  const groomOpacity = useTransform(
    progress,
    [0, 0.17, 0.27, 0.32, 0.38, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const groomY = useTransform(progress, [0, 0.15, 0.27, 1], [40, 40, 0, 0]);
  const groomX = useTransform(
    progress,
    [0, 0.32, 0.38, 1],
    ["0%", "0%", "100%", "100%"],
  );
  const brideOpacity = useTransform(
    progress,
    [0, 0.32, 0.38, 0.44, 0.5, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const brideX = useTransform(
    progress,
    [0, 0.32, 0.38, 0.44, 0.5, 1],
    ["-100%", "-100%", "0%", "0%", "-100%", "-100%"],
  );
  const eventOpacity = useTransform(
    progress,
    [0, 0.44, 0.5, 0.58, 0.66, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const eventY = useTransform(
    progress,
    [0, 0.44, 0.5, 0.58, 0.66, 1],
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
      />
      {/* Outside the camera on purpose: the wash is part of the interface, so
          panning it would drag its own edge into view. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[46%] z-45 bg-linear-to-t from-[#fcf9f2]/92 via-[#fcf9f2]/58 to-transparent pointer-events-none"
        style={{ opacity: scrimOpacity }}
        aria-hidden="true"
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
