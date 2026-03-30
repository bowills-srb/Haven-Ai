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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=DM+Mono&family=Barlow:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
