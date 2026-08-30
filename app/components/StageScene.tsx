"use client";

import type { PlaneMotion, SceneMotion } from "./Stage.types";
import StageBackgroundLayer from "./StageBackgroundLayer";
import StageCamera from "./StageCamera";
import StageCharacterLayer from "./StageCharacterLayer";
import StageForegroundLayer from "./StageForegroundLayer";

type StageSceneProps = Pick<SceneMotion, "scale" | "translateX" | "translateY"> &
  PlaneMotion;

/**
 * The camera moves the whole scene; each layer then carries its own plane
 * transform on top of it, which is what turns a flat zoom into a dolly. Layer
 * order is set by the z-index on each plane wrapper, not by DOM order - a
 * wrapper is a stacking context, so the z-index that used to live on the
 * <img> could not have reached across the other planes.
 */
export default function StageScene({
  scale,
  translateX,
  translateY,
  canopy,
  field,
  couple,
  nearGrass,
  frontGrass,
}: StageSceneProps) {
  return (
    <StageCamera scale={scale} translateX={translateX} translateY={translateY}>
      <StageBackgroundLayer canopy={canopy} />
      <StageForegroundLayer
        field={field}
        nearGrass={nearGrass}
        frontGrass={frontGrass}
      />
      <StageCharacterLayer couple={couple} />
    </StageCamera>
  );
}
