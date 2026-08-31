import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarHeart,
  Images,
  Mail,
  MessageCircleHeart,
  Music,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { TEMPLATES } from "@/app/templates";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/app/lib/site";

// Tema unggulan untuk tombol "Lihat Contoh Undangan" di hero. Diambil dari
// registry, bukan slug yang ditulis tangan, supaya tautannya tidak bisa
// menunjuk ke tema yang sudah diganti nama.
const FEATURED = TEMPLATES[0];

// Next mengganti seluruh objek `openGraph` milik layout, bukan menggabung
// per-field, jadi judul dan deskripsinya diulang di sini - dari konstanta yang
// sama, supaya tidak bisa berbeda. Yang ditambahkan cuma gambarnya.
export const metadata: Metadata = {
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: FEATURED.cardImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [FEATURED.cardImage],
  },
};

const FEATURES = [
  {
    icon: Smartphone,
    title: "Dibuka di mana saja",
    body: "Cukup satu tautan. Terbuka rapi di ponsel tamu, tanpa perlu memasang aplikasi apa pun.",
  },
  {
    icon: Music,
    title: "Musik latar",
    body: "Lagu pilihan mulai berputar saat undangan dibuka, dan tamu tetap bisa mematikannya kapan saja.",
  },
  {
    icon: CalendarHeart,
    title: "Hitung mundur acara",
    body: "Tanggal, lokasi, dan hitung mundur menuju hari H tampil jelas di satu halaman.",
  },
  {
    icon: Images,
    title: "Galeri & cerita",
    body: "Ceritakan perjalanan kalian lewat rangkaian foto dan babak cerita yang bergulir mulus.",
  },
  {
    icon: MessageCircleHeart,
    title: "RSVP & ucapan",
    body: "Tamu mengonfirmasi kehadiran dan meninggalkan doa langsung dari undangannya.",
  },
  {
    icon: Mail,
    title: "Nama tamu personal",
    body: "Setiap tautan menyapa tamunya sendiri di halaman sampul, bukan sekadar sapaan umum.",
  },
];

// globals.css mengunci scroll di html/body - setiap layar membawa scroll
// container-nya sendiri - jadi landing page ini juga men-scroll di dalam
// <main>, bukan menumpang scroll dokumen.
export default function Home() {
  return (
    <main className="h-dvh w-full overflow-y-auto overscroll-y-none bg-[#faf8f4] text-[#2a2a2a]">
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a]/5 bg-[#faf8f4]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#7a5c48] text-white">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Diundang.id
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#6d574d] sm:flex">
            <a
              className="transition-colors hover:text-[#2a2a2a]"
              href="#template"
            >
              Template
            </a>
            <a className="transition-colors hover:text-[#2a2a2a]" href="#fitur">
              Fitur
            </a>
          </nav>

          <a
            href="#template"
            className="rounded-full bg-[#2a2a2a] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#7a5c48]"
          >
            Lihat Template
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        {/* Dua sapuan warna hangat di belakang hero - dekoratif murni. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#f2e4cf] opacity-60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#dfeadd] opacity-60 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#7a5c48] uppercase">
            Undangan Digital
          </p>
          <h1 className="mt-5 text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.1] font-light tracking-tight">
            Undangan pernikahan yang{" "}
            {/* Alex Brush punya x-height yang jauh lebih pendek dari Poppins,
                jadi ukurannya dinaikkan supaya terbaca sepadan. */}
            <span className="font-script text-[1.25em] text-[#7a5c48]">
              berkesan
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[#6d574d]">
            Pilih salah satu template, bagikan tautannya, dan biarkan tamu
            membuka cerita kalian lewat animasi, musik, dan galeri - langsung
            dari layar ponsel mereka.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#template"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7a5c48] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#63493d] sm:w-auto"
            >
              Jelajahi Template
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <Link
              href={`/preview/${FEATURED.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2a2a2a]/15 px-6 py-3 text-sm font-medium text-[#2a2a2a] transition-colors hover:border-[#7a5c48] hover:text-[#7a5c48] sm:w-auto"
            >
              Lihat Contoh Undangan
            </Link>
          </div>
        </div>
      </section>

      <section
        id="template"
        className="scroll-mt-16 px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.6rem,4vw,2.25rem)] font-light tracking-tight">
              Pilihan template
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6d574d]">
              Klik salah satu kartu untuk membuka pratinjau undangannya secara
              utuh, persis seperti yang akan dilihat tamu kalian.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => (
              <Link
                key={template.slug}
                href={`/preview/${template.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a5c48]"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#f5f6f1]">
                  <Image
                    src={template.cardImage}
                    alt={`Pratinjau template undangan ${template.name}`}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Scrim rata, bukan gradien dari bawah: gambarnya sendiri
                      sudah punya tombol dan nama di paruh bawah, jadi label
                      hover hanya terbaca kalau seluruh sampulnya diredupkan. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#2a2a2a]/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <span className="flex translate-y-2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-[#2a2a2a] shadow-lg transition-transform duration-300 group-hover:translate-y-0">
                      Lihat Preview
                      <ArrowRight className="size-4" />
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {template.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#6d574d]">
                      {template.tagline}
                    </p>
                  </div>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a]/10 text-[#7a5c48] transition-colors group-hover:border-[#7a5c48] group-hover:bg-[#7a5c48] group-hover:text-white">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}

            {/* Slot kosong supaya galerinya tidak terlihat separuh jadi selagi
                baru ada satu template. */}
            {[0, 1].map((slot) => (
              <div
                key={slot}
                className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-[#2a2a2a]/15 bg-[#f5f6f1]/60 px-6 text-center"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#7a5c48]">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <span className="mt-3 text-[13px] font-medium text-[#6d574d]">
                  Segera hadir
                </span>
                <span className="mt-1 text-[12px] text-[#6d574d]/70">
                  Template baru sedang disiapkan
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="fitur"
        className="scroll-mt-16 border-t border-[#2a2a2a]/5 bg-[#f5f6f1] px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.6rem,4vw,2.25rem)] font-light tracking-tight">
              Semua yang dibutuhkan undangan kalian
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6d574d]">
              Setiap template sudah dilengkapi hal-hal ini sejak awal.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#7a5c48] shadow-sm">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6d574d]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-3xl rounded-3xl bg-[#2a2a2a] px-6 py-12 text-center text-white sm:px-12 sm:py-14">
          <h2 className="text-[clamp(1.5rem,4vw,2rem)] leading-snug font-light tracking-tight">
            Siap membagikan kabar bahagia?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            Mulai dari template contoh, lalu sesuaikan nama, tanggal, dan foto
            kalian sendiri.
          </p>
          <Link
            href={`/preview/${FEATURED.slug}`}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#2a2a2a] transition-colors hover:bg-[#f2e4cf]"
          >
            Buka Contoh Undangan
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#2a2a2a]/5 px-5 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-[13px] text-[#6d574d] sm:flex-row">
          <span className="flex items-center gap-2">
            <Mail className="size-4" aria-hidden="true" />
            UndanganCuyy
          </span>
          {/* Tanpa tahun: halaman ini statis, jadi `new Date()` membeku pada
              waktu build dan akan salah begitu tahun berganti tanpa deploy. */}
          <span>&copy; UndanganCuyy</span>
        </div>
      </footer>
    </main>
  );
}
