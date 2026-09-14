import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Green Collective",
  description: "Campus Sustainability Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
