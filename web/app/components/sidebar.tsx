"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/banco";
import {
  Map,
  CloudSun,
  Route,
  MessageSquareWarning,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// Itens de navegação sincronizados com a Navbar
const navItems = [
  { href: "/Mapa", label: "Mapa", icon: Map },
  { href: "/Clima2", label: "Clima", icon: CloudSun },
  { href: "/Rotas", label: "Rotas", icon: Route },
  { href: "/Feed", label: "Feed", icon: MessageSquareWarning },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  // Estados do usuário obtidos via Supabase
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/PluviteIcon.jpg");
  const [nome, setNome] = useState<string>("");

  // Lógica de Autenticação e Busca de Dados do Supabase
  useEffect(() => {
    async function carregarDadosSidebar() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setUser(null);
        return;
      }

      setUser(currentUser);

      // 1. Dados iniciais do provedor de login (Google, Facebook ou cadastro básico)
      const nomeDoProvedor =
        currentUser.user_metadata?.nome_completo ||
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        "";

      const fotoDoProvedor =
        currentUser.user_metadata?.avatar_url || "/PluviteIcon.jpg";

      if (nomeDoProvedor) setNome(nomeDoProvedor);
      if (fotoDoProvedor) setAvatarUrl(fotoDoProvedor);

      // 2. Busca dados customizados da tabela 'cidadao' se existirem
      const { data, error } = await supabase
        .from("cidadao")
        .select("avatar_url, nome_completo")
        .eq("auth_id", currentUser.id)
        .maybeSingle();

      if (data && !error) {
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.nome_completo) setNome(data.nome_completo);
      }
    }

    carregarDadosSidebar();

    // Listener para mudanças de login/logout/update
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          carregarDadosSidebar();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setNome("");
          setAvatarUrl("/PluviteIcon.jpg");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <aside
      className="fixed top-0 left-0 h-screen z-[100] flex flex-col transition-all duration-300 ease-in-out shadow-[2px_0_10px_rgba(0,0,0,0.15)]"
      style={{
        width: expanded ? "240px" : "72px",
        backgroundColor: "#091c4b", // Mesma cor da Navbar
      }}
    >
      {/* Topo / Logotipo + Botão Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 overflow-hidden min-h-[73px]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <img
            src="/PluviteIcon.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
          />
          {expanded && (
            <span className="text-white font-bold text-xl tracking-tight whitespace-nowrap animate-in fade-in duration-300">
              PLUVITE
            </span>
          )}
        </Link>

        {/* Botão de recolher (visível quando expandido) */}
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="text-white hover:bg-white/15 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Recolher menu"
          >
            <PanelLeftClose size={22} />
          </button>
        )}
      </div>

      {/* Botão de expandir (visível no topo quando recolhido) */}
      {!expanded && (
        <div className="flex justify-center my-3">
          <button
            onClick={() => setExpanded(true)}
            className="text-white hover:bg-white/15 p-2 rounded-xl transition-colors cursor-pointer"
            title="Expandir menu"
          >
            <PanelLeftOpen size={24} />
          </button>
        </div>
      )}

      {/* Navegação Principal */}
      <nav className="flex flex-col gap-1 p-3 flex-1 mt-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-150 overflow-hidden group text-white hover:bg-white/15 cursor-pointer"
              style={{
                backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
              }}
            >
              <Icon
                size={22}
                className="flex-shrink-0"
                style={{ color: active ? "white" : "rgba(255,255,255,0.75)" }}
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

      {/* Rodapé - Estado de Login / Perfil */}
      <div className="p-3 border-t border-white/10 flex justify-center">
        {user ? (
          /* USUÁRIO LOGADO */
          <Link
            href="/perfil"
            className="flex items-center gap-3 w-full px-2 py-2 rounded-xl overflow-hidden transition-all duration-150 hover:bg-white/15 text-white active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold select-none">
              {avatarUrl && avatarUrl !== "/PluviteIcon.jpg" ? (
                <img
                  src={avatarUrl}
                  alt="Foto do perfil"
                  className="w-full h-full object-cover"
                />
              ) : nome ? (
                nome.charAt(0).toUpperCase()
              ) : (
                <UserRound size={16} />
              )}
            </div>

            {expanded && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
                <span className="text-sm font-semibold truncate">
                  {nome || "Meu Perfil"}
                </span>
                <span className="text-xs text-white/60 truncate">Ver perfil</span>
              </div>
            )}
          </Link>
        ) : (
          /* USUÁRIO NÃO LOGADO */
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-white bg-white/15 border border-white/30 hover:bg-white/25 transition-all duration-150 rounded-xl font-semibold tracking-wide active:scale-95 whitespace-nowrap"
            style={{
              width: expanded ? "100%" : "44px",
              height: "44px",
              padding: expanded ? "0 20px" : "0",
            }}
          >
            <UserRound size={20} className="flex-shrink-0" />
            {expanded && (
              <span className="animate-in fade-in duration-300 text-sm">Entrar</span>
            )}
          </Link>
        )}
      </div>
    </aside>
  );
}