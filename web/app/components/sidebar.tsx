"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/banco";
import {
  AlertTriangle,
  Map,
  Rss,
  UserRound,
  LogOut,
  ChevronRight,
  Building2,
} from "lucide-react";

// Larguras da sidebar — usadas aqui e no padding-left do conteúdo da página
export const SIDEBAR_LARGURA_RECOLHIDA = 84;
export const SIDEBAR_LARGURA_EXPANDIDA = 256; // equivalente ao w-64

interface Navbar3Props {
  expandida: boolean;
  onToggle: (expandida: boolean) => void;
}

// Itens de menu por contexto: dentro de /Adm é a equipe Pluvite, dentro de
// /Prefeituras é a conta de uma prefeitura específica. O visual da sidebar
// é o mesmo nos dois — só muda o que aparece.
const navItemsAdmin = [
  { href: "/Adm", label: "Prefeituras", icon: Building2 },
  { href: "/Feed", label: "Feed", icon: Rss },
  { href: "/Mapa", label: "Mapa", icon: Map },
];

const navItemsServidor = [
  { href: "/Prefeituras", label: "Painel", icon: AlertTriangle },
  { href: "/Mapa", label: "Mapa", icon: Map },
  { href: "/Feed", label: "Feed", icon: Rss },
  { href: "/Perfil", label: "Perfil", icon: UserRound },
];

interface ContaLogada {
  nome: string;
  sigla: string;
}

export default function Navbar3({ expandida, onToggle }: Navbar3Props) {
  const pathname = usePathname();
  const router = useRouter();

  const ehAreaAdmin = pathname?.startsWith("/Adm");
  const navItems = ehAreaAdmin ? navItemsAdmin : navItemsServidor;
  const linkLogo = ehAreaAdmin ? "/Adm" : "/Prefeituras";

  const [conta, setConta] = useState<ContaLogada>({
    nome: ehAreaAdmin ? "Equipe Pluvite" : "Carregando...",
    sigla: ehAreaAdmin ? "ADMIN" : "",
  });

  useEffect(() => {
    const carregarConta = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (ehAreaAdmin) {
        const { data } = await supabase
          .from("admin")
          .select("nome_completo")
          .eq("auth_id", user.id)
          .maybeSingle();
        if (data) {
          setConta({ nome: data.nome_completo || "Equipe Pluvite", sigla: "ADMIN" });
        }
      } else {
        const { data } = await supabase
          .from("servidor")
          .select("nome_completo, municipio")
          .eq("auth_id", user.id)
          .maybeSingle();
        if (data) {
          setConta({
            nome: data.nome_completo || "Servidor",
            sigla: data.municipio || "",
          });
        }
      }
    };
    carregarConta();
  }, [ehAreaAdmin]);

  const handleSair = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-[10000] flex flex-col justify-between
        shadow-[2px_0_10px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out
        ${expandida ? "w-64" : "w-[84px]"}`}
      style={{ backgroundColor: "#091c4b" }}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center px-5 pt-6 pb-6">
          <Link href={linkLogo} className="flex items-center gap-3 min-w-0">
            <img
              src="/PluviteIcon.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-xl shadow-sm shrink-0"
            />
            {expandida && (
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap overflow-hidden">
                PLUVITE
              </span>
            )}
          </Link>
        </div>

        {/* Botão de recolher/expandir */}
        <button
          onClick={() => onToggle(!expandida)}
          className="flex items-center justify-center mx-auto mb-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          title={expandida ? "Recolher menu" : "Expandir menu"}
        >
          <ChevronRight
            size={16}
            className={`transition-transform duration-300 ${expandida ? "rotate-180" : ""}`}
          />
        </button>

        {/* Navegação */}
        <nav className="flex flex-col gap-1.5 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer text-white
                  ${expandida ? "" : "justify-center"}
                  ${isActive ? "bg-white/15 shadow-sm font-bold" : "hover:bg-white/10"}`}
              >
                <Icon size={18} className="shrink-0" />
                {expandida && (
                  <span className="whitespace-nowrap overflow-hidden">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé: conta logada + sair */}
      <div className="px-3 pb-6 flex flex-col gap-2 border-t border-white/10 pt-5">
        <div
          title={conta.nome}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 ${expandida ? "" : "justify-center"}`}
        >
          <UserRound size={18} className="text-white/70 shrink-0" />
          {expandida && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-xs font-bold text-white truncate">
                {conta.nome}
              </span>
              {conta.sigla && (
                <span className="text-[10px] font-semibold text-white/45 uppercase tracking-wider truncate">
                  {conta.sigla}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          title="Sair"
          onClick={handleSair}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white
            transition-all duration-150 font-bold text-sm cursor-pointer ${expandida ? "" : "justify-center"}`}
        >
          <LogOut size={18} className="shrink-0" />
          {expandida && <span className="whitespace-nowrap">Sair</span>}
        </button>
      </div>
    </aside>
  );
}