"use client";

import { useEffect, useRef } from "react";
import Story from "./Story";
import Countdown from "./Countdown";
import RsvpWishes from "./RsvpWishes";
import Gallery from "./Gallery";
import Closing from "./Closing";

interface MainSectionProps {
  onBackToStage: () => void;
}

export default function MainSection({
  onBackToStage,
}: MainSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const touchStartYRef = useRef(0);
  const isReturningRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    /**
     * Desktop / Mouse wheel
     */
    const handleWheel = (event: WheelEvent) => {
      const isAtTop = el.scrollTop <= 1;
      const isScrollingUp = event.deltaY < 0;

      if (!isAtTop || !isScrollingUp) {
        return;
      }

      if (isReturningRef.current) {
        return;
      }

      isReturningRef.current = true;

      onBackToStage();

      window.setTimeout(() => {
        isReturningRef.current = false;
      }, 700);
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

      const deltaY =
        currentY - touchStartYRef.current;

      const isAtTop = el.scrollTop <= 1;

      const isSwipingDown = deltaY > 12;

      if (!isAtTop || !isSwipingDown) {
        return;
      }

      if (isReturningRef.current) {
        return;
      }

      isReturningRef.current = true;

      onBackToStage();

      window.setTimeout(() => {
        isReturningRef.current = false;
      }, 700);
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

    return () => {
      el.removeEventListener("wheel", handleWheel);

      el.removeEventListener(
        "touchstart",
        handleTouchStart,
      );

      el.removeEventListener(
        "touchmove",
        handleTouchMove,
      );

      el.removeEventListener(
        "touchend",
        handleTouchEnd,
      );
    };
  }, [onBackToStage]);

  return (
    <div
      ref={sectionRef}
      className="pointer-events-auto relative h-full w-full overflow-y-auto overscroll-y-contain bg-white/85 backdrop-blur-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Countdown />
      <RsvpWishes />
      <Story />
      <Gallery />
      <Closing />
    </div>
  );
}