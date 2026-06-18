"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { anchor: "painel", label: "Chamados" },
    { anchor: "recursos", label: "Recursos" },
    { anchor: "comunicacao", label: "Comunicação" },
    { anchor: "riscos", label: "Categorização" },
    { anchor: "emergencia", label: "Emergência" },
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

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const btnRect = e.currentTarget.getBoundingClientRect();
    setLineStyle({
      left: btnRect.left - navRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setLineStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <nav
      className="fixed top-0 pt-3 right-0 left-0 z-[10000] w-full pb-3 flex items-center justify-between"
      style={{ backgroundColor: "transparent" }}
    >
      <Link href="/" className="flex items-center gap-3 ml-10 group">
        <img
          src="/PluviteIcon.jpg"
          alt="Logo"
          className="w-10 h-10 mt-1 rounded-xl shadow-sm group-hover:scale-105 transition-transform"
        />
        <span className="text-xl font-bold tracking-tight text-black">
          PLUVITE
        </span>
      </Link>

      <div
        ref={navRef}
        className="flex items-center gap-1 mr-10 relative"
        onMouseLeave={handleMouseLeave}
      >
        {/* Linha deslizante */}
        <span
          className="pointer-events-none absolute bottom-0 h-[2px] bg-black rounded-full transition-all duration-200 ease-out"
          style={{
            left: lineStyle.left,
            width: lineStyle.width,
            opacity: lineStyle.opacity,
          }}
        />

        {navItems.map(({ anchor, label }) => (
          <button
            key={anchor}
            onClick={() => handleAnchorClick(anchor)}
            onMouseEnter={handleMouseEnter}
            className="relative px-4 py-2 font-medium text-black/80 hover:text-black transition-colors duration-150 cursor-pointer"
          >
            {label}
          </button>
        ))}

        <div className="w-[1px] h-6 bg-black/25 mx-3" />

        <Link
          href="/login"
          className="flex items-center gap-2 text-black bg-black/10 border border-black/20
            hover:bg-black/15 transition-all duration-150 px-5 py-2 rounded-xl font-semibold
            tracking-wide active:scale-95"
        >
          <UserRound size={20} />
          Entrar
        </Link>
      </div>
    </nav>
  );
}