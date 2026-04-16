"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Users,
  CloudRain,
  Navigation,
  CircleUserRound,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = pathname === "/";
  return (
    <nav className="fixed top-0 mt-3 right-0 left-0 z-[100] bg-white shadow-2xl shadow-zinc-700/20 w-full pb-3 flex items-center justify-between">
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
      {/*MAPA */}
      <div className="grid grid-cols-6 items-center gap-8">
        <Link
          href="/"
          className={`flex items-center gap-2 hover:text-blue-700 transition-all duration-200`}
        >
          <Map size={20} />
          Mapa
        </Link>
        {/*FEED */}
        <Link
          href="/"
          className={`flex items-center gap-2 hover:text-blue-700 transition-all duration-200 transition-all duration-200`}
        >
          <Users size={20} />
          Feed
        </Link>
        {/*CLIMA */}
        <Link
          href="/"
          className={`flex items-center gap-2 hover:text-blue-700 transition-all duration-200 transition-all duration-200`}
        >
          <CloudRain size={20} />
          Clima
        </Link>
        {/*ROTAS */}
        <Link
          href="/"
          className={`flex items-center gap-2 hover:text-blue-700 transition-all duration-200 transition-all duration-200`}
        >
          <Navigation size={20} />
          Rotas
        </Link>
        {/*LINHA ENTRE ENTRAR E ROTA*/}
        <div className="w-[1px] h-6 bg-zinc-700"></div>
        {/*ENTRAR */}
        <Link
          href="/cadastro"
          className={`flex items-center gap-2 -ml-16 mt-1 w-fit text-white bg-[#256ffe]  hover:bg-cyan-800 transition-all duration-150 pr-2 pl-2 p-1 rounded`}
        >
          <CircleUserRound size={20} />
          Entrar
        </Link>
      </div>
    </nav>
  );
}
