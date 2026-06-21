"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  CloudSun,
  Navigation,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

const navItems = [
  { href: "/Mapa", icon: Map, label: "Mapa" },
  { href: "/Clima2", icon: CloudSun, label: "Clima" },
  { href: "/rotas", icon: Navigation, label: "Rotas" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  // Simulação de estado de login. Substitua pela sua lógica real (ex: AuthContext, NextAuth, etc.)
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const user = {
    name: "João Silva",
    avatar: "/placeholder-avatar.jpg", // Substitua pela imagem real
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-[100] flex flex-col transition-all duration-300 ease-in-out shadow-[2px_0_10px_rgba(0,0,0,0.15)]"
      style={{
        width: expanded ? "240px" : "72px",
        backgroundColor: "#091c4b", // Mesma cor da Navbar
      }}
    >
      {/* Topo / Logo + Botão de Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 overflow-hidden min-h-[73px]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <img
            src="/PluviteIcon.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-xl flex-shrink-0 shadow-sm"
          />
          {expanded && (
            <span className="text-white font-bold text-xl tracking-tight whitespace-nowrap animate-in fade-in duration-300">
              PLUVITE
            </span>
          )}
        </Link>

        {/* Botão com o ícone para expandir/recolher */}
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="text-white hover:bg-white/15 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <PanelLeftClose size={22} />
          </button>
        )}
      </div>

      {/* Se o menu estiver fechado, o botão de abrir fica centralizado aqui no topo */}
      {!expanded && (
        <div className="flex justify-center my-3">
          <button
            onClick={() => setExpanded(true)}
            className="text-white hover:bg-white/15 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <PanelLeftOpen size={24} />
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1 mt-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 overflow-hidden group text-white"
              style={{
                backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon
                size={22}
                className="flex-shrink-0"
                style={{ color: active ? "white" : "rgba(255,255,255,0.7)" }}
              />
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-300">
                  {label}
                </span>
              )}
              {active && expanded && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Área de Login / Perfil */}
      <div className="p-3 border-t border-white/10 flex justify-center">
        {isLoggedIn ? (
          /* Se estiver LOGADO: Mostra foto e nome */
          <Link
            href="/perfil"
            className="flex items-center gap-3 w-full px-2 py-2 rounded-xl overflow-hidden transition-all duration-150 hover:bg-white/10 text-white"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex-shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={user.avatar}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-white text-sm font-bold">${user.name.charAt(0)}</span>`;
                }}
              />
            </div>
            {expanded && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
                <span className="text-sm font-semibold truncate">{user.name}</span>
                <span className="text-xs text-white/60 truncate">Ver perfil</span>
              </div>
            )}
          </Link>
        ) : (
          /* Se NÃO estiver logado: Mostra o botão "Entrar" com o layout igual da Navbar */
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-white bg-white/15 border border-white/30
              hover:bg-white/25 transition-all duration-150 rounded-xl font-semibold
              tracking-wide active:scale-95 whitespace-nowrap"
            style={{
              width: expanded ? "100%" : "44px",
              height: "44px",
              padding: expanded ? "0 20px" : "0",
            }}
          >
            <UserRound size={20} className="flex-shrink-0" />
            {expanded && <span className="animate-in fade-in duration-300">Entrar</span>}
          </Link>
        )}
      </div>
    </aside>
  );
}