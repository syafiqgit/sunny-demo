"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Scroll-triggered reveal for the blocks inside MainSection.
 *
 * Taken from the reference invitation: each block arrives with a short slide
 * and a fade as it scrolls into view, and consecutive blocks lean in from
 * alternating sides. The offsets were read off the recording - its headings
 * sat ~8% of the canvas width off-centre mid-flight, which is the 40px below
 * against this project's 500px design width.
 *
 * This is a hook returning props to spread onto a `motion.*` element rather
 * than a wrapper component: most of these blocks sit in flex and grid flows
 * where an extra div would change the layout.
 */
export type RevealFrom = "left" | "right" | "up";

const SLIDE_X = 40;
const SLIDE_Y = 24;
// Only the two transformed properties are animated, and both are handed
// straight to the compositor - no layout, no paint, per frame.
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function useReveal(from: RevealFrom = "up", delay = 0) {
  const reduced = useReducedMotion();

  // Memoised so a parent that re-renders often (the RSVP form re-renders on
  // every keystroke) hands Framer the same prop objects instead of fresh ones
  // it has to diff.
  return useMemo(() => {
    const x = reduced || from === "up" ? 0 : from === "left" ? -SLIDE_X : SLIDE_X;
    const y = reduced || from !== "up" ? 0 : SLIDE_Y;

    return {
      initial: { opacity: reduced ? 1 : 0, x, y },
      whileInView: { opacity: 1, x: 0, y: 0 },
      // `once`, because these are an arrival - replaying them every time a
      // block scrolls back past would draw attention to itself.
      viewport: { once: true, amount: 0.3 },
      transition: {
        duration: reduced ? 0 : 0.7,
        delay: reduced ? 0 : delay,
        ease: EASE,
      },
    };
  }, [from, delay, reduced]);
}

/** The alternating side a list of sibling blocks leans in from. */
export function alternate(index: number): RevealFrom {
  return index % 2 === 0 ? "left" : "right";
}
