"use client";

import Image from "next/image";

interface StoryChapter {
  title: string;
  body: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    title: "The Beginning",
    body: "Our story began like a quiet song—unexpected yet comforting. We met at just the right time, when life was still figuring itself out. What started as casual conversations turned into deep connections, shared dreams, and a sense of home in each other's presence.",
  },
  {
    title: "Growing Love",
    body: "As time passed, we grew not just as individuals, but as a team. We've celebrated wins, braved challenges, and found countless reasons to laugh along the way.",
  },
  {
    title: "A Promise for Forever",
    body: "Now, with joyful hearts and hopeful eyes, we're stepping into the next chapter. This wedding isn't just a celebration of a day—it's a celebration of a journey, a promise, and the love we're lucky enough to call our own.",
  },
];

export default function Story() {
  return (
    // px diturunkan jadi 3% agar mepet, ditambah overflow-x-hidden mencegah horizontal scroll
    <section className="relative flex w-full min-h-[100dvh] flex-col items-center justify-center px-[3%] py-[30%] overflow-x-hidden [container-type:inline-size]">
      
      {/* Container dibuat w-full agar mengisi sisa padding 3% */}
      <div className="relative w-full max-w-[500px]">
        
        {/* Wreath Atas */}
        <div className="pointer-events-none absolute -top-[12%] left-1/2 z-20 w-[115%] max-w-[550px] -translate-x-1/2 rotate-180">
          <Image
            src="/images/sunny_decor1.webp"
            alt="Floral Decor Top"
            width={800}
            height={340}
            className="w-full h-auto"
          />
        </div>

        {/* Pill/Oval berisi Foto + Teks */}
        <div className="relative overflow-hidden rounded-[999px] shadow-lg w-full">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/cover-bg.jpg"
              alt="Couple Story Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Konten Teks - padding atas-bawah disesuaikan agar proporsional */}
          <div className="relative z-10 flex flex-col items-center px-[10%] py-[25%] text-center">
            <p className="font-script text-[10cqw] md:text-5xl text-white drop-shadow-md mb-[8%]">
              Our Love Story
            </p>

            <div className="flex flex-col gap-[7%]">
              {CHAPTERS.map((chapter) => (
                <div key={chapter.title} className="mb-[6%] last:mb-0">
                  <h3 className="text-[4cqw] md:text-base font-semibold text-white drop-shadow-sm mb-[2%]">
                    {chapter.title}
                  </h3>
                  <p className="text-[3cqw] md:text-sm leading-relaxed text-white/95 drop-shadow-sm mx-auto max-w-[95%]">
                    {chapter.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wreath Bawah */}
        <div className="pointer-events-none absolute -bottom-[12%] left-1/2 z-20 w-[115%] max-w-[550px] -translate-x-1/2">
          <Image
            src="/images/sunny_decor1.webp"
            alt="Floral Decor Bottom"
            width={800}
            height={340}
            className="w-full h-auto rotate-[360deg]"
          />
        </div>
      </div>

      {/* Swipe up text */}
      <div className="mt-[10%]">
        <span className="text-[3cqw] md:text-xs font-medium text-[#2a2a2a]/60 animate-bounce block">
          Swipe up
        </span>
      </div>
    </section>
  );
}