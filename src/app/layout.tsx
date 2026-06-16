import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WalletProvider } from "@/components/WalletProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = localFont({
  src: [
    {
      path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2",
      style: "normal",
      weight: "600",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NUMINA - Summon intelligence. Bind it to the chain.",
    template: "%s | NUMINA",
  },
  description:
    "Autonomous on-chain AI agents on Solana. Summon intelligence. Bind it to the chain.",
  keywords: [
    "solana",
    "ai agents",
    "autonomous trading",
    "on-chain",
    "defi",
    "web3",
  ],
  metadataBase: new URL("https://numina.fun"),
  openGraph: {
    title: "NUMINA - Summon intelligence. Bind it to the chain.",
    description: "Autonomous on-chain AI agents on Solana.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NUMINA - Summon intelligence. Bind it to the chain.",
    description: "Autonomous on-chain AI agents on Solana.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <ErrorBoundary>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <WalletProvider>
            <Nav />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
