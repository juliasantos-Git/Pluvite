"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/banco";
import {
  User,
  Accessibility,
  MapPin,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  X,
} from "lucide-react";

export default function PerfilCidadao() {
  const [carregando, setCarregando] = useState(false);
  const [editandoBloco, setEditandoBloco] = useState<
    "pessoais" | "endereco" | null
  >(null);

  // Estado único para os dados do perfil
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
    avatar_url: "/PluviteIcon.jpg",
  });

  useEffect(() => {
    async function carregarPerfil() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setPerfil((prev) => ({ ...prev, email: user.email || "" }));

      const { data, error } = await supabase
        .from("cidadao")
        .select("*")
        .eq("auth_id", user.id)
        .single();
      if (data && !error)
        setPerfil((prev) => ({
          ...prev,
          ...data,
          tipo_deficiencia: data.tipo_deficiencia || "Nenhuma",
        }));
    }
    carregarPerfil();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleTrocarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      // Cria uma URL temporária para mostrar a foto na tela na mesma hora
      const urlProvisoria = URL.createObjectURL(file);
      setPerfil((prev) => ({ ...prev, avatar_url: urlProvisoria }));

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Atualiza o banco de dados com a nova URL
        await supabase
          .from("cidadao")
          .update({ avatar_url: urlProvisoria })
          .eq("auth_id", user.id);
      }
    } catch (error) {
      console.error("Erro ao salvar a foto:", error);
    }
  };

  const salvarDados = async (bloco: "pessoais" | "endereco") => {
    setCarregando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("cidadao")
        .update({
          nome_completo: perfil.nome_completo,
          telefone: perfil.telefone,
          data_nascimento: perfil.data_nascimento,
          cidade: perfil.cidade,
          bairro: perfil.bairro,
          cep: perfil.cep,
          pcd: perfil.pcd,
          tipo_deficiencia: perfil.pcd ? perfil.tipo_deficiencia : "Nenhuma",
        })
        .eq("auth_id", user.id);

      if (error) throw error;
      setEditandoBloco(null);
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="w-full mt-20 bg-slate-50 font-sans antialiased p-4 sm:p-6 md:p-8 h-[calc(100vh-68px)] overflow-y-auto">
      {/* Elementos visuais mantidos... */}
      <div className="absolute -top-[50px] -left-15 w-72 h-72 bg-[#1447f2]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#1447c4]/8 rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-[#1447c4]/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1447c4]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-[560px] w-32 h-32 bg-[#1447c4]/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#1447c4]/8 rounded-full blur-sm pointer-events-none" />
      <div className="absolute top-8 right-5 w-16 h-16 bg-[#1447f2]/6 rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-5 right-1/3 w-28 h-28 bg-[#1447c4]/3 rounded-full blur-md pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* CABEÇALHO */}
        <div className="border-b border-slate-200/60 pb-4">
          <h1 className="text-2xl font-bold text-[#091f75] tracking-tight">
            Meu Perfil
          </h1>
        </div>

        {/* GRID DO PAINEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUNA ESQUERDA: FOTO E COMPACTAÇÃO DE CONTEÚDO */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-between min-h-[455px]">
            <div className="w-full flex flex-col items-center text-center space-y-4">
              <div className="relative mt-2">
                {/* AVATAR COM DISPARADOR DE IMAGEM */}
                <div className="relative mt-2">
                  <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-slate-50 shadow-inner overflow-hidden flex items-center justify-center text-[#091f75] text-4xl font-black select-none">
                    {perfil.avatar_url &&
                    perfil.avatar_url !== "/PluviteIcon.jpg" ? (
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

                  {/* Botão do Lápis para trocar a foto */}
                  <label className="absolute bottom-0 right-1 bg-[#091f75] hover:bg-[#051450] text-white p-2 rounded-full shadow-md cursor-pointer transition-all border border-white flex items-center justify-center active:scale-90">
                    <Pencil size={12} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTrocarFoto} // Certifique-se de manter a função handleTrocarFoto no seu escopo
                      className="hidden"
                    />
                  </label>
                </div>
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

            {/* FIM DO ESPAÇO VAZIO: Widgets de status direto no card da foto */}
            <div className="w-full space-y-2.5 pt-4 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-medium">Alertas em tempo real</span>
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                  Ativos
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: BLOCOS DE DADOS COM LÁPIS INDIVIDUAL */}
          <div className="lg:col-span-8 space-y-6">
            {/* INFORMAÇÕES PESSOAIS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[#091f75] uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Informações Pessoais
                </h3>
                {editandoBloco === "pessoais" ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditandoBloco(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                    <button
                      onClick={() => salvarDados("pessoais")}
                      className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg cursor-pointer"
                    >
                      {carregando ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Save size={15} />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditandoBloco("pessoais")}
                    className="p-1.5 text-slate-400 hover:text-[#091f75] rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                )}
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
                        value={(perfil as any)[f.name]}
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

            {/* ENDEREÇO & ACESSIBILIDADE */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-[#091f75] uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} /> Endereço & Acessibilidade
                </h3>
                {editandoBloco === "endereco" ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditandoBloco(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                    <button
                      onClick={() => salvarDados("endereco")}
                      className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg cursor-pointer"
                    >
                      {carregando ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Save size={15} />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditandoBloco("endereco")}
                    className="p-1.5 text-slate-400 hover:text-[#091f75] rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                )}
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
                        value={(perfil as any)[f.name]}
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
                          value={perfil.tipo_deficiencia}
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