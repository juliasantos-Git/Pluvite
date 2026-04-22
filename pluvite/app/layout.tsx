/* NÃO TIRAR NADA DAQUI. COLOCAR COISAS QUE PRECISAM SER FIXAS NO SITE.*/
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pluvite",
  description: "Plataforma de gestão de riscos e monitoramento",
  icons: {
    icon: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="overflow-hidden">
        <Navbar />
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}