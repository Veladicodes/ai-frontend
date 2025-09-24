import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Providers } from "@/components/providers/session-provider";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Investory — Your AI Micro-Spend Tutor",
  description:
    "Turn tiny spends into smart savings & investments with AI-powered financial guidance",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${GeistMono.variable}`}>
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
