import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classmate",
  description: "Your AI study companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
