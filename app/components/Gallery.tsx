"use client";

import Image from "next/image";

export default function Gallery() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center py-[15%]">
      {/* Heading */}
      <h2 className="font-script text-[12cqw] md:text-5xl text-[#1a1a1a] mb-[8%] drop-shadow-sm text-center">
        Our Moments
      </h2>

      {/* Gallery Container - gap-[2px] untuk efek celah tipis */}
      <div className="flex flex-col gap-[2px] w-[90%] max-w-[500px]">
        {/* Foto 1 (Atas) - Landscape */}
        <div className="relative w-full aspect-[3/2]">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
            alt="Our Moment 1"
            fill
            className="object-cover"
          />
        </div>

        {/* Foto 2 & 3 (Tengah) - Split 2 Kolom Portrait */}
        <div className="grid grid-cols-2 gap-[2px] w-full">
          <div className="relative w-full aspect-[3/4]">
            <Image
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
              alt="Our Moment 2"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full aspect-[3/4]">
            <Image
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
              alt="Our Moment 3"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Foto 4 (Bawah) - Landscape */}
        <div className="relative w-full aspect-[3/2]">
          <Image
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80"
            alt="Our Moment 4"
            fill
            className="object-cover"
          />
        </div>

        {/* Foto 5 (Paling Bawah) - Landscape */}
        <div className="relative w-full aspect-[3/2]">
          <Image
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80"
            alt="Our Moment 5"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
