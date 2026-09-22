"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/banco";
import { Building2, Loader2, Plus, ShieldAlert, UserRound } from "lucide-react";
import Navbar3 from "../components/sidebar";

// Os 39 municípios do Vale do Paraíba e Litoral Norte — mesma lista usada no Feed
const CIDADES = [
  "Aparecida",
  "Arapeí",
  "Areias",
  "Bananal",
  "Caçapava",
  "Cachoeira Paulista",
  "Campos do Jordão",
  "Canas",
  "Caraguatatuba",
  "Cruzeiro",
  "Cunha",
  "Guaratinguetá",
  "Igaratá",
  "Ilhabela",
  "Jacareí",
  "Jambeiro",
  "Lagoinha",
  "Lavrinhas",
  "Lorena",
  "Monteiro Lobato",
  "Natividade da Serra",
  "Paraibuna",
  "Pindamonhangaba",
  "Piquete",
  "Potim",
  "Queluz",
  "Redenção da Serra",
  "Roseira",
  "Santa Branca",
  "Santo Antônio do Pinhal",
  "São Bento do Sapucaí",
  "São José do Barreiro",
  "São José dos Campos",
  "São Luiz do Paraitinga",
  "São Sebastião",
  "Silveiras",
  "Taubaté",
  "Tremembé",
  "Ubatuba",
] as const;

interface Servidor {
  id: string;
  nome_completo: string;
  email: string;
  municipio: string;
  criado_em: string;
}

type EstadoAcesso = "verificando" | "negado" | "autorizado";

export default function AdminServidoresPage() {
  const router = useRouter();

  // ───── VERIFICAÇÃO DE SESSÃO — precisa estar logado E cadastrado na tabela "admin" ─────
  const [estadoAcesso, setEstadoAcesso] = useState<EstadoAcesso>("verificando");
  const [mensagemNegado, setMensagemNegado] = useState("");

  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [municipio, setMunicipio] = useState("");

  // Estado da sidebar — mesmo padrão usado no painel da prefeitura, pra
  // manter a mesma navbar (Navbar3) e o mesmo comportamento de recolher/expandir.
  const [sidebarExpandida, setSidebarExpandida] = useState(false);

  useEffect(() => {
    verificarAcesso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obterTokenSessao = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const verificarAcesso = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const token = await obterTokenSessao();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const resposta = await fetch("/api/criar-servidor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resposta.status === 401) {
        router.replace("/login");
        return;
      }

      if (resposta.status === 403) {
        setEstadoAcesso("negado");
        setMensagemNegado(
          "Essa conta não tem acesso ao painel de administração da Pluvite.",
        );
        return;
      }

      if (!resposta.ok) {
        setEstadoAcesso("negado");
        setMensagemNegado("Não foi possível verificar seu acesso agora.");
        return;
      }

      setServidores(await resposta.json());
      setEstadoAcesso("autorizado");
      setCarregando(false);
    } catch (e) {
      setEstadoAcesso("negado");
      setMensagemNegado("Erro inesperado ao verificar seu acesso.");
    }
  };

  const carregarServidores = async () => {
    setCarregando(true);
    try {
      const token = await obterTokenSessao();
      if (!token) {
        router.replace("/login");
        return;
      }
      const resposta = await fetch("/api/criar-servidor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resposta.ok) {
        setServidores(await resposta.json());
      }
    } catch (e) {
      console.error("Erro ao carregar servidores:", e);
    } finally {
      setCarregando(false);
    }
  };

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !senha || !municipio) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      const token = await obterTokenSessao();
      if (!token) {
        router.replace("/login");
        return;
      }

      const resposta = await fetch("/api/criar-servidor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, senha, municipio }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.error || "Não foi possível criar a conta.");
        return;
      }

      setNome("");
      setEmail("");
      setSenha("");
      setMunicipio("");
      carregarServidores();
    } catch (e) {
      setErro("Erro inesperado ao criar a conta.");
    } finally {
      setSalvando(false);
    }
  };

  // ───── TELA DE CARREGANDO (verificando sessão) ─────
  if (estadoAcesso === "verificando") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#f4f5f7] p-4">
        <Loader2 size={24} className="animate-spin text-[#091f75]" />
      </main>
    );
  }

  // ───── TELA DE ACESSO NEGADO ─────
  if (estadoAcesso === "negado") {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-[#f4f5f7] p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert size={22} />
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Acesso restrito
          </h1>
          <p className="text-xs text-slate-500">{mensagemNegado}</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-[#091f75] hover:bg-[#0f2a8f] text-white text-sm font-bold py-2.5 rounded-xl transition cursor-pointer"
          >
            Voltar para o login
          </button>
        </div>
      </main>
    );
  }

  // ───── PAINEL (autorizado) ─────
  return (
    <div className="min-h-screen -mt-15 w-full font-sans text-slate-800 bg-[#f4f5f7]">
      <Navbar3 expandida={sidebarExpandida} onToggle={setSidebarExpandida} />

      {/* Mesmo padrão de padding-left do painel da prefeitura, pra o
          conteúdo ser empurrado (não coberto) quando a sidebar expande. */}
      <div
        className={`pt-8 pr-6 md:pr-10 pb-16 transition-all duration-300 ease-in-out ${
          sidebarExpandida ? "pl-64" : "pl-[84px]"
        }`}
      >
      <div className="max-w-3xl mx-auto px-6 md:px-4 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Contas de Servidor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cadastre o login de cada prefeitura. Cada conta só vê e recebe
            notificações das ocorrências do próprio município.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleCriar}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
        >
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Building2 size={16} className="text-[#091f75]" />
            Nova conta de servidor
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Nome
              </span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Prefeitura de Taubaté"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#091f75] focus:ring-2 focus:ring-[#091f75]/10"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Município
              </span>
              <select
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#091f75] focus:ring-2 focus:ring-[#091f75]/10"
              >
                <option value="">Selecione</option>
                {CIDADES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                E-mail de login
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prefeitura.taubate@pluvite.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#091f75] focus:ring-2 focus:ring-[#091f75]/10"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Senha inicial
              </span>
              <input
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#091f75] focus:ring-2 focus:ring-[#091f75]/10"
              />
            </div>
          </div>

          {erro && <p className="text-xs font-semibold text-red-600">{erro}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="flex items-center gap-2 bg-[#091f75] hover:bg-[#0f2a8f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-60"
          >
            {salvando ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}
            Criar conta
          </button>
        </form>

        {/* LISTA */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Servidores cadastrados
          </h2>

          {carregando ? (
            <p className="text-xs text-slate-400 font-medium">Carregando...</p>
          ) : servidores.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">
              Nenhuma conta de servidor cadastrada ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {servidores.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-[#091f75] flex items-center justify-center shrink-0">
                    <UserRound size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {s.nome_completo}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {s.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#091f75] bg-blue-50 px-2.5 py-1 rounded-md shrink-0">
                    {s.municipio}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}