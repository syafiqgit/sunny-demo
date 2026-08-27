"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SceneMotion } from "./Stage.types";

type StageCameraProps = Pick<
  SceneMotion,
  "scale" | "translateX" | "translateY"
> & {
  children: ReactNode;
};

export default function StageCamera({
  scale,
  translateX,
  translateY,
  children,
}: StageCameraProps) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full aspect-3/4 bg-[#7bbff1] overflow-hidden will-change-transform"
      style={{
        x: "-50%",
        y: "-50%",
        scale,
        translateX,
        translateY,
        transformOrigin: "50% 45%",
      }}
    >
      {children}
    </motion.div>
  );
}
