"use client";

import { motion } from "framer-motion";
import type { SceneMotion } from "./Stage.types";
import StageBackgroundLayer from "./StageBackgroundLayer";
import StageCamera from "./StageCamera";
import StageCharacterLayer from "./StageCharacterLayer";
import StageForegroundLayer from "./StageForegroundLayer";

interface StageSceneProps extends SceneMotion {}

export default function StageScene({
  scale,
  translateX,
  translateY,
  scrimOpacity,
}: StageSceneProps) {
  return (
    <StageCamera scale={scale} translateX={translateX} translateY={translateY}>
      <StageBackgroundLayer />
      <StageForegroundLayer />
      <StageCharacterLayer />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[65%] z-45 bg-linear-to-t from-[#fcf9f2] via-[#fcf9f2]/80 to-transparent pointer-events-none"
        style={{ opacity: scrimOpacity }}
        aria-hidden="true"
      />
    </StageCamera>
  );
}
