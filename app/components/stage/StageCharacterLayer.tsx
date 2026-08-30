"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PlaneMotion } from "./Stage.types";
import type { SizedImage } from "@/app/lib/content";

type StageCharacterLayerProps = Pick<PlaneMotion, "couple"> & {
  asset: SizedImage;
  /** Nama pasangan - hanya dipakai untuk alt text. */
  coupleNames: string;
};

/**
 * The couple cut-out, between the mid field and the foreground flowers.
 *
 * Same 500px design width as every other layer. The 50px bottom inset and the
 * 70px nudge are the reference template's own values; the nudge sits outside
 * scale() so it stays a flat 70px rather than scaling with the figure.
 *
 * The plane grows them past the field they stand in and lifts them until the
 * head clears the tree line, which puts their feet on the frame's bottom edge
 * and their knees behind the front flower bands.
 */
export default function StageCharacterLayer({
  couple,
  asset,
  coupleNames,
}: StageCharacterLayerProps) {
  return (
    <motion.div
      className="absolute inset-0 z-20 pointer-events-none"
      style={{
        scale: couple.scale,
        y: couple.y,
        opacity: couple.opacity,
        transformOrigin: "50% 48%",
      }}
    >
      <Image
        src={asset.src}
        alt={`Ilustrasi ${coupleNames}`}
        width={asset.width}
        height={asset.height}
        sizes="560px"
        quality={100}
        priority
        className="absolute bottom-[50px] left-1/2 w-[500px] max-w-none ml-[-250px] h-auto"
        style={{ transform: "translateY(70px) scale(0.662935)" }}
      />
    </motion.div>
  );
}
