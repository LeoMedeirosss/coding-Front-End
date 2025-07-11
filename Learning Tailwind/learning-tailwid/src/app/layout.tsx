import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learning Tailwind",
  description: "Learning Tailwind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="grid min-h-screen lg:grid-cols-[285px_1fr]">
          <Sidebar/>
          <main className="px-4 pb-12 pt-24 lg:col-start-2 lg:px-6 lg:pb-12 lg:pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
