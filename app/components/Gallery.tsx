"use client";

import Image from "next/image";

interface GalleryPhoto {
  src: string;
  alt: string;
  aspect: "landscape" | "portrait";
}

const PHOTOS: GalleryPhoto[] = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    alt: "The couple sharing a quiet moment together",
    aspect: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    alt: "Close-up portrait of the couple smiling",
    aspect: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    alt: "The couple laughing together outdoors",
    aspect: "portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    alt: "The couple walking hand in hand",
    aspect: "landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    alt: "A candid moment between the couple",
    aspect: "landscape",
  },
];

function GalleryImage({
  src,
  alt,
  aspect,
  priority,
}: GalleryPhoto & { priority?: boolean }) {
  return (
    <div
      className={`relative w-full ${
        aspect === "landscape" ? "aspect-[3/2]" : "aspect-[3/4]"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 500px) 45vw, 250px"
        className="object-cover"
      />
    </div>
  );
}

export default function Gallery() {
  const [top, left, right, ...rest] = PHOTOS;

  return (
    <section
      aria-label="Our moments gallery"
      className="relative flex w-full flex-col items-center justify-center py-[15%] [container-type:inline-size]"
    >
      <h2 className="mb-[8%] text-center font-script text-[12cqw] text-[#1a1a1a] drop-shadow-sm md:text-5xl">
        Our Moments
      </h2>

      <div className="flex w-[90%] max-w-[500px] flex-col gap-[2px]">
        <GalleryImage {...top} priority />

        <div className="grid w-full grid-cols-2 gap-[2px]">
          <GalleryImage {...left} />
          <GalleryImage {...right} />
        </div>

        {rest.map((photo) => (
          <GalleryImage key={photo.src} {...photo} />
        ))}
      </div>
    </section>
  );
}
