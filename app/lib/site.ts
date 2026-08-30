/**
 * Identitas situs - dipakai bersama oleh root layout dan landing page.
 *
 * Keduanya perlu string yang sama untuk kartu Open Graph; ditaruh di sini
 * supaya tidak ada dua sumber yang bisa berbeda.
 */
export const SITE_NAME = "UndanganCuyy";

export const SITE_TITLE = "UndanganCuyy - Undangan Pernikahan Digital";

export const SITE_DESCRIPTION =
  "Pilih template undangan pernikahan digital yang elegan, bisa dibuka di ponsel mana saja, lengkap dengan musik, galeri, dan RSVP.";

/**
 * Basis URL absolut untuk metadata.
 *
 * Setel NEXT_PUBLIC_SITE_URL ke domain produksi saat deploy - tanpa itu path
 * gambar Open Graph tidak bisa diubah jadi absolut dan kartu preview di
 * WhatsApp/Instagram muncul kosong. Fallback-nya hanya supaya dev lokal jalan.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
