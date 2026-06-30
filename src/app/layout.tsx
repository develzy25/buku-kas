import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// FortAwesome setup
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import BottomNav from "@/components/BottomNav";
import FloatingActionButton from "@/components/FloatingActionButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buku Kas SD",
  description: "Catatan Penitipan Uang SD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 text-gray-900 overflow-x-hidden min-h-screen`}>
        {/* Main wrapper: responsive sidebar on PC, bottom nav on mobile */}
        <div className="flex flex-col md:flex-row min-h-screen relative">
          <BottomNav />
          <div className="flex-1 w-full relative pb-20 md:pb-0 md:ml-56 lg:ml-64 transition-all">
            <div className="max-w-7xl mx-auto min-h-screen bg-gray-50 shadow-sm md:border-x border-gray-100">
              {children}
            </div>
            <FloatingActionButton />
          </div>
        </div>
      </body>
    </html>
  );
}
