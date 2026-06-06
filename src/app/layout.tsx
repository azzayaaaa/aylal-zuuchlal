import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakura-travel.vercel.app"),
  title: {
    default: "Sakura Travel - Tokyo Fuji travel platform",
    template: "%s | Sakura Travel",
  },
  description:
    "Монгол хэрэглэгчдэд зориулсан Япон аяллын AI itinerary, booking wizard, email confirmation, admin dashboard бүхий production demo.",
  openGraph: {
    title: "Sakura Travel - Tokyo Fuji travel platform",
    description:
      "AI itinerary, smart booking, email confirmation, admin operations dashboard-той Япон аяллын full-stack demo.",
    url: "https://sakura-travel.vercel.app",
    siteName: "Sakura Travel",
    images: [
      {
        url: "/images/japan/fuji-sakura.jpg",
        width: 1200,
        height: 800,
        alt: "Mount Fuji and sakura travel view",
      },
    ],
    locale: "mn_MN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
