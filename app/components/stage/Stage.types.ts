import type { MotionValue } from "framer-motion";

export interface PersonInfo {
  scriptName: string;
  fullName: string;
  parentsLine1: string;
  parentsLine2: string;
  instagramHandle: string;
}

export type GroomInfo = PersonInfo;
export type BrideInfo = PersonInfo;

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
  title: string;
  description: string;
  colors: ColorSwatch[];
}

export interface QuoteInfo {
  text: string;
  citation?: string;
}

/** Alias historis - dipakai untuk kutipan pembuka maupun penutup. */
export type ClosingQuoteInfo = QuoteInfo;

/**
 * Gambar yang dirender tanpa `fill`, jadi ukuran alaminya ikut dibawa supaya
 * next/image bisa memesan ruangnya dan tidak ada layout shift.
 */
export interface SizedImage {
  src: string;
  width: number;
  height: number;
}

/**
 * Artwork panggung, jauh ke dekat.
 *
 * PENTING untuk tema baru: hanya `src` (dan ukuran alaminya) yang tinggal
 * diganti. Transform yang memasang tiap lapis pada tempatnya - skala, geseran,
 * dan tinggi minimumnya - hidup di komponen lapisannya masing-masing dan
 * diukur terhadap komposisi artwork "sunny". Artwork baru harus digambar pada
 * spesifikasi yang sama (lebar desain 500px, ditambatkan ke tepi bawah
 * panggung, horizon dan garis bunga pada ketinggian yang sama) atau angka-
 * angka itu perlu diukur ulang. Lihat catatan di tiap komponen Stage*Layer.
 */
export interface StageAssets {
  /** Langit + tajuk pohon - bidang terjauh. */
  canopy: SizedImage;
  /** Hamparan bunga tempat pasangan berdiri. */
  field: SizedImage;
  /** Rumpun bunga tengah, digambar di depan pasangan. */
  nearGrass: SizedImage;
  /** Rumpun bunga terdepan. */
  frontGrass: SizedImage;
  /** Potongan gambar pasangan. */
  couple: SizedImage;
  /** Awan di belakang kutipan pembuka (dirender dengan `fill`). */
  quoteCloud: string;
  /** Sapuan kabut di balik detail acara (dirender dengan `fill`). */
  eventWash: string;
}

/** Seluruh isi panggung untuk satu tema. */
export interface StageContent {
  groom: GroomInfo;
  bride: BrideInfo;
  matrimony: EventDetail;
  reception: EventDetail;
  dressCode: DressCodeInfo;
  openingQuote: QuoteInfo;
  closingQuote: QuoteInfo;
  streamingUrl?: string;
  assets: StageAssets;
}

export interface StageProps extends StageContent {
  revealProgress?: number;
  /** Nama pasangan - hanya dipakai untuk alt text potongan gambar. */
  coupleNames: string;
}

export interface SceneMotion {
  scale: MotionValue<number>;
  translateX: MotionValue<string>;
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
