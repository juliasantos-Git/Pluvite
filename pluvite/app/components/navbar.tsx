"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Users, CloudRain, Navigation, UserRound } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/Mapa", icon: Map, label: "Mapa" },
    { href: "/", icon: Users, label: "Feed" },
    { href: "/Clima2", icon: CloudRain, label: "Clima" },
    { href: "#", icon: Navigation, label: "Rotas" },
  ];

  return (
    <nav className="fixed top-0 pt-3 right-0 left-0 z-[10000] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] w-full pb-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 ml-10 group">
        <img
          src="/PluviteIcon.jpg"
          alt="Logo"
          className="w-10 h-10 mt-1 rounded-xl shadow-sm group-hover:scale-105 transition-transform"
        />
        <span className="text-xl font-bold tracking-tight text-slate-900 flex justify-center">
          PLUVITE
        </span>
      </Link>

      <div className="flex items-center gap-1 mr-10">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === `/${href}` || pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-150 
                ${
                  isActive
                    ? "bg-[#1a2744] text-white"
                    : "text-slate-600 hover:bg-[#1a2744]/10 hover:text-[#1a2744]"
                }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}

        <div className="w-[1px] h-6 bg-zinc-200 mx-3"></div>

        <Link
          href="/login"
          className="flex items-center gap-2 text-white bg-[#1a2744] hover:bg-[#1a56cc] transition-all duration-150 px-5 py-2 rounded-xl font-semibold tracking-wide active:scale-95"
        >
          <UserRound size={20} />
          Entrar
        </Link>
      </div>
    </nav>
  );
}