"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, Layers, MessageSquare, ShieldAlert, Phone, UserRound } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { anchor: "painel", icon: BarChart3, label: "Chamados" },
    { anchor: "recursos", icon: Layers, label: "Recursos" },
    { anchor: "comunicacao", icon: MessageSquare, label: "Comunicação" },
    { anchor: "riscos", icon: ShieldAlert, label: "Categorização" },
    { anchor: "emergencia", icon: Phone, label: "Emergência" },
  ];

  const handleAnchorClick = (anchor: string) => {
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
    <nav className="fixed top-0 pt-3 right-0 left-0 z-[10000] shadow-[0_2px_10px_rgba(0,0,0,0.15)] w-full pb-3 flex items-center justify-between"
      style={{ backgroundColor: "#1b56cc" }}
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
        {navItems.map(({ anchor, icon: Icon, label }) => (
          <button
            key={anchor}
            onClick={() => handleAnchorClick(anchor)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-150
              text-white hover:bg-white/15 hover:text-whit cursor-pointer"
          >
            <Icon size={20} />
            {label}
          </button>
        ))}

        <div className="w-[1px] h-6 bg-white/25 mx-3" />

        <Link
          href="/login"
          className="flex items-center gap-2 text-white bg-white/15 border border-white/30
            hover:bg-white/25 transition-all duration-150 px-5 py-2 rounded-xl font-semibold
            tracking-wide active:scale-95"
        >
          <UserRound size={20} />
          Entrar
        </Link>
      </div>
    </nav>
  );
}