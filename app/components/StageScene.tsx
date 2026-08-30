"use client";

import type { SceneMotion } from "./Stage.types";
import StageBackgroundLayer from "./StageBackgroundLayer";
import StageCamera from "./StageCamera";
import StageCharacterLayer from "./StageCharacterLayer";
import StageForegroundLayer from "./StageForegroundLayer";

type StageSceneProps = Pick<
  SceneMotion,
  "scale" | "translateX" | "translateY"
>;

export default function StageScene({
  scale,
  translateX,
  translateY,
}: StageSceneProps) {
  return (
    <StageCamera scale={scale} translateX={translateX} translateY={translateY}>
      <StageBackgroundLayer />
      <StageForegroundLayer />
      <StageCharacterLayer />
    </StageCamera>
  );
}
