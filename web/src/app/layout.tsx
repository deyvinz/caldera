import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Caldera Luxury Travel",
    template: "%s · Caldera",
  },
  description: "Luxury African travel experiences. Emerald & Gold.",
  manifest: "/manifest.webmanifest",
  icons: [
    { rel: "icon", url: "/icons/icon-192.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-192.png" },
    { rel: "icon", url: "/icons/maskable-icon-192.png", sizes: "192x192" },
  ],
};

export const viewport = {
  themeColor: "#054A29",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased bg-cream-50 text-charcoal-900 min-h-screen font-sans` }>
        {children}
      </body>
    </html>
  );
}
