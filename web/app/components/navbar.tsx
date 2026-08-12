"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useState } from "react";

export default function navbar() {
  const pathname = usePathname();
  // Iniciando o estado vazio para nenhum botão começar marcado
  const [activeAnchor, setActiveAnchor] = useState<string>("");

  const navItems = [
    { anchor: "painel", label: "Chamados" },
    { anchor: "recursos", label: "Recursos" },
    { anchor: "comunicacao", label: "Comunicação" },
    { anchor: "riscos", label: "Categorização" },
    { anchor: "emergencia", label: "Emergência" },
    { anchor: "app", label: "Aplicativo" },
  ];

  const handleAnchorClick = (anchor: string) => {
    setActiveAnchor(anchor); // Só marca o fundo após o clique

    const scrollContainer = document.querySelector(".overflow-y-auto");
    const el = document.getElementById(anchor);
    if (el && scrollContainer) {
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const top = scrollContainer.scrollTop + elTop - containerTop - 70;
      scrollContainer.scrollTo({ top, behavior: "smooth" });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 pt-3 right-0 left-0 z-[10000] shadow-[0_2px_10px_rgba(0,0,0,0.15)] w-full pb-3 flex items-center justify-between"
      style={{ backgroundColor: "#091c4b" }}
    >
      <Link href="/" className="flex items-center gap-3 ml-10 group">
        <img
          src="/PluviteIcon.jpg"
          alt="Logo"
          className="w-10 h-10 mt-1 rounded-xl shadow-sm group-hover:scale-105 transition-transform"
        />
        <span className="text-xl font-bold tracking-tight text-white">
          PLUVITE
        </span>
      </Link>

      <div className="flex items-center gap-2 mr-10">
        {navItems.map(({ anchor, label }) => {
          const isActive = activeAnchor === anchor;

          return (
            <button
              key={anchor}
              onClick={() => handleAnchorClick(anchor)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-150 cursor-pointer text-white
                ${isActive ? "bg-white/15 shadow-sm font-bold" : "hover:bg-white/10"}`}
            >
              {label}
            </button>
          );
        })}

        <div className="w-[1px] h-6 bg-white/25 mx-3" />

        <Link
          href="/login"
          className="flex items-center gap-2 bg-slate-50 text-back hover:bg-zinc-200 
            transition-all duration-150 px-5 py-2 rounded-xl font-bold
            tracking-wide active:black shadow-md"
        >
          <UserRound size={18} />
          <span>Entrar</span>
        </Link>
      </div>
    </nav>
  );
}
