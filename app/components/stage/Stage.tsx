"use client";

import { Great_Vibes } from "next/font/google";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import StageOverlays from "./StageOverlays";
import StageScene from "./StageScene";
import type { PlaneTransform, StageProps } from "./Stage.types";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// The camera's own push-in, and the point it pivots about - both must match
// StageCamera, since every plane below is solved against them.
const CAMERA_ZOOM = 2.4;
const CAMERA_ORIGIN_Y = 0.48;

// Where the camera settles for the event beat, once it has slid off the
// couple. Everything below is solved against CAMERA_ZOOM, so this only has to
// stay under it - the planes follow through `dolly`.
const EVENT_ZOOM = 2.05;

// Past the final beat the stage keeps going, driven by MainSection scrolling
// up over it rather than by a chapter tick: it leans in this far while the
// closing quote fades out, so the two sections hand over with a move instead
// of a cut. Every keyframe list here already runs out to 1.2 for it.
const HANDOFF_ZOOM = 1.18;

// How close to its resting size the camera must be before the closing quote
// starts to appear. Small enough that what is left to travel is invisible
// under the fade, large enough that the quote is not waiting on the spring's
// last, slowest percent.
const CLOSING_QUOTE_CUE_SCALE = 1.06;

// Dolly zoom. A single camera scale only magnifies a flat picture, so each
// plane carries a scale of its own on top of it: the flowers and the couple
// overtake the lens while the tree canopy holds its size, and the shot reads
// as the camera pushing *through* the field rather than at it.
//
// Values are each plane's effective on-screen zoom at full push-in. Far to
// near they must stay in ascending order - a plane growing more slowly than
// the one behind it would read as sliding backwards through it.
const PLANE_ZOOM = {
  canopy: 1.2, // sky + trees: all but standing still
  field: 1.5, // the mid grass the couple stands in
  couple: 1.84,
  nearGrass: 2.1, // the two front flower bands, drawn over the couple
  frontGrass: 2.4,
};

// A landmark row on each plane, as a fraction of the stage height, measured
// in the browser rather than eyeballed: the couple's is the top of its alpha
// bbox (the head), the canopy's the first row that is >=20% foliage green,
// the three grass bands' the first row that is >=15% flower yellow.
const REST_LINE = {
  canopy: 0.313,
  field: 0.619,
  couple: 0.412,
  nearGrass: 0.766,
  frontGrass: 0.789,
};

// Where those same landmarks belong once the camera has pushed in, read off
// the reference frames of the person beats. Three things define that framing:
// the canopy holds the height it has at rest, the couple's head clears it
// into the sky, and the two front flower bands come back down in front of the
// couple, crossing them just above the knee (which lands at 0.75).
//
// Scale alone cannot produce this. Everything below CAMERA_ORIGIN_Y is thrown
// downward by the push-in, so the flower bands used to leave the frame
// entirely; a plane's shift is solved from these two tables instead.
const HOLD_LINE = {
  canopy: 0.31,
  field: 0.71,
  couple: 0.114,
  nearGrass: 0.73,
  frontGrass: 0.75,
};

// The share of the camera's pan the canopy still rides. Holding it back is
// what a distant plane does anyway, and here it is also load-bearing: at
// 1.2x against the camera's 2.4x the canopy clears the stage by only ~76px a
// side, and the widest pan is 22cqw.
const CANOPY_PAN = 0.35;

type PlaneName = keyof typeof PLANE_ZOOM;

/**
 * One plane's transform, as a function of the 0..1 dolly ramp.
 *
 * A plane nested in the camera maps a point p to
 *   CAMERA_ORIGIN_Y + zoom * (p - CAMERA_ORIGIN_Y) + CAMERA_ZOOM * shift
 * (both share the origin, and the camera scales the plane's own translate),
 * so the shift that carries REST_LINE onto HOLD_LINE follows directly. Both
 * terms are 0 at rest, so the planes fold back into the original composition.
 */
function usePlane(dolly: MotionValue<number>, name: PlaneName): PlaneTransform {
  const zoom = PLANE_ZOOM[name];
  const gain = zoom / CAMERA_ZOOM - 1;
  const shift =
    (HOLD_LINE[name] -
      CAMERA_ORIGIN_Y -
      zoom * (REST_LINE[name] - CAMERA_ORIGIN_Y)) /
    CAMERA_ZOOM;
  return {
    scale: useTransform(dolly, (d) => 1 + d * gain),
    // Percent, so it resolves against the plane wrapper's own height - which
    // is the stage - and holds across viewports.
    y: useTransform(dolly, (d) => `${d * shift * 100}%`),
  };
}

export default function Stage({
  revealProgress,
  groom,
  bride,
  matrimony,
  reception,
  dressCode,
  openingQuote,
  closingQuote,
  streamingUrl = "#",
  assets,
  coupleNames,
}: StageProps) {
  const shouldReduceMotion = useReducedMotion();
  // The scroller owns the reveal value and writes it straight into this
  // MotionValue, frame by frame, so the camera can track a gesture without a
  // single React render. The fallback only exists so Stage still stands up on
  // its own - hooks cannot be conditional.
  const fallbackProgress = useMotionValue(0);
  const rawProgress = revealProgress ?? fallbackProgress;

  // The camera's own weight, and the whole reason a beat reads as a shot
  // rather than a jump: heavily overdamped (a damping ratio of ~2.4), so the
  // slow mode has a time constant of ~1.2s and a leg takes the better part of
  // two seconds to come to rest. That slowness is the effect, not a cost of
  // it, and these three numbers are tuned - leave them alone.
  //
  // What did change is what the slowness costs. This used to be the only
  // thing carrying the camera: a wheel tick fired it at the next beat and
  // then nothing could steer it, so the scroller had to go deaf for 1.5s or a
  // second tick would land while the pan was a third travelled and skip a
  // beat outright. Now the scroll position is the target and this only trails
  // it, so a tick arriving mid-flight just moves the target and the camera
  // curves towards the new one. Same weight, no deaf period.
  const springProgress = useSpring(rawProgress, {
    stiffness: 25,
    damping: 32,
    mass: 1.8,
    restDelta: 0.0005,
  });
  // Readers who ask for reduced motion get exactly the same framings, cut to
  // rather than flown to: every keyframe below is solved against `progress`,
  // so dropping the spring removes the travel without touching a single
  // composition value.
  const progress = shouldReduceMotion ? rawProgress : springProgress;

  // Pushes in on the couple and holds there. The camera origin sits on the
  // couple, so no translation is needed to keep them framed.
  // Two plateaus, not one. The camera pushes in to CAMERA_ZOOM for the two
  // person beats, then eases back to EVENT_ZOOM as it slides off the couple -
  // the event beat is a wider, emptier framing, and pulling back is what sells
  // the camera stepping away rather than merely sliding sideways. It then
  // holds there through the dress code: those two beats are one place the
  // camera stands still in, and only their overlays cross-fade.
  const scale = useTransform(
    progress,
    // Jarak zoom-in (0 ke 0.26) kini sama persis dengan zoom-out (0.74 ke 1)
    [0, 0.26, 0.44, 0.5, 0.78, 0.95, 1, 1.2],
    [1, CAMERA_ZOOM, CAMERA_ZOOM, EVENT_ZOOM, EVENT_ZOOM, 1, 1, HANDOFF_ZOOM],
  );
  // 0 at rest, 1 at full push-in. Read straight off the camera scale rather
  // than kept as its own keyframe list: the two can then never drift, and the
  // event beat's pull-back eases the planes back together on its own.
  const dolly = useTransform(scale, (s) => (s - 1) / (CAMERA_ZOOM - 1));
  const canopy = usePlane(dolly, "canopy");
  const field = usePlane(dolly, "field");
  const couple = usePlane(dolly, "couple");
  // The camera cannot actually pan far enough to leave the couple behind:
  // the canopy is barely wider than the stage, so the pan that would clear
  // them drags its own edge into frame. They fade out instead, over exactly
  // the leg that slides off them, so they leave with the camera rather than
  // blinking out. They stay gone until the camera turns back for the closing
  // quote, which is what keeps the dress code on the same empty field.
  const coupleOpacity = useTransform(
    progress,
    [0, 0.44, 0.5, 0.78, 0.95, 1],
    [1, 1, 0, 0, 1, 1],
  );
  const nearGrass = usePlane(dolly, "nearGrass");
  const frontGrass = usePlane(dolly, "frontGrass");
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
  //
  // Kept as a number (in cqw) rather than a string so the canopy's own pan can
  // be solved from it below.
  const panX = useTransform(
    progress,
    [0, 0.15, 0.26, 0.32, 0.38, 0.44, 0.5, 0.78, 0.95, 1.2],
    [
      0,
      0,
      -17, // Kamera tiba di pengantin pria
      -17, // HOLD selama kartu pria tampil
      17, // Kamera tiba di pengantin wanita
      17, // HOLD selama kartu wanita tampil
      -40, // Terus melewati pengantin pria, ke latar yang kosong
      -40, // HOLD sampai dress code selesai - kamera tidak bergerak lagi
      0,
      0,
    ],
  );
  const translateX = useTransform(panX, (v) => `${v}cqw`);
  // A plane nested in the camera is panned by S*t + T, so pulling the canopy
  // back to CANOPY_PAN of the camera's travel needs t = T*(CANOPY_PAN-1)/S.
  // Dividing by the live camera scale keeps it exact through the stretch where
  // the zoom and the pan overlap (0.15-0.26).
  const canopyX = useTransform([panX, scale], ([pan, cameraScale]: number[]) =>
    cameraScale === 0 ? "0cqw" : `${(pan * (CANOPY_PAN - 1)) / cameraScale}cqw`,
  );

  const openingQuoteOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  // The quote sits on the nearest plane of all: it swells past the frame as it
  // fades, so the camera appears to pass straight through it.
  const openingQuoteScale = useTransform(progress, [0, 0.12], [1, 1.32]);
  const scrimOpacity = useTransform(
    progress,
    [0.1, 0.2, 0.78, 0.95],
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
  // The cloud wash behind both stationary beats. It is one fade across the
  // pair rather than one per overlay, so it does not blink out and back in
  // while the camera is holding still.
  const washOpacity = useTransform(
    progress,
    [0, 0.44, 0.5, 0.78, 0.95, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const eventOpacity = useTransform(
    progress,
    [0, 0.44, 0.5, 0.58, 0.64, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const eventY = useTransform(
    progress,
    [0, 0.44, 0.5, 0.58, 0.64, 1],
    [30, 30, 0, 0, -20, -20],
  );
  const dressCodeOpacity = useTransform(
    progress,
    [0, 0.64, 0.7, 0.78, 0.84, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const dressCodeY = useTransform(
    progress,
    [0, 0.64, 0.7, 0.78, 0.84, 1],
    [30, 30, 0, 0, -20, -20],
  );
  // The closing quote waits on the camera, not on a progress number, and
  // fades on a clock of its own.
  //
  // Reading it off `progress` cannot give both halves of what this beat
  // needs. Placed late, it lands in the spring's asymptote, where a one
  // second fade stretches to four; placed early enough to run at a sane
  // speed, it plays over a scene that is still shrinking - and a still
  // element over a receding background reads as the element rushing forward,
  // which is exactly the "zoom" it appeared to have. Pulling the camera's
  // own keyframe in to make room instead made the whole scene snap back.
  //
  // So the cue is the camera arriving, whatever route it took there, and the
  // fade runs on a second, quicker spring that owes nothing to the first.
  const closingQuoteCue = useTransform(
    [progress, scale],
    ([p, cameraScale]: number[]) =>
      Number(p > 0.8 && p < 1.04 && cameraScale < CLOSING_QUOTE_CUE_SCALE),
  );
  const closingQuoteFade = useSpring(closingQuoteCue, {
    stiffness: 90,
    damping: 30,
    mass: 1,
    restDelta: 0.001,
  });
  const closingQuoteOpacity = shouldReduceMotion
    ? closingQuoteCue
    : closingQuoteFade;

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-[#7bbff1] @container">
      <StageScene
        scale={scale}
        translateX={translateX}
        canopy={{ ...canopy, x: canopyX }}
        field={field}
        couple={{ ...couple, opacity: coupleOpacity }}
        nearGrass={nearGrass}
        frontGrass={frontGrass}
        assets={assets}
        coupleNames={coupleNames}
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
        openingQuoteScale={openingQuoteScale}
        washOpacity={washOpacity}
        groom={groom}
        bride={bride}
        matrimony={matrimony}
        reception={reception}
        dressCode={dressCode}
        openingQuote={openingQuote}
        closingQuote={closingQuote}
        streamingUrl={streamingUrl}
        assets={assets}
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
        greatVibesClassName={greatVibes.className}
      />
    </section>
  );
}
