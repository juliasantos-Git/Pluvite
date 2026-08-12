"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/banco";
import {
  User,
  Accessibility,
  MapPin,
  Save,
  Loader2,
  Pencil,
  X,
  LogOut,
  Bell,
  Shield,
  HeartPulse,
  Phone,
} from "lucide-react";

type Secao = "dados" | "emergencia" | "notificacoes" | "seguranca" | "acessibilidade";
type Bloco = "pessoais" | "endereco" | "medico" | "contatoEmergencia" | null;

export default function PerfilCidadao() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [editandoBloco, setEditandoBloco] = useState<Bloco>(null);
  const [secaoAtiva, setSecaoAtiva] = useState<Secao>("dados");
  const [hoverItem, setHoverItem] = useState<Secao | null>(null);

  const [perfil, setPerfil] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    data_nascimento: "",
    cidade: "",
    bairro: "",
    cep: "",
    pcd: false,
    tipo_deficiencia: "Nenhuma",
    avatar_url: "/perfil.png",
    // Dados de emergência
    tipo_sanguineo: "",
    alergias: "",
    condicoes_medicas: "",
    medicamentos_uso: "",
    contato_emergencia_nome: "",
    contato_emergencia_telefone: "",
    contato_emergencia_parentesco: "",
    // Preferências de notificações
    notif_chuva_forte: true,
    notif_deslizamento: true,
    notif_email: true,
    notif_push: true,
  });

  // CARREGAMENTO DOS DADOS DO USUÁRIO DO SUPABASE
  useEffect(() => {
    let ativo = true;

    async function carregarPerfil(authUser: any) {
      try {
        const nomeDoCadastro =
          authUser.user_metadata?.nome_completo ||
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "Usuário";

        const fotoDoProvedor =
          authUser.user_metadata?.avatar_url || "/PluviteIcon.jpg";
        const emailDoCadastro = authUser.email || "";

        if (ativo) {
          setPerfil((prev) => ({
            ...prev,
            email: emailDoCadastro,
            nome_completo: nomeDoCadastro,
            avatar_url: fotoDoProvedor,
          }));
        }

        const { data, error } = await supabase
          .from("cidadao")
          .select("*")
          .eq("auth_id", authUser.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          return;
        }

        if (data && ativo) {
          setPerfil((prev) => ({
            ...prev,
            nome_completo: data.nome_completo || nomeDoCadastro,
            telefone: formatarTelefone(data.telefone || ""),
            data_nascimento: data.data_nascimento || "",
            cidade: data.cidade || "",
            bairro: data.bairro || "",
            cep: data.cep || "",
            pcd: data.pcd ?? false,
            avatar_url: data.avatar_url || fotoDoProvedor,
            tipo_deficiencia: data.tipo_deficiencia || "Nenhuma",
            tipo_sanguineo: data.tipo_sanguineo || "",
            alergias: data.alergias || "",
            condicoes_medicas: data.condicoes_medicas || "",
            medicamentos_uso: data.medicamentos_uso || "",
            contato_emergencia_nome: data.contato_emergencia_nome || "",
            contato_emergencia_telefone: formatarTelefone(
              data.contato_emergencia_telefone || "",
            ),
            contato_emergencia_parentesco: data.contato_emergencia_parentesco || "",
            notif_chuva_forte: data.notif_chuva_forte ?? true,
            notif_deslizamento: data.notif_deslizamento ?? true,
            notif_email: data.notif_email ?? true,
            notif_push: data.notif_push ?? true,
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) carregarPerfil(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) carregarPerfil(session.user);
      },
    );

    return () => {
      ativo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // FORMATA O TELEFONE NO PADRÃO (00) 00000-0000 ENQUANTO O USUÁRIO DIGITA
  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length === 0) return "";
    if (numeros.length <= 2) return numeros.replace(/^(\d*)/, "($1");
    if (numeros.length <= 6)
      return numeros.replace(/^(\d{2})(\d*)/, "($1) $2");
    if (numeros.length <= 10)
      return numeros.replace(/^(\d{2})(\d{4})(\d*)/, "($1) $2-$3");
    return numeros.replace(/^(\d{2})(\d{5})(\d*)/, "($1) $2-$3");
  }

  // CONTROLE DOS INPUTS (texto, textarea e select)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "telefone" || name === "contato_emergencia_telefone") {
      setPerfil((prev) => ({ ...prev, [name]: formatarTelefone(value) }));
      return;
    }

    setPerfil((prev) => ({ ...prev, [name]: value || "" }));
  };

  // PROCESSAMENTO DE UPLOAD E ATUALIZAÇÃO DA FOTO DE PERFIL
  const handleTrocarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const urlProvisoria = URL.createObjectURL(file);
    setPerfil((prev) => ({ ...prev, avatar_url: urlProvisoria }));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: upsertError } = await supabase.from("cidadao").upsert(
        {
          auth_id: user.id,
          email: user.email,
          avatar_url: publicUrl,
          nome_completo: perfil.nome_completo || "Usuário",
        },
        { onConflict: "auth_id" },
      );

      setPerfil((prev) => ({ ...prev, avatar_url: publicUrl }));
      alert("Foto de perfil salva com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar a foto:", error);
      alert("Erro ao enviar a imagem: " + error.message);
    }
  };

  // ENVIO DOS DADOS ATUALIZADOS PARA O BANCO DE DADOS
  const salvarDados = async (bloco: Bloco) => {
    setCarregando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const dadosParaSalvar = {
        auth_id: user.id,
        email: user.email,
        nome_completo: perfil.nome_completo || null,
        telefone: perfil.telefone || null,
        data_nascimento: perfil.data_nascimento ? perfil.data_nascimento : null,
        cidade: perfil.cidade || null,
        bairro: perfil.bairro || null,
        cep: perfil.cep || null,
        pcd: perfil.pcd,
        tipo_deficiencia: perfil.pcd
          ? perfil.tipo_deficiencia || "Nenhuma"
          : "Nenhuma",
        tipo_sanguineo: perfil.tipo_sanguineo || null,
        alergias: perfil.alergias || null,
        condicoes_medicas: perfil.condicoes_medicas || null,
        medicamentos_uso: perfil.medicamentos_uso || null,
        contato_emergencia_nome: perfil.contato_emergencia_nome || null,
        contato_emergencia_telefone: perfil.contato_emergencia_telefone || null,
        contato_emergencia_parentesco: perfil.contato_emergencia_parentesco || null,
      };

      const { error } = await supabase
        .from("cidadao")
        .upsert(dadosParaSalvar, { onConflict: "auth_id" });

      if (error) throw error;

      setEditandoBloco(null);
      alert("Dados salvos com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar dados no Supabase:", err);
      alert("Erro ao salvar: " + err.message);
    } finally {
      setCarregando(false);
    }
  };

  // LIGA/DESLIGA E SALVA UMA PREFERÊNCIA DE NOTIFICAÇÃO IMEDIATAMENTE
  const alternarNotificacao = async (
    campo:
      | "notif_chuva_forte"
      | "notif_deslizamento"
      | "notif_email"
      | "notif_push",
  ) => {
    const novoValor = !perfil[campo];

    // Atualiza a tela na hora (otimista)
    setPerfil((prev) => ({ ...prev, [campo]: novoValor }));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("cidadao").upsert(
        {
          auth_id: user.id,
          email: user.email,
          nome_completo: perfil.nome_completo || "Usuário",
          [campo]: novoValor,
        },
        { onConflict: "auth_id" },
      );

      if (error) throw error;
    } catch (err: any) {
      console.error("Erro ao salvar notificação:", err);
      // Reverte se der erro
      setPerfil((prev) => ({ ...prev, [campo]: !novoValor }));
      alert("Erro ao salvar preferência: " + err.message);
    }
  };

  // ENCERRA A SESSÃO DO USUÁRIO E LIMPA OS DADOS LOCAIS
  const handleSair = async () => {
    setSaindo(true);
    try {
      await supabase.auth.signOut();

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      setPerfil({
        nome_completo: "",
        email: "",
        telefone: "",
        data_nascimento: "",
        cidade: "",
        bairro: "",
        cep: "",
        pcd: false,
        tipo_deficiencia: "Nenhuma",
        avatar_url: "/perfil.png",
        tipo_sanguineo: "",
        alergias: "",
        condicoes_medicas: "",
        medicamentos_uso: "",
        contato_emergencia_nome: "",
        contato_emergencia_telefone: "",
        contato_emergencia_parentesco: "",
        notif_chuva_forte: true,
        notif_deslizamento: true,
        notif_email: true,
        notif_push: true,
      });

      router.push("/");
    } catch (err: any) {
      console.error("Erro ao sair:", err);
      alert("Erro ao sair da conta: " + err.message);
    } finally {
      setSaindo(false);
    }
  };

  const itensSidebar: { id: Secao; label: string; icon: React.ReactNode }[] = [
    { id: "dados", label: "Meus Dados", icon: <User size={18} /> },
    { id: "emergencia", label: "Dados de Emergência", icon: <HeartPulse size={18} /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell size={18} /> },
    { id: "seguranca", label: "Segurança", icon: <Shield size={18} /> },
    {
      id: "acessibilidade",
      label: "Acessibilidade",
      icon: <Accessibility size={18} />,
    },
  ];

  // Pequeno cabeçalho de card reutilizável (estilo "Facebook > Configurações")
  const CardHeader = ({
    icon,
    title,
    bloco,
  }: {
    icon: React.ReactNode;
    title: string;
    bloco: Bloco;
  }) => (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#091f75]">
          {icon}
        </span>
        {title}
      </h3>
      <div className="flex gap-1">
        {editandoBloco === bloco ? (
          <>
            <button
              onClick={() => setEditandoBloco(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-all"
            >
              <X size={15} />
            </button>
            <button
              onClick={() => salvarDados(bloco)}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all"
            >
              {carregando ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditandoBloco(bloco)}
            className="p-1.5 text-slate-400 hover:text-[#091f75] rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <main className="w-full mt-15 bg-slate-50 font-sans antialiased p-4 sm:p-6 md:p-8 min-h-[calc(100vh-68px)] relative">
      {/* Elementos visuais de fundo (bem sutis) */}
      <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#0f35a0]/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0f35a0]/4 rounded-full blur-2xl pointer-events-none" />

      {/* SIDEBAR FLUTUANTE FIXA NA LATERAL ESQUERDA DA TELA */}
      <div className="hidden lg:flex flex-col gap-1 fixed left-8 top-1/2 -translate-y-1/2 z-40 bg-white rounded-2xl border border-slate-200 shadow-sm p-2 w-14">
        {itensSidebar.map((item) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => setHoverItem(item.id)}
            onMouseLeave={() => setHoverItem(null)}
          >
            <button
              onClick={() => setSecaoAtiva(item.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer ${
                secaoAtiva === item.id
                  ? "bg-blue-50 text-[#091f75]"
                  : "text-slate-400 hover:bg-slate-50 hover:text-[#091f75]"
              }`}
            >
              {item.icon}
            </button>

            {/* MENU SUSPENSO HORIZONTAL - aparece ao lado do ícone */}
            <div
              className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap bg-white border border-slate-200 shadow-md rounded-xl px-3.5 py-2 transition-all duration-200 origin-left ${
                hoverItem === item.id
                  ? "opacity-100 scale-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-x-1 pointer-events-none"
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  secaoAtiva === item.id ? "text-[#091f75]" : "text-slate-600"
                }`}
              >
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10 lg:pl-16">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            MEU PERFIL
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CARTÃO LATERAL DE EXIBIÇÃO DE AVATAR */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-between min-h-[455px]">
            <div className="w-full flex flex-col items-center text-center space-y-4">
              <div className="relative mt-2">
                <div className="w-32 h-32 rounded-full bg-blue-50 ring-4 ring-blue-50 overflow-hidden flex items-center justify-center text-[#091f75] text-4xl font-black select-none">
                  {perfil.avatar_url ? (
                    <img
                      src={perfil.avatar_url}
                      alt="Avatar"
                      className={
                        perfil.avatar_url === "/perfil.png"
                          ? "w-full h-full object-contain scale-160"
                          : "w-full h-full object-cover"
                      }
                    />
                  ) : perfil.nome_completo ? (
                    perfil.nome_completo.charAt(0).toUpperCase()
                  ) : (
                    "P"
                  )}
                </div>

                <label
                  htmlFor="input-avatar"
                  className="absolute bottom-0 right-1 bg-white hover:bg-slate-50 text-[#091f75] p-2 rounded-full shadow-md cursor-pointer transition-all border border-slate-200 flex items-center justify-center active:scale-90 z-20"
                >
                  <Pencil size={12} />
                </label>
                <input
                  id="input-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleTrocarFoto}
                  className="hidden"
                />
              </div>

              <div className="space-y-0.5 max-w-full px-2">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight truncate">
                  {perfil.nome_completo || "Usuário"}
                </h2>
                <p className="text-xs text-slate-400 font-medium truncate">
                  {perfil.email}
                </p>
              </div>
              <span className="inline-flex px-3 py-1 bg-blue-50 text-[#091f75] text-[11px] font-bold rounded-full border border-blue-100">
                Taubaté
              </span>
            </div>

            <div className="w-full space-y-2.5 pt-4 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-medium">Alertas em tempo real</span>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                  Ativos
                </div>
              </div>

              <button
                onClick={handleSair}
                disabled={saindo}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 rounded-xl py-2.5 transition-all cursor-pointer disabled:opacity-60"
              >
                {saindo ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LogOut size={14} />
                )}
                {saindo ? "Saindo..." : "Sair da conta"}
              </button>
            </div>
          </div>

          {/* CONTEÚDO DA DIREITA — MUDA CONFORME A SEÇÃO ATIVA */}
          <div className="lg:col-span-8 space-y-6">
            {secaoAtiva === "dados" && (
              <>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <CardHeader icon={<User size={14} />} title="Informações Pessoais" bloco="pessoais" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {[
                      {
                        label: "Nome Completo",
                        name: "nome_completo",
                        type: "text",
                      },
                      {
                        label: "Telefone / Celular",
                        name: "telefone",
                        type: "text",
                        placeholder: "(00) 00000-0000",
                      },
                      {
                        label: "Data de Nascimento",
                        name: "data_nascimento",
                        type: "date",
                      },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                          {f.label}
                        </span>
                        {editandoBloco === "pessoais" ? (
                          <input
                            type={f.type}
                            name={f.name}
                            placeholder={f.placeholder}
                            maxLength={f.name === "telefone" ? 15 : undefined}
                            value={(perfil as any)[f.name] || ""}
                            onChange={handleChange}
                            className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 focus:border-[#091f75]"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-700 block truncate">
                            {(perfil as any)[f.name] || "Não informado"}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 opacity-70">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                        E-mail (Não alterável)
                      </span>
                      <span className="text-xs font-semibold text-slate-700 block truncate">
                        {perfil.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <CardHeader icon={<MapPin size={14} />} title="Endereço" bloco="endereco" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {[
                      { label: "Cidade", name: "cidade" },
                      { label: "Bairro", name: "bairro" },
                      { label: "CEP", name: "cep" },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                          {f.label}
                        </span>
                        {editandoBloco === "endereco" ? (
                          <input
                            type="text"
                            name={f.name}
                            value={(perfil as any)[f.name] || ""}
                            onChange={handleChange}
                            className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 focus:border-[#091f75]"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-700 block truncate">
                            {(perfil as any)[f.name] || "Não informado"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {secaoAtiva === "emergencia" && (
              <>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                  <HeartPulse size={18} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Essas informações ficam guardadas no seu perfil e só são
                    usadas em caso de necessidade de resgate durante uma
                    emergência. Mantenha sempre atualizadas.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <CardHeader icon={<HeartPulse size={14} />} title="Informações Médicas" bloco="medico" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                        Tipo Sanguíneo
                      </span>
                      {editandoBloco === "medico" ? (
                        <select
                          name="tipo_sanguineo"
                          value={perfil.tipo_sanguineo || ""}
                          onChange={handleChange}
                          className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 focus:border-[#091f75]"
                        >
                          <option value="">Não sei / não informar</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                            (tipo) => (
                              <option key={tipo} value={tipo}>
                                {tipo}
                              </option>
                            ),
                          )}
                        </select>
                      ) : (
                        <span className="text-xs font-semibold text-slate-700 block truncate">
                          {perfil.tipo_sanguineo || "Não informado"}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                        Alergias
                      </span>
                      {editandoBloco === "medico" ? (
                        <textarea
                          name="alergias"
                          rows={2}
                          placeholder="Ex: alergia a dipirona, látex..."
                          value={perfil.alergias || ""}
                          onChange={handleChange}
                          className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 resize-none focus:border-[#091f75]"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700 block">
                          {perfil.alergias || "Não informado"}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                        Condições Médicas
                      </span>
                      {editandoBloco === "medico" ? (
                        <textarea
                          name="condicoes_medicas"
                          rows={2}
                          placeholder="Ex: diabetes, hipertensão, epilepsia..."
                          value={perfil.condicoes_medicas || ""}
                          onChange={handleChange}
                          className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 resize-none focus:border-[#091f75]"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700 block">
                          {perfil.condicoes_medicas || "Não informado"}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                        Medicamentos de Uso Contínuo
                      </span>
                      {editandoBloco === "medico" ? (
                        <textarea
                          name="medicamentos_uso"
                          rows={2}
                          placeholder="Ex: losartana 50mg, insulina..."
                          value={perfil.medicamentos_uso || ""}
                          onChange={handleChange}
                          className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 resize-none focus:border-[#091f75]"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-700 block">
                          {perfil.medicamentos_uso || "Não informado"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <CardHeader icon={<Phone size={14} />} title="Contato de Emergência" bloco="contatoEmergencia" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {[
                      { label: "Nome", name: "contato_emergencia_nome" },
                      {
                        label: "Telefone",
                        name: "contato_emergencia_telefone",
                        placeholder: "(00) 00000-0000",
                      },
                      {
                        label: "Parentesco / Relação",
                        name: "contato_emergencia_parentesco",
                        placeholder: "Ex: mãe, cônjuge, amigo...",
                      },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                          {f.label}
                        </span>
                        {editandoBloco === "contatoEmergencia" ? (
                          <input
                            type="text"
                            name={f.name}
                            placeholder={f.placeholder}
                            maxLength={
                              f.name === "contato_emergencia_telefone" ? 15 : undefined
                            }
                            value={(perfil as any)[f.name] || ""}
                            onChange={handleChange}
                            className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none mt-1 focus:border-[#091f75]"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-700 block truncate">
                            {(perfil as any)[f.name] || "Não informado"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {secaoAtiva === "notificacoes" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#091f75]">
                    <Bell size={14} />
                  </span>
                  Preferências de Notificações
                </h3>
                <div className="space-y-3">
                  {(
                    [
                      { label: "Alertas de chuva forte", campo: "notif_chuva_forte" },
                      {
                        label: "Alertas de risco de deslizamento",
                        campo: "notif_deslizamento",
                      },
                      { label: "Notificações por e-mail", campo: "notif_email" },
                      {
                        label: "Notificações push no navegador",
                        campo: "notif_push",
                      },
                    ] as const
                  ).map(({ label, campo }) => (
                    <div
                      key={campo}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      <span className="text-xs font-semibold text-slate-700">
                        {label}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perfil[campo]}
                          onChange={() => alternarNotificacao(campo)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-checked:bg-[#091f75] rounded-full transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {secaoAtiva === "seguranca" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#091f75]">
                    <Shield size={14} />
                  </span>
                  Segurança da Conta
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-1">
                      Senha
                    </span>
                    <button className="text-xs font-bold text-[#091f75] hover:underline cursor-pointer">
                      Alterar senha
                    </button>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-1">
                      Sessões ativas
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      Este dispositivo está conectado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Ainda sem lógica de troca de senha implementada — me avise
                    se quiser que eu conecte com o Supabase Auth.
                  </p>
                </div>
              </div>
            )}

            {secaoAtiva === "acessibilidade" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#091f75]">
                    <Accessibility size={14} />
                  </span>
                  Acessibilidade
                </h3>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="w-full">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                      Condição PCD
                    </span>
                    <div className="flex items-center gap-4 mt-1">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perfil.pcd}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setPerfil((prev) => ({
                              ...prev,
                              pcd: checked,
                              tipo_deficiencia: checked ? "" : "Nenhuma",
                            }));
                          }}
                          className="accent-[#091f75]"
                        />
                        Possuo Deficiência
                      </label>
                      {perfil.pcd && (
                        <input
                          type="text"
                          name="tipo_deficiencia"
                          placeholder="Qual deficiência?"
                          value={perfil.tipo_deficiencia || ""}
                          onChange={handleChange}
                          className="flex-1 bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1.5 border border-slate-200 outline-none"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => salvarDados("endereco")}
                  className="mt-3 flex items-center gap-2 text-xs font-bold text-[#091f75] hover:underline cursor-pointer"
                >
                  {carregando ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}