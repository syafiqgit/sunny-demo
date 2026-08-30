"use client";

import { useEffect, type RefObject } from "react";

// Small enough to catch a single mouse notch, large enough to ignore the
// sub-pixel deltas a trackpad emits while a finger is merely resting.
const WHEEL_THRESHOLD = 4;
const TOUCH_THRESHOLD = 12;

interface ChapterScrollOptions {
  /** The element the gestures are read from. */
  targetRef: RefObject<HTMLElement | null>;
  /**
   * Read on every event rather than captured, so docking and undocking never
   * has to re-bind the listeners - re-binding a non-passive wheel listener
   * mid-gesture is what used to drop the first tick after opening.
   */
  activeRef: RefObject<boolean>;
  onForward: () => void;
  onBackward: () => void;
}

/**
 * While docked at the stage, wheel and touch input drives the story one beat
 * at a time instead of scrolling the container. Native scroll is left alone
 * everywhere else (cover entrance, the MainSection boundary, MainSection's own
 * free scroll), so nothing here ever fights CSS snap.
 */
export function useChapterScroll({
  targetRef,
  activeRef,
  onForward,
  onBackward,
}: ChapterScrollOptions) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let touchStartY = 0;

    const step = (forward: boolean) => (forward ? onForward() : onBackward());

    const handleWheel = (event: WheelEvent) => {
      if (!activeRef.current) return;
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      event.preventDefault();
      step(event.deltaY > 0);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!activeRef.current) return;

      // Swallowed either way: the container must not scroll while docked,
      // whether or not this particular move clears the threshold.
      event.preventDefault();

      const currentY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - currentY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      step(deltaY > 0);
      touchStartY = currentY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [targetRef, activeRef, onForward, onBackward]);
}
