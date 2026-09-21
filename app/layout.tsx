import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

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
      <body className="antialiased min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative">
        {/* Organization Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Green Collective",
              url: "https://greencollective.ca",
              logo: "https://greencollective.ca/logo.png",
              description: "Measurable Climate Impact & Eco-Action Platform."
            })
          }}
        />

        {/* Shared Global Header */}
        <Navbar />

        {/* Dynamic Page Views */}
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>

        {/* Shared Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
