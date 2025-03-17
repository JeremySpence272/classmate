import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ClassProvider } from "@/context/ClassContext";
import { NoteProvider } from "@/context/NoteContext";

export const metadata: Metadata = {
  title: "Classmate",
  description: "Your AI study companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950">
        <ClassProvider>
          <NoteProvider>{children}</NoteProvider>
        </ClassProvider>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#27272a",
              border: "1px solid #3f3f46",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
