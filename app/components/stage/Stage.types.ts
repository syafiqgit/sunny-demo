import type { MotionValue } from "framer-motion";
import type { StageContent } from "@/app/lib/content";

/**
 * Tipe gerak panggung - murni urusan presentasi.
 *
 * Kontrak isinya (siapa yang menikah, acara apa, aset mana) ada di
 * `lib/content.ts`; berkas ini hanya menyusunnya jadi props komponen.
 */

export interface StageProps extends StageContent {
  /**
   * The 0..1.2 story position, written by the scroller. A MotionValue rather
   * than a number so the whole camera can be driven from a scroll handler
   * without re-rendering the tree once per frame.
   */
  revealProgress?: MotionValue<number>;
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
