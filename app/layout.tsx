import type { Metadata, Viewport } from "next";
import { Poppins, Alex_Brush } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/app/lib/site";
import "./globals.css";

const sansFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Update: Menggunakan Alex Brush untuk menyesuaikan bentuk "&" pada desain
const scriptFont = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// Seluruh produk ini dipakai dengan cara membagikan tautan, jadi kartu preview
// di WhatsApp/Instagram adalah tampilan pertama yang dilihat tamu. `openGraph`
// di bawah yang mengisinya, dan `metadataBase` yang membuat path gambar
// relatif berubah jadi URL absolut - tanpa itu kartunya kosong.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// `viewportFit: "cover"` is what makes the env(safe-area-inset-*) padding on
// the cover actually resolve to something on notched phones - without it the
// browser reports 0 and the CTA sits under the home indicator.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f6f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${scriptFont.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
