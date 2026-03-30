import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blue Haven Pools · Warranty Agent",
  description: "Haven AI — Blue Haven Pools warranty service agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
