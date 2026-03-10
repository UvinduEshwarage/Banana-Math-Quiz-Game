import type { Metadata } from "next";
import { Geist, Geist_Mono,Irish_Grover } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

//configure the Irish Grover Font
const irishGrover = Irish_Grover({
  weight:"400",
  subsets:["latin"],
  variable:"--font-irish"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banana Math Quiz",
  description: "A fun math quiz game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${irishGrover.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
