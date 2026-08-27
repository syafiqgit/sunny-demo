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

export interface SceneMotion {
  scale: MotionValue<number>;
  translateX: MotionValue<string>;
  translateY: MotionValue<string>;
  scrimOpacity: MotionValue<number>;
}

export interface OverlayMotion {
  openingQuoteOpacity: MotionValue<number>;
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
  closingQuoteY: MotionValue<number>;
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

export const DEFAULT_CLOSING_QUOTE: ClosingQuoteInfo = {
  text: "And over all these virtues put on love, which binds them all together in perfect unity.",
  citation: "Colossians 3:14",
};
