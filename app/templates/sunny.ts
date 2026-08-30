import type { TemplateConfig } from "@/app/lib/content";

/**
 * Tema "Sunny" - ladang bunga, panggung parallax, palet hangat.
 *
 * Semua yang dulu jadi konstanta di dalam komponen sekarang ada di sini.
 * Tema berikutnya cukup menyalin berkas ini, mengganti nilainya, lalu
 * mendaftarkannya di `index.ts`.
 */
export const sunny: TemplateConfig = {
  slug: "sunny",
  name: "Sunny",
  tagline: "Wedding - Outdoor - Cinematic",
  cardImage: "/images/sunny/sunny-demo.png",

  coupleNames: "Vincent & Natasha",
  weddingDate: "Saturday, April 25, 2026",
  countdownTarget: "2027-01-01T00:00:00+07:00",

  musicSrc: "/audios/michael-buble-love.mp3",
  coverImage: "/images/sunny/cover-bg.jpg",

  stage: {
    groom: {
      scriptName: "Vincent",
      fullName: "Vincent Raphael",
      parentsLine1: "Mr. Vincent's Father &",
      parentsLine2: "Mrs. Vincent's Mother",
      instagramHandle: "vincent",
    },
    bride: {
      scriptName: "Natasha",
      fullName: "Natasha Aurelia",
      parentsLine1: "Mr. Natasha's Father &",
      parentsLine2: "Mrs. Natasha's Mother",
      instagramHandle: "natasha",
    },
    matrimony: {
      title: "Holy Matrimony",
      date: "Saturday, April 25, 2026",
      time: "13.00 - 14.00 WIB",
      venue: "Plaza Rafaela Garden",
      address: "Jl. Suryalaya Indah, Buah Batu, Bandung",
      mapsUrl: "https://maps.google.com",
    },
    reception: {
      title: "Reception",
      date: "Saturday, April 25, 2026",
      time: "14.00 - 17.00 WIB",
      venue: "Plaza Rafaela Garden",
      address: "Jl. Suryalaya Indah, Buah Batu, Bandung",
      mapsUrl: "https://maps.google.com",
    },
    dressCode: {
      title: "Dresscode",
      description:
        "We would love for our guests to wear these colors on our special day.",
      // Read off the reference; the swatches carry no visible labels, so the
      // names only key the list.
      colors: [
        { name: "Warm Sand", hex: "#A98D76" },
        { name: "White", hex: "#FFFFFF" },
      ],
    },
    openingQuote: {
      text: "So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
      citation: "Matthew 19:6",
    },
    closingQuote: {
      text: "And over all these virtues put on love, which binds them all together in perfect unity.",
      citation: "Colossians 3:14",
    },
    streamingUrl: "#",

    assets: {
      canopy: {
        src: "/images/sunny/sunny_bg2_ext.webp",
        width: 1050,
        height: 1280,
      },
      field: {
        src: "/images/sunny/sunny_bg1_ext.webp",
        width: 1500,
        height: 708,
      },
      nearGrass: {
        src: "/images/sunny/sunny_fg2_ext.webp",
        width: 1500,
        height: 568,
      },
      frontGrass: {
        src: "/images/sunny/sunny_fg1_ext.webp",
        width: 1500,
        height: 568,
      },
      couple: {
        src: "/images/sunny/inv_787_BSoyubpg.jpg",
        width: 1500,
        height: 1500,
      },
      quoteCloud: "/images/sunny/cloud3_80_min.png",
      eventWash: "/images/sunny/cloud4_90.webp",
    },
  },

  countdown: {
    decorImage: {
      src: "/images/sunny/sunny_decor2.webp",
      width: 600,
      height: 900,
    },
  },

  story: {
    title: "Our Love Story",
    chapters: [
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
    ],
    backgroundImage: "/images/sunny/cover-bg.jpg",
    wreathImage: {
      src: "/images/sunny/sunny_decor1.webp",
      width: 800,
      height: 340,
    },
  },

  gallery: [
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
  ],

  gift: {
    heading: "Wedding Gift",
    body: "We are so grateful for your love and support, any gift you share means the world to us.",
    buttonLabel: "SEND GIFT",
    url: "#",
    decorImage: "/images/sunny/sunny_decor3.webp",
  },

  closing: {
    portraitImage: "/images/sunny/cover-bg.jpg",
    scriptLine1: "Vincent and",
    scriptLine2: "Natasha",
    farewell:
      "We cannot wait to share this special moment with you. Your presence will make our day even more meaningful.",
  },

  wishes: [
    {
      id: "seed-1",
      name: "R",
      message:
        "Congrats buat pasangan baru semoga semuanya berjalan dengan lancar!",
      createdAt: "2026-05-30T14:00:00Z",
    },
    {
      id: "seed-2",
      name: "Nayla",
      message: "Happy Wedding",
      createdAt: "2026-04-12T09:00:00Z",
    },
    {
      id: "seed-3",
      name: "Lauren",
      message: "Congrats!",
      createdAt: "2026-01-25T17:00:00Z",
    },
    {
      id: "seed-4",
      name: "Chelsea",
      message: "Happy wedding ❤️",
      createdAt: "2026-01-02T08:00:00Z",
    },
  ],
};
