import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Collective | Measurable Climate Impact & Eco-Action Platform",
  description:
    "Quantify personal and institutional sustainability. Log verified habits, track cumulative CO₂ emissions diverted, and mobilize campus and community ecological strategy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
