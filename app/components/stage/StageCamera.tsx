"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SceneMotion } from "./Stage.types";

type StageCameraProps = Pick<SceneMotion, "scale" | "translateX"> & {
  children: ReactNode;
};

export default function StageCamera({
  scale,
  translateX,
  children,
}: StageCameraProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#7bbff1]">
      <motion.div
        className="relative w-full h-full"
        style={{
          scale,
          x: translateX,
          // Ubah dari 60.6% menjadi 45% - 50% agar center point naik ke area dada/wajah
          // Ini mencegah frame "tenggelam" ke arah perut saat zoom ekstrem
          transformOrigin: "50% 48%",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
