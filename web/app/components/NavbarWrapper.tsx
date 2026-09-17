"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Navbar2 from "./navbar2";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const semNavbar = ["/login", "/cadastro-cidadao", "/redefinir-senha"];
  const comNavbar = ["/"];

  if (semNavbar.includes(pathname)) return null;
  if (comNavbar.includes(pathname)) return <Navbar />;

  // Rotas do painel da prefeitura têm a própria navegação (a sidebar
  // Navbar3, renderizada dentro de cada page.tsx do Servidor), então
  // o NavbarWrapper não deve mostrar nada aqui.
  if (pathname?.startsWith("/Servidor")) return null;

  return <Navbar2 />;
}