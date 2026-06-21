/* NÃO TIRAR NADA DAQUI. COLOCAR COISAS QUE PRECISAM SER FIXAS NO SITE.*/
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarWrapper from "./components/NavbarWrapper";
import "./globals.css";
import Navbar from "./components/navbar";

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
        <NavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
