import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RedVelvet - Loja Online",
  description: "Descubra produtos únicos e elegantes na nossa loja online. Decoração, velas e roupa com qualidade e estilo.",
  keywords: "loja online, decoração, velas, roupa, produtos únicos, elegante",
  authors: [{ name: "RedVelvet" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" }
    ],
    apple: { url: "/favicon.svg", type: "image/svg+xml" }
  },
  openGraph: {
    title: "RedVelvet - Loja Online",
    description: "Descubra produtos únicos e elegantes na nossa loja online.",
    type: "website",
    locale: "pt_PT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
