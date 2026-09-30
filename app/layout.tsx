import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://greencollective.ca"),
  title: {
    default: "Green Collective | Measurable Climate Impact & Eco-Action Platform",
    template: "%s | Green Collective",
  },
  description:
    "Quantify personal and institutional sustainability. Log verified habits, track cumulative CO₂ emissions diverted, and mobilize campus and community ecological strategy.",
  keywords: [
    "Green Collective",
    "greencollective.ca",
    "Vancouver sustainability platform",
    "Toronto eco action",
    "campus sustainability challenge",
    "carbon tracking ledger",
  ],
  authors: [{ name: "Graeme Cameron", url: "https://greencollective.ca" }],
  creator: "Graeme Cameron",
  publisher: "Green Collective",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://greencollective.ca",
    title: "Green Collective | Measurable Climate Impact & Eco-Action Platform",
    description:
      "Quantify personal and institutional sustainability through empirical rigor and active regional community stewardship.",
    siteName: "Green Collective",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Green Collective - Measurable Climate Impact Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Collective | Measurable Climate Impact Platform",
    description:
      "Quantify personal and institutional sustainability. Log verified habits and track cumulative CO₂ emissions diverted.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-emerald-950/5 text-foreground flex flex-col justify-between relative">
        {/* Enhanced Organization & WebSite Schema Markup for Entity SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://greencollective.ca/#organization",
                  name: "Green Collective",
                  url: "https://greencollective.ca",
                  logo: "https://greencollective.ca/logo.jpg",
                  description:
                    "An institutional-grade sustainability and community action platform prioritizing empirical rigor, regional stewardship, and academic depth.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Vancouver",
                    addressRegion: "BC",
                    addressCountry: "CA",
                  },
                  founder: {
                    "@type": "Person",
                    name: "Graeme Cameron",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://greencollective.ca/#website",
                  url: "https://greencollective.ca",
                  name: "Green Collective",
                  publisher: {
                    "@id": "https://greencollective.ca/#organization",
                  },
                  inLanguage: "en-CA",
                },
              ],
            }),
          }}
        />

        {/* Shared Global Header */}
        <Navbar />

        {/* Dynamic Page Views */}
        <main className="flex-1 flex flex-col w-full">{children}</main>

        {/* Shared Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
