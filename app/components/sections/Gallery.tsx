"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { alternate, useReveal, type RevealFrom } from "./useReveal";
import type { GalleryPhoto } from "../templates/types";

interface GalleryProps {
  photos: GalleryPhoto[];
}

function GalleryImage({
  src,
  alt,
  aspect,
  priority,
  from = "up",
}: GalleryPhoto & { priority?: boolean; from?: RevealFrom }) {
  const reveal = useReveal(from);

  return (
    <motion.div
      className={`relative w-full ${
        aspect === "landscape" ? "aspect-3/2" : "aspect-3/4"
      }`}
      {...reveal}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="(max-width: 500px) 45vw, 250px"
        className="object-cover"
      />
    </motion.div>
  );
}

export default function Gallery({ photos }: GalleryProps) {
  // Foto pertama tampil lebar, dua berikutnya berdampingan, sisanya menumpuk.
  // Tiap slot dijaga: tema boleh menyetor kurang dari tiga foto.
  const [top, left, right, ...rest] = photos;
  const heading = useReveal("up");

  return (
    <section
      aria-label="Our moments gallery"
      className="relative flex w-full flex-col items-center justify-center py-[15%] @container"
    >
      <motion.h2
        className="mb-[8%] text-center font-script text-[12cqw] text-[#1a1a1a] drop-shadow-sm md:text-5xl"
        {...heading}
      >
        Our Moments
      </motion.h2>

      <div className="flex w-[90%] max-w-125 flex-col gap-0.5">
        {top && <GalleryImage {...top} priority />}

        {left && right && (
          <div className="grid w-full grid-cols-2 gap-0.5">
            <GalleryImage {...left} from="left" />
            <GalleryImage {...right} from="right" />
          </div>
        )}

        {left && !right && <GalleryImage {...left} from="left" />}

        {rest.map((photo, index) => (
          <GalleryImage key={photo.src} from={alternate(index)} {...photo} />
        ))}
      </div>
    </section>
  );
}
