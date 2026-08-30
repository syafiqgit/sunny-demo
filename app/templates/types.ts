import type { SizedImage, StageContent } from "../components/Stage.types";

export type { SizedImage, StageContent };

export interface StoryChapter {
  title: string;
  body: string;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  aspect: "landscape" | "portrait";
}

/**
 * Ucapan bawaan yang tampil sebelum ada backend RSVP.
 *
 * `createdAt` sengaja string ISO tetap, bukan offset relatif: modul ini
 * dievaluasi sekali di server dan sekali lagi di browser, jadi nilai relatif
 * akan berbeda sejauh berapa lama proses server sudah hidup - dan label
 * "x months ago" yang dirender lalu gagal hydration.
 */
export interface SeedWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

/**
 * Satu tema undangan, seluruhnya sebagai data.
 *
 * Menambah tema baru = menambah satu berkas seperti `sunny.ts`, mendaftarkannya
 * di `index.ts`, dan menaruh asetnya di `public/images/<slug>/` - satu folder
 * per tema, jadi aset antar-tema tidak pernah bercampur. Tidak ada komponen
 * yang perlu disalin: semuanya membaca objek ini.
 *
 * Yang TIDAK ikut di sini adalah geometri panggung (skala dan geseran tiap
 * lapis parallax) dan keyframe kameranya - keduanya diukur terhadap komposisi
 * artwork sunny dan tinggal di `Stage*.tsx`. Artwork tema baru harus mengikuti
 * spesifikasi yang sama, atau angka-angka itu perlu diukur ulang. Lihat
 * `StageAssets` di `components/Stage.types.ts`.
 */
export interface TemplateConfig {
  /** Segmen URL: /preview/<slug>. */
  slug: string;
  /** Nama tema di kartu landing page. */
  name: string;
  /** Baris kecil di bawah nama, mis. "Wedding - Outdoor - Cinematic". */
  tagline: string;
  /** Gambar kartu di landing page. */
  cardImage: string;

  /** Dipakai untuk judul tab, alt text, dan sampul. */
  coupleNames: string;
  /** Tanggal sebagaimana ditulis di sampul - teks bebas, bukan tanggal terurai. */
  weddingDate: string;

  /**
   * Sasaran hitung mundur, ISO 8601 dengan zona waktu.
   *
   * Sengaja terpisah dari `weddingDate`: pada tema contoh, tanggal yang
   * ditampilkan sudah lewat, sementara hitung mundurnya perlu tetap berjalan
   * supaya demonya hidup. Pada undangan sungguhan keduanya diisi sama.
   */
  countdownTarget: string;

  musicSrc: string;
  /** Foto sampul; dipakai ulang di Story dan Closing. */
  coverImage: string;

  stage: StageContent;

  countdown: {
    decorImage: SizedImage;
  };

  story: {
    title: string;
    chapters: StoryChapter[];
    /** Foto di balik pil cerita. */
    backgroundImage: string;
    /** Karangan bunga atas & bawah (yang atas diputar 180 derajat). */
    wreathImage: SizedImage;
  };

  gallery: GalleryPhoto[];

  gift: {
    heading: string;
    body: string;
    buttonLabel: string;
    /** Tautan rekening / e-wallet / wishlist. */
    url: string;
    decorImage: string;
  };

  closing: {
    portraitImage: string;
    /** Nama tulisan tangan di sudut potret, dipecah dua baris. */
    scriptLine1: string;
    scriptLine2: string;
    farewell: string;
  };

  wishes: SeedWish[];
}
