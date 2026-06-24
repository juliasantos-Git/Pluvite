"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/banco";
import {
  User,
  Accessibility,
  MapPin,
  Save,
  Loader2,
  Pencil,
  X,
} from "lucide-react";

export default function PerfilCidadao() {
  const [carregando, setCarregando] = useState(false);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [editandoBloco, setEditandoBloco] = useState<
    "pessoais" | "endereco" | null
  >(null);

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
  });

  // CARREGAMENTO DOS DADOS DO USUÁRIO DO SUPABASE
  useEffect(() => {
    let ativo = true;

    async function carregarPerfil(authUser: any) {
      try {
        // 1. Identifica o nome vindo de qualquer provedor (E-mail/Senha, Google, Facebook)
        const nomeDoCadastro =
          authUser.user_metadata?.nome_completo ||
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "Usuário";

        // 2. Identifica se existe uma foto vinda do Google/Facebook
        const fotoDoProvedor =
          authUser.user_metadata?.avatar_url || "/PluviteIcon.jpg";
        const emailDoCadastro = authUser.email || "";

        if (ativo) {
          setPerfil((prev) => ({
            ...prev,
            email: emailDoCadastro,
            nome_completo: nomeDoCadastro,
            avatar_url: fotoDoProvedor, // Define a foto padrão como a do Google (se houver)
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
            telefone: data.telefone || "",
            data_nascimento: data.data_nascimento || "",
            cidade: data.cidade || "",
            bairro: data.bairro || "",
            cep: data.cep || "",
            pcd: data.pcd ?? false,
            // Se já tiver foto no seu banco local (tabela cidadao), usa ela, senão mantém a do provedor
            avatar_url: data.avatar_url || fotoDoProvedor,
            tipo_deficiencia: data.tipo_deficiencia || "Nenhuma",
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

  // CONTROLE DOS INPUTS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

      // "email" precisa ir junto pq a coluna é NOT NULL no banco
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
  const salvarDados = async (bloco: "pessoais" | "endereco") => {
    setCarregando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const dadosParaSalvar = {
        auth_id: user.id,
        email: user.email, // NOT NULL no banco — precisa ir sempre
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

  return (
    <main className="w-full mt-15 bg-slate-50 font-sans antialiased p-4 sm:p-6 md:p-8 h-[calc(100vh-68px)] overflow-hiden relative">
      {/* Elementos visuais de fundo */}
      <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#0f35a0]/8 rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0f35a0]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-5 right-1/3 w-28 h-28 bg-[#0f35a0]/3 rounded-full blur-md pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#0f35a0]/8 rounded-full blur-sm pointer-events-none" />
      <div className="absolute top-8 right-5 w-16 h-16 bg-[#0f35a0]/6 rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-5 right-1/3 w-28 h-28 bg-[#0f35a0]/3 rounded-full blur-md pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="border-b border-slate-200/60 pb-4">
          <h1 className="text-2xl font-bold text-[#091f75] tracking-tight">
            Meu Perfil
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CARTÃO LATERAL DE EXIBIÇÃO DE AVATAR */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-between min-h-[455px]">
            <div className="w-full flex flex-col items-center text-center space-y-4">
              <div className="relative mt-2">
                <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-slate-50 shadow-inner overflow-hidden flex items-center justify-center text-[#091f75] text-4xl font-black select-none">
                  {perfil.avatar_url ? (
                    <img
                      src={perfil.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : perfil.nome_completo ? (
                    perfil.nome_completo.charAt(0).toUpperCase()
                  ) : (
                    "P"
                  )}
                </div>

                <label
                  htmlFor="input-avatar"
                  className="absolute bottom-0 right-1 bg-[#091f75] hover:bg-[#051450] text-white p-2 rounded-full shadow-md cursor-pointer transition-all border border-white flex items-center justify-center active:scale-90 z-20"
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
              <span className="inline-flex px-3 py-1 bg-blue-50 text-[#091f75] text-[11px] font-bold rounded-full border border-blue-100/70">
                Taubaté
              </span>
            </div>

            <div className="w-full space-y-2.5 pt-4 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-medium">Alertas em tempo real</span>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ativos
                </div>
              </div>
            </div>
          </div>

          {/* FORMULÁRIOS DA DIREITA */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[#091f75] uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Informações Pessoais
                </h3>
                <div className="flex gap-1">
                  {editandoBloco === "pessoais" ? (
                    <>
                      <button
                        onClick={() => setEditandoBloco(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                      <button
                        onClick={() => salvarDados("pessoais")}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 cursor-pointer"
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
                      onClick={() => setEditandoBloco("pessoais")}
                      className="p-1.5 text-slate-400 hover:text-[#091f75] rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>

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
                    className="bg-slate-50/60 p-3 rounded-xl border border-slate-100"
                  >
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                      {f.label}
                    </span>
                    {editandoBloco === "pessoais" ? (
                      <input
                        type={f.type}
                        name={f.name}
                        placeholder={f.placeholder}
                        value={(perfil as any)[f.name] || ""}
                        onChange={handleChange}
                        className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1 border border-slate-200 outline-none mt-1"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-700 block truncate">
                        {(perfil as any)[f.name] || "Não informado"}
                      </span>
                    )}
                  </div>
                ))}
                <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 opacity-70">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                    E-mail (Não alterável)
                  </span>
                  <span className="text-xs font-semibold text-slate-700 block truncate">
                    {perfil.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[#091f75] uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} /> Endereço & Acessibilidade
                </h3>
                <div className="flex gap-1">
                  {editandoBloco === "endereco" ? (
                    <>
                      <button
                        onClick={() => setEditandoBloco(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                      <button
                        onClick={() => salvarDados("endereco")}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 cursor-pointer"
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
                      onClick={() => setEditandoBloco("endereco")}
                      className="p-1.5 text-slate-400 hover:text-[#091f75] rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-3.5">
                {[
                  { label: "Cidade", name: "cidade" },
                  { label: "Bairro", name: "bairro" },
                  { label: "CEP", name: "cep" },
                ].map((f) => (
                  <div
                    key={f.name}
                    className="bg-slate-50/60 p-3 rounded-xl border border-slate-100"
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
                        className="w-full bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1 border border-slate-200 outline-none mt-1"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-700 block truncate">
                        {(perfil as any)[f.name] || "Não informado"}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="w-full">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide mb-0.5">
                    Condição PCD
                  </span>
                  {editandoBloco === "endereco" ? (
                    <div className="flex items-center gap-4 mt-1">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perfil.pcd}
                          onChange={(e) =>
                            setPerfil((prev) => ({
                              ...prev,
                              pcd: e.target.checked,
                            }))
                          }
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
                          className="flex-1 bg-white text-xs font-semibold text-slate-700 rounded-lg px-2 py-1 border border-slate-200 outline-none"
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 block">
                      {perfil.pcd
                        ? `Possui deficiência (${perfil.tipo_deficiencia})`
                        : "Não possui deficiência"}
                    </span>
                  )}
                </div>
                <Accessibility size={18} className="text-[#091f75]/80 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
