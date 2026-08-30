import Image from "next/image";

/**
 * Sky + tree canopy.
 *
 * Every stage layer is laid out against a fixed 500px design width, centred
 * and anchored to the stage's bottom edge, then scaled - the same model the
 * reference template uses, so the composition holds its proportions instead
 * of drifting with the viewport. Geometry values here were read off the
 * reference's own computed styles, not eyeballed.
 */
export default function StageBackgroundLayer() {
  return (
    <Image
      src="/images/sunny_bg2_ext.webp"
      alt=""
      width={1050}
      height={1280}
      sizes="900px"
      quality={95}
      priority
      aria-hidden="true"
      className="absolute bottom-0 left-1/2 z-0 w-[500px] max-w-none ml-[-250px] object-cover object-bottom"
      // Tall enough to cover the stage on long screens; 609.516px is the
      // asset's natural height at the 500px design width.
      style={{ height: "max(609.516px, 100%)", transform: "scale(1.08687)" }}
    />
  );
}
