"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const navItems = [
  { anchor: "painel", label: "Chamados" },
  { anchor: "recursos", label: "Recursos" },
  { anchor: "comunicacao", label: "Comunicação" },
  { anchor: "riscos", label: "Categorização" },
  { anchor: "emergencia", label: "Emergência" },
  { anchor: "app", label: "Aplicativo" },
];

export default function Navbar() {
  const [activeAnchor, setActiveAnchor] = useState<string>("");
  const itemsWrapperRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Clique manual (continua funcionando, e ainda faz o scroll suave)
  const handleAnchorClick = (anchor: string) => {
    setActiveAnchor(anchor);

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

  // ── Scroll-spy: detecta a seção visível enquanto o usuário rola ──
  useEffect(() => {
    const scrollContainer = document.querySelector(".overflow-y-auto");
    if (!scrollContainer) return;

    const sections = navItems
      .map(({ anchor }) => document.getElementById(anchor))
      .filter((el): el is HTMLElement => !!el);

    let rafId: number | null = null;

    const updateActiveSection = () => {
      rafId = null;

      const containerTop = scrollContainer.getBoundingClientRect().top;
      // "Linha de gatilho": um pouco abaixo do topo do container (logo abaixo da navbar)
      const triggerOffset = 100;

      let current = sections[0]?.id ?? "";

      for (const section of sections) {
        const sectionTop = section.getBoundingClientRect().top - containerTop;
        if (sectionTop - triggerOffset <= 0) {
          current = section.id;
        }
      }

      setActiveAnchor((prev) => (prev !== current ? current : prev));
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateActiveSection);
      }
    };

    // Define o estado inicial e escuta o scroll
    updateActiveSection();
    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Indicador deslizante: recalcula posição/largura sempre que o item ativo muda ──
  useLayoutEffect(() => {
    const wrapper = itemsWrapperRef.current;
    const activeBtn = buttonRefs.current[activeAnchor];

    if (!wrapper || !activeBtn) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setIndicator({
      left: btnRect.left - wrapperRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  }, [activeAnchor]);

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
        {/* Wrapper relativo que recebe o indicador deslizante */}
        <div ref={itemsWrapperRef} className="relative flex items-center gap-2">
          {/* Indicador que desliza atrás do botão ativo */}
          <div
            className="absolute top-0 h-full bg-white/15 rounded-xl shadow-sm pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />

          {navItems.map(({ anchor, label }) => {
            const isActive = activeAnchor === anchor;

            return (
              <button
                key={anchor}
                ref={(el) => {
                  buttonRefs.current[anchor] = el;
                }}
                onClick={() => handleAnchorClick(anchor)}
                className={`relative z-10 px-4 py-2 rounded-xl font-medium transition-colors duration-150 cursor-pointer text-white
                  ${isActive ? "font-bold" : "hover:bg-white/10"}`}
              >
                {label}
              </button>
            );
          })}
        </div>

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