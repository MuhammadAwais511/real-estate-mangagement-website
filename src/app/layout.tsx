import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reside — Premium Real Estate",
  description: "Browse luxury homes, offices, and booking tools with a modern property experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        ✅ FIX 1: body se hardcoded bg/text classes hata di hain.
           Ab ThemeBody component theme ke hisaab se classes apply karta hai.
        ✅ FIX 2: suppressHydrationWarning <html> par — SSR mein "dark" class
           server/client mismatch se hydration warning nahi aayegi.
      */}
      <body className="min-h-full transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <div className="mx-auto w-full max-w-7xl px-6 py-6 sm:px-8">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
