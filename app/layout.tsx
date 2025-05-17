import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import ClientLayout from "./client-layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlotCraft - Craft Your Book's Blueprint",
  description:
    "Generate comprehensive book plots and chapter outlines for novels with perfect consistency and compelling narratives.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
