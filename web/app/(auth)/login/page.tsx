"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/banco";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setCarregando(true);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert("E-mail ou senha incorretos!");
      setSenha("");
      return;
    }

    // Por enquanto todo login vai pra tela do cidadão
    router.push("/Mapa");
  } catch (error) {
    alert("Erro inesperado. Tente novamente.");
  } finally {
    setCarregando(false);
  }
};

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-8 md:p-12 font-sans antialiased relative overflow-hidden">
      {/* ── ELEMENTOS ARREDONDADOS / BOLHAS DE FUNDO ── */}
      <div className="absolute -top-[50px] -left-15 w-72 h-72 bg-[#0f35a0]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#0f35a0]/8 rounded-full pointer-events-none" />

      <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-[#0f35a0]/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0f35a0]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-[560px] w-32 h-32 bg-[#0f35a0]/5 rounded-full pointer-events-none" />

      <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#0f35a0]/8 rounded-full blur-sm pointer-events-none" />

      <div className="absolute top-8 right-5 w-16 h-16 bg-[#0f35a0]/6 rounded-full pointer-events-none z-0" />

      <div className="absolute bottom-5 right-1/3 w-28 h-28 bg-[#0f35a0]/3 rounded-full blur-md pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* ── LADO ESQUERDO: TEXTOS INFORMATIVOS ── */}
        <div className="text-slate-900 space-y-6 pr-0 md:pr-8 text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="text-5xl uppercase lg:text-6xl font-black tracking-tight leading-tight text-black">
            Plataforma
            <div className="flex flex-row">
              <img
                src="/pluvite-xl.png"
                alt="Pluvite"
                className="w-15 h-15 -ml-3 mt-2 -mr-2 rounded-xl select-none object-cover flex-row flex"
                draggable="false"
              />
              luvite
            </div>
          </h1>

          <p className="text-slate-700 text-base sm:text-lg max-w-md font-medium leading-relaxed">
            Monitore, previna e gerencie dados pluviais com precisão em tempo
            real. Apoiando a gestão pública e a segurança do cidadão.
          </p>

          <div className="hidden md:flex items-center gap-4 text-xs text-[#0f35a0] font-bold uppercase tracking-wider">
            <span>• Monitoramento Inteligente</span>
            <span>• Dados Precisos</span>
          </div>
        </div>

        {/* ── LADO DIREITO: CARD DE LOGIN DESTACADO ── */}
        <div className="flex justify-center md:justify-end w-full relative z-10">
          <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl shadow-slate-900/60 border border-slate-200 p-6 sm:p-8">
            <Link href="/">
              <img
                src="/PluviteIcon.jpg"
                alt="Pluvite Icon"
                className="absolute top-5 right-5 w-12 h-12 rounded-xl object-cover select-none cursor-pointer hover:opacity-90 transition-opacity"
                draggable="false"
              />
            </Link>
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800">
                Bem-vindo de volta!
              </h2>
              <p className="text-sm text-black mt-1">
                Insira suas credenciais para acessar a plataforma
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo: E-mail */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  disabled={carregando}
                  placeholder="E-mail institucional ou pessoal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 text-sm text-black rounded-xl px-4 py-3 border border-slate-200 focus:border-blue-900 focus:bg-white outline-none placeholder:text-slate-500 disabled:opacity-60"
                />
              </div>

              {/* Campo: Senha */}
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    required
                    disabled={carregando}
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full bg-slate-50 text-sm text-black rounded-xl px-4 py-3 pr-12 border border-slate-200 focus:border-blue-900 focus:bg-white outline-none placeholder:text-slate-500 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={carregando}
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={
                      mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="pt-0.5 text-left ml-1">
                  <Link
                    href="/esqueci-senha"
                    className="text-xs text-[#0f35a0] font-semibold hover:underline"
                  >
                    Esqueci a senha
                  </Link>
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-[#0d1b54] hover:bg-[#0d163b] active:bg-[#061560] text-white text-sm font-bold py-3 rounded-xl cursor-pointer shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                {carregando ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* Divisor Conectar-se com */}
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-slate-200" />
              <span className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">
                OU
              </span>
              <hr className="flex-1 border-slate-200" />
            </div>

            {/* Botões de Redes Sociais */}
            <div className="space-y-2">
              {/* Facebook */}
              <button
                type="button"
                className="w-full bg-[#0f35a0] hover:bg-[#091f75] text-white text-[15px] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>

              {/* Google */}
              <button
                type="button"
                className="w-full mt-3 bg-zinc-200 hover:bg-slate-300 border border-slate-200 text-black text-[15px] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </button>
            </div>

            {/* Rodapé: Cadastre-se */}
            <div className="text-center mt-5 text-[14px] text-slate-600">
              Não tem uma conta?{" "}
              <Link
                href="/cadastro-cidadao"
                className="text-[#0f35a0] font-bold hover:underline"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
