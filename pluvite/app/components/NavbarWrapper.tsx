"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const semNavbar = ["/login", "/cadastro-cidadao"];
  const comNavbar = ["/"];

  if (semNavbar.includes(pathname)) return null;
  if (comNavbar.includes(pathname)) return <Navbar />;

  return <Sidebar />;
}