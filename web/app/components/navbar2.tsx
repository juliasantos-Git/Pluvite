"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/banco";
import { UserRound, Map, CloudSun, Route, MessageSquareWarning } from "lucide-react";

export default function Navbar2() {
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string>("/PluviteIcon.jpg");
  const [nome, setNome] = useState<string>("");

  // CONTROLE DE SESSÃO E CARREGAMENTO DE DADOS DO USUÁRIO
  useEffect(() => {
    async function carregarDadosNavbar() {
      // Usamos getUser para garantir a segurança dos dados da sessão atual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Pega os dados direto do provedor de login (Google, Facebook ou Cadastro)
      const nomeDoProvedor = 
        user.user_metadata?.nome_completo || 
        user.user_metadata?.full_name || 
        user.user_metadata?.name || 
        "";

      const fotoDoProvedor = user.user_metadata?.avatar_url || "/PluviteIcon.jpg";

      // Define os estados iniciais baseados no Google/Sessão
      if (nomeDoProvedor) setNome(nomeDoProvedor);
      if (fotoDoProvedor) setAvatarUrl(fotoDoProvedor);

      // 2. Tenta buscar dados customizados do banco de dados (tabela cidadao)
      const { data, error } = await supabase
        .from("cidadao")
        .select("avatar_url, nome_completo")
        .eq("auth_id", user.id)
        .maybeSingle(); // Usar maybeSingle evita estourar erros caso o registro não exista ainda

      // Se encontrar dados salvos localmente, eles substituem os do Google (caso o usuário tenha editado o perfil)
      if (data && !error) {
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.nome_completo) setNome(data.nome_completo);
      }
    }

    carregarDadosNavbar();

    // ESCUTA DE ALTERAÇÕES NO STATUS DE AUTENTICAÇÃO
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        carregarDadosNavbar();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // CONFIGURAÇÃO DOS ITENS DE NAVEGAÇÃO
  const navItems = [
    { href: "/Mapa", label: "Mapa", icon: <Map size={18} /> },
    { href: "/Clima2", label: "Clima", icon: <CloudSun size={18} /> },
    { href: "/Rotas", label: "Rotas", icon: <Route size={18} /> },
    { href: "/Feed", label: "Feed", icon: <MessageSquareWarning size={18} /> },
  ];

  return (
    <nav
      className="fixed top-0 pt-3 right-0 left-0 z-[10000] shadow-[0_2px_10px_rgba(0,0,0,0.15)] w-full pb-3 flex items-center justify-between"
      style={{ backgroundColor: "#091c4b" }}
    >
      {/* LOGOTIPO E LINK HOME */}
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

      {/* LINKS DE NAVEGAÇÃO PRINCIPAL */}
      <div className="flex items-center gap-2 mr-10">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-150
              text-white hover:bg-white/15 hover:text-white cursor-pointer"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}

        {/* DIVISOR VISUAL */}
        <div className="w-[1px] h-6 bg-white/25 mx-3" />

        {/* BOTÃO E AVATAR DO PERFIL */}
        <Link
          href="/perfil"
          className="flex items-center gap-2 text-white hover:bg-white/25 transition-all duration-150 px-5 py-2 rounded-xl font-semibold tracking-wide active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 overflow-hidden flex items-center justify-center text-white text-xs font-bold select-none shrink-0">
            {avatarUrl && avatarUrl !== "/PluviteIcon.jpg" ? (
              <img
                src={avatarUrl}
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            ) : nome ? (
              nome.charAt(0).toUpperCase()
            ) : (
              <UserRound size={14} />
            )}
          </div>
          Perfil
        </Link>
      </div>
    </nav>
  );
}