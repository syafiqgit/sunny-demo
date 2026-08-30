import type { MotionValue } from "framer-motion";

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
  description?: string;
  colors?: ColorSwatch[];
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

export interface SceneMotion {
  scale: MotionValue<number>;
  translateX: MotionValue<string>;
  translateY: MotionValue<string>;
  scrimOpacity: MotionValue<number>;
}

/**
 * One dolly plane's transform. The scale is what separates the planes; the
 * vertical shift is what lands each one on its mark once the camera has
 * pushed in - a scale alone drags a bottom-anchored layer straight out of
 * frame, which is how the flower bands used to vanish at the person holds.
 */
export interface PlaneTransform {
  scale: MotionValue<number>;
  y: MotionValue<string>;
}

/**
 * The dolly-zoom planes, far to near. Each is applied *inside* the camera, so
 * a plane's on-screen size is (camera scale x plane scale). The canopy also
 * carries its own pan: a plane that barely grows can no longer afford to
 * slide the full width the camera does - see Stage.tsx.
 */
export interface PlaneMotion {
  canopy: PlaneTransform & { x: MotionValue<string> };
  field: PlaneTransform;
  couple: PlaneTransform & { opacity: MotionValue<number> };
  nearGrass: PlaneTransform;
  frontGrass: PlaneTransform;
}

export interface OverlayMotion {
  openingQuoteOpacity: MotionValue<number>;
  openingQuoteScale: MotionValue<number>;
  washOpacity: MotionValue<number>;
  groomOpacity: MotionValue<number>;
  groomX: MotionValue<string>;
  groomY: MotionValue<number>;
  brideOpacity: MotionValue<number>;
  brideX: MotionValue<string>;
  eventOpacity: MotionValue<number>;
  eventY: MotionValue<number>;
  dressCodeOpacity: MotionValue<number>;
  dressCodeY: MotionValue<number>;
  closingQuoteOpacity: MotionValue<number>;
}

export const DEFAULT_GROOM: GroomInfo = {
  scriptName: "Vincent",
  fullName: "Vincent Raphael",
  parentsLine1: "Mr. Vincent's Father &",
  parentsLine2: "Mrs. Vincent's Mother",
  instagramHandle: "vincent",
};

export const DEFAULT_BRIDE: BrideInfo = {
  scriptName: "Natasha",
  fullName: "Natasha Aurelia",
  parentsLine1: "Mr. Natasha's Father &",
  parentsLine2: "Mrs. Natasha's Mother",
  instagramHandle: "natasha",
};

export const DEFAULT_MATRIMONY: EventDetail = {
  title: "Holy Matrimony",
  date: "Saturday, April 25, 2026",
  time: "13.00 - 14.00 WIB",
  venue: "Plaza Rafaela Garden",
  address: "Jl. Suryalaya Indah, Buah Batu, Bandung",
  mapsUrl: "https://maps.google.com",
};

export const DEFAULT_RECEPTION: EventDetail = {
  title: "Reception",
  date: "Saturday, April 25, 2026",
  time: "14.00 - 17.00 WIB",
  venue: "Plaza Rafaela Garden",
  address: "Jl. Suryalaya Indah, Buah Batu, Bandung",
  mapsUrl: "https://maps.google.com",
};

export const DEFAULT_DRESS_CODE: DressCodeInfo = {
  title: "Dresscode",
  description:
    "We would love for our guests to wear these colors on our special day.",
  // Read off the reference; the swatches carry no visible labels, so the
  // names only key the list.
  colors: [
    { name: "Warm Sand", hex: "#A98D76" },
    { name: "White", hex: "#FFFFFF" },
  ],
};

export const DEFAULT_CLOSING_QUOTE: ClosingQuoteInfo = {
  text: "And over all these virtues put on love, which binds them all together in perfect unity.",
  citation: "Colossians 3:14",
};
