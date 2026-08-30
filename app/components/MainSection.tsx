"use client";

import { useEffect, useRef, memo } from "react";
import Story from "./Story";
import Countdown from "./Countdown";
import RsvpWishes from "./RsvpWishes";
import Gallery from "./Gallery";
import Closing from "./Closing";

interface MainSectionProps {
  onBackToStage: () => void;
}

function MainSection({ onBackToStage }: MainSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const touchStartYRef = useRef(0);
  const isReturningRef = useRef(false);
  const returnTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    const requestStageReturn = () => {
      if (isReturningRef.current) return;

      isReturningRef.current = true;
      onBackToStage();
      returnTimerRef.current = window.setTimeout(() => {
        isReturningRef.current = false;
        returnTimerRef.current = null;
      }, 700);
    };

    /**
     * Desktop / Mouse wheel
     */
    const handleWheel = (event: WheelEvent) => {
      const isAtTop = el.scrollTop <= 1;
      const isScrollingUp = event.deltaY < 0;

      if (!isAtTop || !isScrollingUp) {
        return;
      }

      requestStageReturn();
    };

    /**
     * Mobile / Touch start
     */
    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    /**
     * Mobile / Swipe
     *
     * Finger bergerak ke bawah =
     * user sedang ingin scroll ke atas.
     */
    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;

      const deltaY = currentY - touchStartYRef.current;

      const isAtTop = el.scrollTop <= 1;

      const isSwipingDown = deltaY > 12;

      if (!isAtTop || !isSwipingDown) {
        return;
      }

      requestStageReturn();
    };

    /**
     * Reset posisi gesture
     */
    const handleTouchEnd = () => {
      touchStartYRef.current = 0;
    };

    /**
     * Native listener sengaja digunakan.
     * Tidak memakai preventDefault(), sehingga
     * tidak menimbulkan error passive listener.
     */
    el.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    el.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    el.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    el.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    el.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    });

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
      className="pointer-events-auto relative isolate h-full min-h-0 w-full touch-pan-y overflow-y-auto overscroll-y-contain bg-white/85 backdrop-blur-[2px] scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <Countdown />
      <RsvpWishes />
      <Story />
      <Gallery />
      <Closing />
    </div>
  );
}

// Memoised: the page re-renders on every scroll frame to drive the cover
// fade, and without this that reconciles this whole subtree each time - which
// is what put 60-100ms frames in the middle of the hand-off.
export default memo(MainSection);
