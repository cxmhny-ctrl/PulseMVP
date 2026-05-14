import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse",
  description: "ADHD stuck-to-action companion. The next tiny step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
