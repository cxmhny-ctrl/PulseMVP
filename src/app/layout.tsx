import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pulse \u2014 ADHD Stuck-to-Action Companion",
  description:
    "Pulse helps you start when you\u2019re stuck. No complex planning. No shame. The next tiny step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
