"use client";

import { useEffect, useRef, memo } from "react";
import Story from "./Story";
import Countdown from "./Countdown";
import RsvpWishes from "./RsvpWishes";
import Gallery from "./Gallery";
import Closing from "./Closing";
import type { TemplateConfig } from "@/app/lib/content";

interface MainSectionProps {
  template: TemplateConfig;
  onBackToStage: () => void;
}

// Long enough to cover the panel's own slide back down (MAIN_SECTION_ENTER_MS
// in page.tsx), so the tail of one gesture cannot ask for the stage twice.
const RETURN_LOCK_MS = 700;
// The same deadbands the stage dock uses, so pulling back out of MainSection
// takes as deliberate a gesture as moving between beats does - a trackpad's
// idle jitter must not fling the reader out of the panel.
const WHEEL_THRESHOLD = 4;
const TOUCH_THRESHOLD = 12;

function MainSection({ template, onBackToStage }: MainSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isReturningRef = useRef(false);
  const returnTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let touchStartY = 0;

    const requestStageReturn = () => {
      if (isReturningRef.current) return;

      isReturningRef.current = true;
      onBackToStage();
      returnTimerRef.current = window.setTimeout(() => {
        isReturningRef.current = false;
        returnTimerRef.current = null;
      }, RETURN_LOCK_MS);
    };

    // Only from the very top, and only travelling upward: anywhere else this
    // is an ordinary scroll and must be left entirely alone.
    const atTop = () => el.scrollTop <= 1;

    const handleWheel = (event: WheelEvent) => {
      if (!atTop() || event.deltaY > -WHEEL_THRESHOLD) return;
      requestStageReturn();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    // Finger travelling down = the reader is pulling the page back up.
    const handleTouchMove = (event: TouchEvent) => {
      if (!atTop()) return;

      const currentY = event.touches[0]?.clientY ?? 0;
      if (currentY - touchStartY < TOUCH_THRESHOLD) return;

      requestStageReturn();
    };

    const handleTouchEnd = () => {
      touchStartY = 0;
    };

    // All passive: nothing here calls preventDefault, so the browser can keep
    // scrolling on the compositor thread instead of waiting on these handlers.
    const options = { passive: true } as const;
    el.addEventListener("wheel", handleWheel, options);
    el.addEventListener("touchstart", handleTouchStart, options);
    el.addEventListener("touchmove", handleTouchMove, options);
    el.addEventListener("touchend", handleTouchEnd, options);
    el.addEventListener("touchcancel", handleTouchEnd, options);

    return () => {
      if (returnTimerRef.current !== null) {
        window.clearTimeout(returnTimerRef.current);
        returnTimerRef.current = null;
      }
      isReturningRef.current = false;

      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [onBackToStage]);

  return (
    <div
      ref={sectionRef}
      className="scrollbar-none pointer-events-auto relative isolate h-full min-h-0 w-full touch-pan-y overflow-y-auto overscroll-y-contain bg-white/85 backdrop-blur-[2px]"
    >
      <Countdown
        targetIso={template.countdownTarget}
        decorImage={template.countdown.decorImage}
      />
      <RsvpWishes seedWishes={template.wishes} />
      <Story {...template.story} />
      <Gallery photos={template.gallery} />
      <Closing
        coupleNames={template.coupleNames}
        gift={template.gift}
        closing={template.closing}
      />
    </div>
  );
}

// Memoised: the page re-renders whenever a scroll threshold flips, and without
// this that reconciles this whole subtree each time - which is what put
// 60-100ms frames in the middle of the hand-off.
export default memo(MainSection);
