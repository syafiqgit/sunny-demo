import type { Metadata, Viewport } from "next";
import { Poppins, Alex_Brush } from "next/font/google";
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

export const metadata: Metadata = {
  title: "The Wedding of Vincent & Natasha",
  description: "Saturday, April 25, 2026",
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
