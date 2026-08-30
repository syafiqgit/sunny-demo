"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { alternate, useReveal } from "@/app/hooks/useReveal";
import type { SizedImage, StoryChapter } from "@/app/lib/content";

type StoryProps = {
  title: string;
  chapters: StoryChapter[];
  backgroundImage: string;
  /** Karangan bunga atas & bawah - yang atas diputar 180 derajat. */
  wreathImage: SizedImage;
};

function ChapterItem({ title, body, index }: StoryChapter & { index: number }) {
  const reveal = useReveal(alternate(index));

  return (
    <motion.article className="mb-[6%] last:mb-0" {...reveal}>
      <h3 className="mb-[2%] text-[4cqw] font-semibold text-white drop-shadow-sm md:text-base">
        {title}
      </h3>
      <p className="mx-auto max-w-[95%] text-[3cqw] leading-relaxed text-white/95 drop-shadow-sm md:text-sm">
        {body}
      </p>
    </motion.article>
  );
}

export default function Story({
  title,
  chapters,
  backgroundImage,
  wreathImage,
}: StoryProps) {
  const titleReveal = useReveal("up");

  return (
    <section
      aria-label="Our love story"
      className="relative flex w-full min-h-dvh flex-col items-center justify-center overflow-x-hidden px-[3%] py-[30%] @container"
    >
      <div className="relative w-full max-w-125">
        {/* Wreath Atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-12%] left-1/2 z-20 w-[115%] max-w-137.5 -translate-x-1/2 rotate-180 select-none"
        >
          <Image
            src={wreathImage.src}
            alt=""
            width={wreathImage.width}
            height={wreathImage.height}
            sizes="(max-width: 500px) 115vw, 575px"
            className="h-auto w-full"
          />
        </div>

        {/* Pill/Oval berisi Foto + Teks */}
        <div className="relative w-full overflow-hidden rounded-[999px] shadow-lg">
          <div className="absolute inset-0 -z-10">
            <Image
              src={backgroundImage}
              alt="Couple photo background"
              fill
              sizes="(max-width: 500px) 100vw, 500px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </div>

          <div className="relative z-10 flex flex-col items-center px-[10%] py-[25%] text-center">
            <motion.p
              className="mb-[8%] font-script text-[10cqw] text-white drop-shadow-md md:text-5xl"
              {...titleReveal}
            >
              {title}
            </motion.p>

            <div className="flex flex-col gap-[7%]">
              {chapters.map((chapter, index) => (
                <ChapterItem key={chapter.title} index={index} {...chapter} />
              ))}
            </div>
          </div>
        </div>

        {/* Wreath Bawah */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-12%] left-1/2 z-20 w-[115%] max-w-137.5 -translate-x-1/2 select-none"
        >
          <Image
            src={wreathImage.src}
            alt=""
            width={wreathImage.width}
            height={wreathImage.height}
            sizes="(max-width: 500px) 115vw, 575px"
            className="h-auto w-full"
          />
        </div>
      </div>

      <span
        aria-hidden="true"
        className="mt-[10%] block animate-bounce motion-reduce:animate-none text-[3cqw] font-medium text-[#2a2a2a]/60 md:text-xs"
      >
        Swipe up
      </span>
    </section>
  );
}
