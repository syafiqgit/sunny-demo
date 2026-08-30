"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PlaneMotion } from "./Stage.types";
import type { SizedImage } from "@/app/lib/content";

type StageBackgroundLayerProps = Pick<PlaneMotion, "canopy"> & {
  asset: SizedImage;
};

/**
 * Sky + tree canopy - the far plane of the dolly zoom.
 *
 * Every stage layer is laid out against a fixed 500px design width, centred
 * and anchored to the stage's bottom edge, then scaled - the same model the
 * reference template uses, so the composition holds its proportions instead
 * of drifting with the viewport. Geometry values here were read off the
 * reference's own computed styles, not eyeballed.
 *
 * The wrapper all but cancels the camera's push-in, so the trees hold the
 * height they have at rest and the couple rises past them into the sky. That
 * leaves the canopy far narrower than it used to be at full zoom, so it can
 * no longer ride the camera's full pan without showing its own edge - the x
 * walks it back the way a distant plane should move anyway.
 */
export default function StageBackgroundLayer({
  canopy,
  asset,
}: StageBackgroundLayerProps) {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      style={{
        scale: canopy.scale,
        x: canopy.x,
        y: canopy.y,
        transformOrigin: "50% 48%",
      }}
      aria-hidden="true"
    >
      <Image
        src={asset.src}
        alt=""
        width={asset.width}
        height={asset.height}
        sizes="900px"
        quality={95}
        priority
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 w-[500px] max-w-none ml-[-250px] object-cover object-bottom"
        // Tall enough to cover the stage on long screens; 609.516px is the
        // asset's natural height at the 500px design width.
        style={{ height: "max(609.516px, 100%)", transform: "scale(1.08687)" }}
      />
    </motion.div>
  );
}
