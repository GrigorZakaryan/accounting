export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

const myFont = localFont({
  src: "./ZalandoSansSemiExpanded-VariableFont_wght.ttf",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accounting App",
  description: "Accounting App By ZakaWeb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex w-full h-full">
          <Sidebar />
          <div className="w-full h-full max-h-[100dvh] overflow-y-hidden">
            {children}
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
