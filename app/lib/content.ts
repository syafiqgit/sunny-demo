/**
 * Kontrak isi undangan.
 *
 * Modul ini sengaja netral: ia tidak mengimpor apa pun dari `components/`
 * maupun `templates/`, dan keduanya mengimpor dari sini. Itu yang menjaga
 * arahnya satu jalur - komponen tidak bergantung pada berkas tema, dan berkas
 * tema tidak bergantung pada komponen. Sebelumnya keduanya saling impor, jadi
 * tidak ada pihak yang benar-benar memiliki kontraknya.
 */

/**
 * Gambar yang dirender tanpa `fill`, jadi ukuran alaminya ikut dibawa supaya
 * next/image bisa memesan ruangnya dan tidak ada layout shift.
 */
export interface SizedImage {
  src: string;
  width: number;
  height: number;
}

export interface PersonInfo {
  scriptName: string;
  fullName: string;
  parentsLine1: string;
  parentsLine2: string;
  instagramHandle: string;
}

export interface EventDetail {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface DressCodeInfo {
  title: string;
  description: string;
  colors: ColorSwatch[];
}

export interface QuoteInfo {
  text: string;
  citation?: string;
}

/**
 * Artwork panggung, jauh ke dekat.
 *
 * PENTING untuk tema baru: hanya `src` (dan ukuran alaminya) yang tinggal
 * diganti. Transform yang memasang tiap lapis pada tempatnya - skala, geseran,
 * dan tinggi minimumnya - hidup di komponen lapisannya masing-masing dan
 * diukur terhadap komposisi artwork "sunny". Artwork baru harus digambar pada
 * spesifikasi yang sama (lebar desain 500px, ditambatkan ke tepi bawah
 * panggung, horizon dan garis bunga pada ketinggian yang sama) atau angka-
 * angka itu perlu diukur ulang. Lihat catatan di tiap komponen Stage*Layer.
 */
export interface StageAssets {
  /** Langit + tajuk pohon - bidang terjauh. */
  canopy: SizedImage;
  /** Hamparan bunga tempat pasangan berdiri. */
  field: SizedImage;
  /** Rumpun bunga tengah, digambar di depan pasangan. */
  nearGrass: SizedImage;
  /** Rumpun bunga terdepan. */
  frontGrass: SizedImage;
  /** Potongan gambar pasangan. */
  couple: SizedImage;
  /** Awan di belakang kutipan pembuka (dirender dengan `fill`). */
  quoteCloud: string;
  /** Sapuan kabut di balik detail acara (dirender dengan `fill`). */
  eventWash: string;
}

/** Seluruh isi panggung untuk satu tema. */
export interface StageContent {
  groom: PersonInfo;
  bride: PersonInfo;
  matrimony: EventDetail;
  reception: EventDetail;
  dressCode: DressCodeInfo;
  openingQuote: QuoteInfo;
  closingQuote: QuoteInfo;
  streamingUrl?: string;
  assets: StageAssets;
}

export interface CountdownContent {
  decorImage: SizedImage;
}

export interface StoryChapter {
  title: string;
  body: string;
}

export interface StoryContent {
  title: string;
  chapters: StoryChapter[];
  /** Foto di balik pil cerita. */
  backgroundImage: string;
  /** Karangan bunga atas & bawah (yang atas diputar 180 derajat). */
  wreathImage: SizedImage;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
  aspect: "landscape" | "portrait";
}

export interface GiftInfo {
  heading: string;
  body: string;
  buttonLabel: string;
  /** Tautan rekening / e-wallet / wishlist. */
  url: string;
  decorImage: string;
}

export interface ClosingInfo {
  portraitImage: string;
  /** Nama tulisan tangan di sudut potret, dipecah dua baris. */
  scriptLine1: string;
  scriptLine2: string;
  farewell: string;
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
 * Menambah tema baru = menambah satu berkas seperti `templates/sunny.ts`,
 * mendaftarkannya di `templates/index.ts`, dan menaruh asetnya di
 * `public/images/<slug>/` - satu folder per tema, jadi aset antar-tema tidak
 * pernah bercampur. Tidak ada komponen yang perlu disalin: semuanya membaca
 * objek ini.
 *
 * Yang TIDAK ikut di sini adalah geometri panggung (skala dan geseran tiap
 * lapis parallax) dan keyframe kameranya - keduanya diukur terhadap komposisi
 * artwork sunny dan tinggal di `components/stage/`. Lihat `StageAssets`.
 */
export interface TemplateConfig {
  /** Segmen URL: /preview/<slug>. */
  slug: string;
  /** Nama tema di kartu landing page. */
  name: string;
  /** Baris kecil di bawah nama, mis. "Wedding - Outdoor - Cinematic". */
  tagline: string;
  /** Gambar kartu di landing page, sekaligus gambar preview saat dibagikan. */
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
  countdown: CountdownContent;
  story: StoryContent;
  gallery: GalleryPhoto[];
  gift: GiftInfo;
  closing: ClosingInfo;
  wishes: SeedWish[];
}
