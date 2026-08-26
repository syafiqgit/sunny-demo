"use client";

import Story from "./Story";
import Countdown from "./Countdown";
import RsvpWishes from "./RsvpWishes";
import Gallery from "./Gallery";
import Closing from "./Closing";

export default function MainSection() {
  return (
    <div className="pointer-events-auto relative w-full h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Countdown />
      <RsvpWishes />
      <Story />
      <Gallery />
      <Closing />
    </div>
  );
}
