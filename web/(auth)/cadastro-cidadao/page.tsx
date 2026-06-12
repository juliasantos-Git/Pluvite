"use client";
import { supabase } from "@/app/lib/banco";
import React, { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Fingerprint,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NuvensBackground from "@/app/components/NuvensBackground";

export default function CadastroCidadao() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    cidade: "",
  });

  const [cpfDisplay, setCpfDisplay] = useState("");
  const [telefoneDisplay, setTelefoneDisplay] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const formatarCPF = (valor: string) => {
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatarTelefone = (valor: string) => {
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    return nums
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (error) {
        alert("Erro ao criar conta: " + error.message);
        return;
      }

      const { error: erroPerfil } = await supabase.from("cidadao").insert({
        auth_id: data.user?.id,
        nome_completo: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        cidade: formData.cidade,
      });

      if (erroPerfil) {
        alert("Erro ao salvar dados: " + erroPerfil.message);
        return;
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Erro inesperado:", error);
      alert("Algo deu errado, tente novamente.");
    }
  };

  return (
    <main className="relative h-screen w-full flex overflow-hidden">

      {/* LADO ESQUERDO — Azul com nuvens e informações */}
      <div className="relative hidden md:flex md:w-1/2 flex-col justify-between bg-[#256ffe] p-12 text-white overflow-hidden">

        {/* Nuvens só no lado esquerdo */}
        <NuvensBackground />

        {/* Conteúdo sobre as nuvens */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/15">
            <Activity size={16} className="animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">Plataforma Pluvite</span>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Crie sua<br />Conta
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed font-medium opacity-90 max-w-xs">
              Junte-se à nossa rede colaborativa de monitoramento. Receba notificações preventivas e informe ocorrências na sua região instantaneamente.
            </p>
          </div>
        </div>

        {/* Rodapé do lado esquerdo */}
        <div className="relative z-10 pt-6 border-t border-white/10">
          <p className="text-xs text-blue-200 font-medium mb-3">Já possui cadastro?</p>
          <Link href="/login">
            <button className="bg-white text-[#256ffe] font-bold text-sm py-3 px-6 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer shadow-md">
              Acessar minha Conta
            </button>
          </Link>
        </div>
      </div>

      {/* LADO DIREITO — Branco com formulário */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 md:px-16 overflow-y-auto">

        {/* Mobile: badge visível só em telas pequenas */}
        <div className="flex md:hidden items-center gap-2 bg-[#256ffe]/10 w-fit px-4 py-1.5 rounded-full mb-6">
          <Activity size={14} className="text-[#256ffe] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-[#256ffe]">Plataforma Pluvite</span>
        </div>

        {/* Card do formulário */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 p-8 flex flex-col items-center">

          {/* Logo */}
          <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 mb-4">
            <img
              src="/PluviteIcon.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-lg select-none"
              draggable="false"
            />
          </div>

          <h1 className="font-bold tracking-tight text-2xl text-blue-950 pb-6 font-sans">
            Cadastrar Cidadão
          </h1>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {/* Nome Completo */}
            <div className="relative flex items-center group">
              <input
                type="text"
                required
                placeholder="Nome Completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-zinc-100 text-sm rounded-xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
              />
              <UserRound
                className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors"
                size={18}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Email */}
              <div className="relative flex-[5] flex items-center group">
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-100 text-sm rounded-xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
                />
                <Mail
                  className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors"
                  size={18}
                />
              </div>

              {/* Senha */}
              <div className="relative flex-[4] flex items-center group">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="bg-zinc-100 text-sm rounded-xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] hover:text-[#256ffe] transition-colors cursor-pointer"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* CPF */}
              <div className="flex-1 relative flex items-center group">
                <input
                  type="text"
                  required
                  placeholder="CPF"
                  value={cpfDisplay}
                  onChange={(e) => {
                    const nums = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setFormData({ ...formData, cpf: nums });
                    setCpfDisplay(formatarCPF(e.target.value));
                  }}
                  className="bg-zinc-100 text-sm rounded-xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
                />
                <Fingerprint
                  className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors"
                  size={16}
                />
              </div>

              {/* Telefone */}
              <div className="flex-1 relative flex items-center group">
                <input
                  type="text"
                  required
                  placeholder="Telefone"
                  value={telefoneDisplay}
                  onChange={(e) => {
                    const nums = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setFormData({ ...formData, telefone: nums });
                    setTelefoneDisplay(formatarTelefone(e.target.value));
                  }}
                  className="bg-zinc-100 text-sm rounded-xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
                />
                <Phone
                  className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors"
                  size={16}
                />
              </div>
            </div>

            {/* Cidade */}
            <div className="relative flex items-center group">
              <input
                type="text"
                required
                placeholder="Sua Cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="bg-zinc-100 text-sm rounded-xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
              />
              <MapPin
                className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors"
                size={18}
              />
            </div>

            <button
              type="submit"
              className="bg-[#256ffe] mt-6 p-3.5 w-full rounded-xl text-white text-sm font-bold tracking-wide hover:bg-[#1a56cc] transition-all duration-200 cursor-pointer active:scale-95 shadow-lg shadow-blue-500/10"
            >
              Finalizar Cadastro
            </button>
          </form>

          {/* Link de login visível só no mobile */}
          <p className="flex md:hidden mt-6 text-xs text-blue-900/50 font-medium">
            Já possui cadastro?{" "}
            <Link href="/login" className="text-[#256ffe] font-bold ml-1 hover:underline">
              Entrar
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}