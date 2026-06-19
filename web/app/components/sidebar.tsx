"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  CloudSun,
  Navigation,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/Mapa", icon: Map, label: "Mapa" },
  { href: "/Clima2", icon: CloudSun, label: "Clima" },
  { href: "/rotas", icon: Navigation, label: "Rotas" },
  { href: "/perfil", icon: UserRound, label: "Perfil" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const expanded = isOpen;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-[100] flex flex-col bg-[#1b56cc] shadow-2xl transition-all duration-300 ease-in-out ${
        expanded ? "w-[240px]" : "w-[72px]"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-5 border-b border-white/10 overflow-hidden"
      >
        <img
          src="/PluviteIcon.jpg"
          alt="Logo"
          className="w-8 h-8 rounded-lg shrink-0 shadow-sm"
        />
        <span
          className={`text-white font-bold text-sm tracking-wide transition-opacity duration-300 ${
            expanded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          PLUVITE
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1 mt-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden relative group ${
                active
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={22}
                className="shrink-0 transition-transform group-hover:scale-105"
              />
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${
                  expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {label}
              </span>

              {active && expanded && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>
      {/* Perfil */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-3 py-2 rounded-xl overflow-hidden hover:bg-white/10"
        >
          {/* Bolinha do Perfil com ícone seguro — sem quebrar o React */}
          <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 shrink-0 flex items-center justify-center text-white">
            <UserRound size={16} />
          </div>
          <span
            className={`text-sm font-medium text-white/80 transition-opacity duration-300 ${
              expanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Meu Perfil
          </span>
        </Link>
      </div>

      {/* Botão de Fixar com Curva Suave Interligada Corriga */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-[22px] top-1/2 -translate-y-1/2 w-6 h-20 bg-[#1b56cc] rounded-r-2xl flex items-center justify-center cursor-pointer group transition-all duration-300 shadow-[4px_0_10px_rgba(0,0,0,0.1)]"
        title={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {/* Curva superior */}
        <div className="absolute -top-5 left-0 w-6 h-6 bg-transparent pointer-events-none">
          <div className="w-full h-full rounded-bl-[24px] shadow-[-8px_8px_0_0_#1b56cc]" />
        </div>

        {/* Curva inferior */}
        <div className="absolute -bottom-5 left-0 w-6 h-6 bg-transparent pointer-events-none">
          <div className="w-full h-full rounded-tl-[24px] shadow-[-8px_-8px_0_0_#1b56cc]" />
        </div>

        {/* Seta interna */}
        {isOpen ? (
          <ChevronLeft
            size={22}
            className="text-white/80 group-hover:text-white transition-transform group-hover:-translate-x-0.5"
          />
        ) : (
          <ChevronRight
            size={22}
            className="text-white/80 group-hover:text-white transition-transform group-hover:translate-x-0.5"
          />
        )}
      </button>
    </aside>
  );
}
