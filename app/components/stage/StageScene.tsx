"use client";

import type { PlaneMotion, SceneMotion, StageAssets } from "./Stage.types";
import StageBackgroundLayer from "./StageBackgroundLayer";
import StageCamera from "./StageCamera";
import StageCharacterLayer from "./StageCharacterLayer";
import StageForegroundLayer from "./StageForegroundLayer";

type StageSceneProps = Pick<SceneMotion, "scale" | "translateX"> &
  PlaneMotion & {
    assets: StageAssets;
    coupleNames: string;
  };

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
  canopy,
  field,
  couple,
  nearGrass,
  frontGrass,
  assets,
  coupleNames,
}: StageSceneProps) {
  return (
    <StageCamera scale={scale} translateX={translateX}>
      <StageBackgroundLayer canopy={canopy} asset={assets.canopy} />
      <StageForegroundLayer
        field={field}
        nearGrass={nearGrass}
        frontGrass={frontGrass}
        assets={assets}
      />
      <StageCharacterLayer
        couple={couple}
        asset={assets.couple}
        coupleNames={coupleNames}
      />
    </StageCamera>
  );
}
