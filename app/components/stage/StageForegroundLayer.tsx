"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PlaneMotion } from "./Stage.types";
import type { StageAssets } from "@/app/lib/content";

type StageForegroundLayerProps = Pick<
  PlaneMotion,
  "field" | "nearGrass" | "frontGrass"
> & {
  assets: Pick<StageAssets, "field" | "nearGrass" | "frontGrass">;
};

/**
 * The three flower bands, back to front: the mid field the couple stands in,
 * then two foreground clumps drawn over them.
 *
 * All three share the 500px design width, sit on the stage's bottom edge and
 * are scaled well past it - that heavy overlap is what buries the stalks. The
 * scales and the sideways nudges are the reference template's own computed
 * values. The translateX sits inside scale() so it scales with the layer,
 * matching how the reference composes its matrix.
 *
 * Each band then rides its own dolly plane. They grow faster than the canopy
 * and, because the push-in throws everything below the camera's origin
 * downward, each also carries a shift that pulls it back up the frame - that
 * is what keeps the two front bands in front of the couple, crossing them
 * above the knee, instead of sinking out of shot as the camera arrives.
 */
export default function StageForegroundLayer({
  field,
  nearGrass,
  frontGrass,
  assets,
}: StageForegroundLayerProps) {
  return (
    <>
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          scale: field.scale,
          y: field.y,
          transformOrigin: "50% 48%",
        }}
        aria-hidden="true"
      >
        <Image
          src={assets.field.src}
          alt=""
          width={assets.field.width}
          height={assets.field.height}
          sizes="1150px"
          quality={95}
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 w-[500px] max-w-none ml-[-250px] h-auto"
          style={{ transform: "translateY(8.03px) scale(1.36293)" }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          scale: nearGrass.scale,
          y: nearGrass.y,
          transformOrigin: "50% 48%",
        }}
        aria-hidden="true"
      >
        <Image
          src={assets.nearGrass.src}
          alt=""
          width={assets.nearGrass.width}
          height={assets.nearGrass.height}
          sizes="1600px"
          quality={95}
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 w-[500px] max-w-none ml-[-250px] h-auto"
          style={{
            transform: "translateY(-1.31px) scale(1.89749) translateX(139.08px)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          scale: frontGrass.scale,
          y: frontGrass.y,
          transformOrigin: "50% 48%",
        }}
        aria-hidden="true"
      >
        <Image
          src={assets.frontGrass.src}
          alt=""
          width={assets.frontGrass.width}
          height={assets.frontGrass.height}
          sizes="1750px"
          quality={95}
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 w-[500px] max-w-none ml-[-250px] h-auto"
          style={{
            transform: "translateY(8.03px) scale(2.06467) translateX(100.06px)",
          }}
        />
      </motion.div>
    </>
  );
}
