"use client";

import type { RefObject } from "react";
import { useWheel } from "@use-gesture/react";

interface WheelScrubOptions {
  /** The scroller the gesture is read from and driven. */
  targetRef: RefObject<HTMLElement | null>;
  /**
   * Read on every event rather than captured, so nothing has to re-bind: no
   * wheel may reach the story before the reader has opened the invitation.
   * (`overflow: hidden` stops the browser scrolling the container, but not
   * this - a scroller is still scrollable from script while hidden.)
   */
  enabledRef: RefObject<boolean>;
  sectionCount: number;
}

/** Captured once per gesture, so the whole gesture is measured from one mark. */
interface ScrubMemo {
  top: number;
  snap: string;
  behavior: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Wheel and trackpad: scrub while the gesture runs, land on a beat when it
 * ends.
 *
 * Touch is deliberately absent. A finger already scrolls the container
 * natively - on the compositor thread, with the platform's own momentum and
 * CSS snap - and the camera tracks it because the scroll position *is* the
 * story position. Taking that over from script would trade a free, smooth
 * gesture for a worse one on the devices that matter most here.
 *
 * A wheel gets none of that for free. Its notches are ~100px against a
 * viewport-tall section, far under the distance `snap-mandatory` wants before
 * it will move to the next snap point, so left alone every notch nudges the
 * scene and is pulled straight back - measured: a 120px notch moved the story
 * exactly nowhere.
 *
 * So the gesture is driven here instead, and what @use-gesture supplies is the
 * shape of it. `movement` accumulates the whole gesture from its first event,
 * and `last` marks the end - a 140ms debounce after the wheel goes quiet,
 * because a wheel has no end event of its own. That is the pair the hand-
 * rolled version could not have: it had to guess a lock long enough to
 * swallow the tail of a trackpad swipe (450ms), which also meant a trackpad
 * could only ever move one beat per swipe, however far it was pushed.
 *
 * Now a mouse notch is a short gesture that commits one beat, and a trackpad
 * swipe scrubs the camera 1:1 under the fingers for as far as it travels -
 * the same continuous move touch has always had.
 */
export function useWheelScrub({
  targetRef,
  enabledRef,
  sectionCount,
}: WheelScrubOptions) {
  useWheel(
    ({ event, first, last, movement: [, my], memo }) => {
      const el = targetRef.current;
      if (!el || !enabledRef.current) return;

      const height = el.clientHeight;
      if (height === 0) return;

      // Every real wheel event, but not the synthetic end: by then the
      // browser has long finished with it.
      if (!last) event.preventDefault();

      let scrub = memo as ScrubMemo | undefined;
      if (first || !scrub) {
        scrub = {
          top: el.scrollTop,
          snap: el.style.scrollSnapType,
          behavior: el.style.scrollBehavior,
        };
        // Both are the container's resting behaviour and both fight a scrub:
        // mandatory snap drags every intermediate position back to a beat,
        // and `scroll-smooth` would animate towards each frame's target
        // instead of arriving at it. Restored on `last`, and touch never
        // comes through here, so its own snap is untouched.
        el.style.scrollSnapType = "none";
        el.style.scrollBehavior = "auto";
      }

      const maxTop = (sectionCount - 1) * height;
      const scrubbedTop = clamp(scrub.top + my, 0, maxTop);

      if (!last) {
        el.scrollTop = scrubbedTop;
        return scrub;
      }

      // Landing. Nearest beat, but never the one the gesture started on: a
      // mouse notch is only ~15% of a section and would round straight back
      // to where it came from, which is the whole failure this hook exists
      // to avoid. A longer swipe rounds honestly and can cross several.
      const from = Math.round(scrub.top / height);
      const nearest = Math.round(scrubbedTop / height);
      const target =
        my > 0
          ? Math.max(nearest, from + 1)
          : my < 0
            ? Math.min(nearest, from - 1)
            : nearest;

      // Instant, and exactly on a snap point, so restoring snap below cannot
      // jolt it. Nothing is lost by not animating the scroll: the camera
      // spring is what the reader actually sees move, and it glides the
      // remaining distance on its own.
      el.scrollTop = clamp(target, 0, sectionCount - 1) * height;
      el.style.scrollSnapType = scrub.snap;
      el.style.scrollBehavior = scrub.behavior;
      return undefined;
    },
    { target: targetRef, eventOptions: { passive: false } },
  );
}
