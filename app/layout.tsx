import type { Metadata } from "next";
import { Poppins, Alex_Brush } from "next/font/google";
import "./globals.css";

const sansFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

// Update: Menggunakan Alex Brush untuk menyesuaikan bentuk "&" pada desain
const scriptFont = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "The Wedding of Vincent & Natasha",
  description: "Saturday, April 25, 2026",
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
