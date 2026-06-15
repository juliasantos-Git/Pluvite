"use client";
import { supabase } from "@/app/lib/banco";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CadastroCidadao() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    setCarregando(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });
      if (error) { alert("Erro ao criar conta: " + error.message); return; }
      const { error: erroPerfil } = await supabase.from("cidadao").insert({
        auth_id: data.user?.id,
        nome_completo: formData.nome,
        email: formData.email,
      });
      if (erroPerfil) { alert("Erro ao salvar dados: " + erroPerfil.message); return; }
      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Erro inesperado:", error);
      alert("Algo deu errado, tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#1447c4] px-6 py-12 relative overflow-hidden">

      {/* Bolhas no fundo da página */}
      <div className="absolute bottom-[-80px] left-[-40px] w-[380px] h-[380px] rounded-full bg-[#0f2d7a] z-10" />
      <div className="absolute bottom-[60px] left-[60px] w-[220px] h-[220px] rounded-full bg-[#1a3d9e] z-10" />
      <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full bg-[#0f2d7a]/60 z-10" />

      {/* Card */}
      <div className="relative z-20 w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl min-h-[560px]">

        {/* LADO ESQUERDO — Azul transparente */}
        <div className="hidden md:flex md:w-[42%] flex-col justify-between p-10 relative overflow-visible bg-transparent">

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <img src="/PluviteIcon.jpg" alt="Logo" className="w-9 h-9 rounded-xl select-none" draggable="false" />
              <span className="text-white font-bold text-base tracking-wide">Pluvite</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Bem-vindo!
            </h2>
            <p className="text-blue-100 text-xs leading-relaxed max-w-[200px]">
              Junte-se à nossa rede colaborativa de monitoramento pluvial e proteja sua cidade com dados reais.
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-blue-200 text-xs mb-3">Já possui uma conta?</p>
            <Link href="/login">
              <button className="bg-white text-[#1447c4] font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                Entrar agora
              </button>
            </Link>
          </div>
        </div>

        {/* LADO DIREITO — Card branco */}
        <div className="flex-1 bg-white rounded-3xl flex flex-col justify-center px-8 py-10 md:px-10 relative overflow-hidden">

          {/* Bolha no canto inferior direito do card */}
          <div className="absolute bottom-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-[#0f2d7a] z-0" />

          <div className="relative z-10">
            {/* Logo mobile */}
            <div className="flex md:hidden items-center gap-3 mb-8">
              <img src="/PluviteIcon.jpg" alt="Logo" className="w-8 h-8 rounded-xl" draggable="false" />
              <span className="text-[#1447c4] font-bold text-base">Pluvite</span>
            </div>

            <h1 className="text-2xl font-extrabold text-[#0f172a] mb-1">Criar Conta</h1>
            <p className="text-slate-400 text-xs mb-7">Preencha os campos para se cadastrar.</p>

            {/* Botões sociais */}
            <div className="flex flex-col gap-3 mb-5">
              <button type="button" className="h-11 w-full bg-[#1877f2] rounded-xl text-white text-sm font-semibold hover:bg-[#1565d8] transition-all cursor-pointer">
                Continuar com o Facebook
              </button>
              <button type="button" className="h-11 w-full bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
                Continuar com o Google
              </button>
            </div>

            {/* Divisor */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 font-semibold tracking-widest">OU</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1447c4] focus:ring-2 focus:ring-[#1447c4]/10 outline-none transition-all"
              />
              <input
                type="email"
                required
                placeholder="E-mail institucional ou pessoal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1447c4] focus:ring-2 focus:ring-[#1447c4]/10 outline-none transition-all"
              />
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  placeholder="Criar uma senha"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1447c4] focus:ring-2 focus:ring-[#1447c4]/10 outline-none transition-all w-full"
                />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1447c4] transition-colors">
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={mostrarConfirmar ? "text" : "password"}
                  required
                  placeholder="Confirmar senha"
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                  className="h-11 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1447c4] focus:ring-2 focus:ring-[#1447c4]/10 outline-none transition-all w-full"
                />
                <button type="button" onClick={() => setMostrarConfirmar(!mostrarConfirmar)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1447c4] transition-colors">
                  {mostrarConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="h-11 bg-[#1447c4] rounded-xl text-white text-sm font-bold tracking-wide hover:bg-[#1e3a8a] transition-all duration-200 cursor-pointer active:scale-95 mt-1 shadow-lg shadow-blue-500/20 disabled:opacity-60"
              >
                {carregando ? "Cadastrando..." : "Criar Conta"}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-5">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-[#1447c4] font-semibold hover:underline">
                Entrar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}