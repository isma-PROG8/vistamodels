import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VistaModels · AI Try-On Studio para marcas de moda",
  description:
    "Plataforma de probador virtual con IA. Sube tus prendas de ropa, bolsos y complementos y velas en modelos ficticios generados con IA. Ideal para e-commerce y catálogos.",
  keywords: [
    "virtual try-on",
    "IA moda",
    "modelos IA",
    "e-commerce moda",
    "fitting virtual",
    "VistaModels",
  ],
  authors: [{ name: "VistaModels" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "VistaModels · AI Try-On Studio",
    description: "Sube tu prenda. Vela en modelos IA en segundos.",
    url: "https://chat.z.ai",
    siteName: "VistaModels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VistaModels · AI Try-On Studio",
    description: "Sube tu prenda. Vela en modelos IA en segundos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
