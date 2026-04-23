"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Users, CloudRain, Navigation, UserRound } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = pathname === "/";

  return (
    // Alterado: shadow-[0_2px_10px_rgba(0,0,0,0.08)] para ser contida e nítida
    <nav className="fixed top-0 pt-3 right-0 left-0 z-[100] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] w-full pb-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 ml-10 group">
        <img
          src="PluviteIcon.jpg"
          alt="Logo"
          className="w-10 h-10 mt-1 rounded-xl shadow-sm group-hover:scale-105 transition-transform"
        />
        <span className="text-xl font-bold tracking-tight text-slate-900">
          PLUVITE
        </span>
      </Link>

      <div className="grid grid-cols-6 items-center gap-8 mr-10">
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-blue-700 transition-all duration-200"
        >
          <Map size={20} />
          Mapa
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 hover:text-blue-700 transition-all duration-200"
        >
          <Users size={20} />
          Feed
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 hover:text-blue-700 transition-all duration-200"
        >
          <CloudRain size={20} />
          Clima
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 hover:text-blue-700 transition-all duration-200"
        >
          <Navigation size={20} />
          Rotas
        </Link>

        <div className="w-[1px] h-6 bg-zinc-200"></div>

        <Link
          href="/selecao"
          className="flex items-center gap-2 -ml-16 mt-1 w-fit text-white bg-[#256ffe] hover:bg-[#1a56cc] transition-all duration-150 px-4 py-2 rounded-lg font-medium"
        >
          <UserRound size={20} />
          Entrar
        </Link>
      </div>
    </nav>
  );
}