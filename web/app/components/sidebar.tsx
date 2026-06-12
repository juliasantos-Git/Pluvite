"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  CloudSun,
  Navigation,
  UserRound,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/Mapa", icon: Map, label: "Mapa" },
  { href: "/clima", icon: CloudSun, label: "Clima" },
  { href: "/rotas", icon: Navigation, label: "Rotas" },
  { href: "/perfil", icon: UserRound, label: "Perfil" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed top-0 left-0 h-screen z-[100] flex flex-col transition-all duration-300 ease-in-out shadow-xl"
      style={{
        width: expanded ? "200px" : "64px",
        backgroundColor: "#1b56cc",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-5 border-b border-white/10 overflow-hidden"
      >
        <img
          src="/PluviteIcon.jpg"
          alt="Logo"
          className="w-8 h-8 rounded-lg flex-shrink-0 shadow-sm"
        />
        <span
          className="text-white font-bold text-sm tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden"
          style={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
        >
          PLUVITE
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 overflow-hidden group"
              style={{
                backgroundColor: active
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon
                size={22}
                className="flex-shrink-0"
                style={{ color: active ? "white" : "rgba(255,255,255,0.7)" }}
              />
              <span
                className="text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden"
                style={{
                  opacity: expanded ? 1 : 0,
                  width: expanded ? "auto" : 0,
                  color: active ? "white" : "rgba(255,255,255,0.7)",
                }}
              >
                {label}
              </span>
              {active && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"
                  style={{
                    opacity: expanded ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Perfil — bolinha com foto */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-2 py-2 rounded-xl overflow-hidden transition-all duration-150 hover:bg-white/10"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex-shrink-0 overflow-hidden">
            {/* Troca o src pela foto do usuário quando tiver */}
            <img
              src="/placeholder-avatar.jpg"
              alt="Foto de perfil"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML = `<span style="color:white;font-size:14px;font-weight:bold;display:flex;align-items:center;justify-content:center;height:100%">U</span>`;
              }}
            />
          </div>
          <span
            className="text-sm font-medium text-white/80 whitespace-nowrap transition-all duration-300 overflow-hidden"
            style={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
          >
            Meu Perfil
          </span>
        </Link>
      </div>

      {/* Setinha indicadora */}
      <div
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `translateY(-50%) text-white rotate(${expanded ? 180 : 0}deg)`,
        }}
      >
        <ChevronRight size={14} className="text-white" />
      </div>
    </aside>
  );
}
