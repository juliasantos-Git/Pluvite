"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.tipo === "prefeitura") {
          router.push("/dashboard-prefeitura");
        } else {
          router.push("/Mapa");
        }
      } else {
        alert("Email ou senha incorretos!");
        setEmail("");
        setSenha("");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Servidor fora do ar. Verifique se o terminal do Node está rodando!");
      setEmail("");
      setSenha("");
    }
  };

  return (
    <main className="h-screen w-full flex overflow-hidden">

      {/* ── LADO ESQUERDO — decorativo, sem conteúdo textual ── */}
      <div className="relative hidden md:block md:w-[42%] shrink-0 overflow-hidden bg-[#1447c4]">
        {/* Elipse grande inspirada no layout de referência */}
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#2a5fe0] rounded-full" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[#3d72f5]/40 rounded-full" />
      </div>

      {/* ── LADO DIREITO — formulário centralizado ── */}
      <div className="flex flex-col justify-center items-center flex-1 bg-white px-8 overflow-y-auto">
        <div className="w-full max-w-sm py-12">

          {/* Logo / ícone do sistema */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#1447c4] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 mb-4">
              <img
                src="/PluviteIcon.jpg"
                alt="Pluvite"
                className="w-10 h-10 rounded-xl select-none"
                draggable="false"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = "none";
                  (el.parentElement as HTMLElement).innerHTML =
                    '<span style="color:white;font-weight:800;font-size:18px;letter-spacing:-1px">Pv</span>';
                }}
              />
            </div>
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
              Plataforma Pluvite
            </p>
          </div>

          {/* Título */}
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight text-center">
            Acesse sua conta
          </h1>
          <p className="text-sm text-slate-400 text-center mt-1.5 mb-8">
            Ainda não tem conta?{" "}
            <Link href="/cadastro-cidadao" className="text-[#1447c4] font-semibold hover:underline">
              Cadastre-se aqui
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                E-mail
              </label>
              <input
                type="email"
                required
                placeholder="voce@exemplo.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-sm text-slate-900 rounded-xl px-4 py-3 border-2 border-slate-200 hover:border-slate-300 focus:border-[#1447c4] outline-none transition-all duration-200 placeholder:text-slate-300"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Senha
                </label>
                <Link href="/esqueci-senha" className="text-xs text-[#1447c4] font-medium hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-white text-sm text-slate-900 rounded-xl px-4 py-3 pr-12 border-2 border-slate-200 hover:border-slate-300 focus:border-[#1447c4] outline-none transition-all duration-200 placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Botão principal */}
            <button
              type="submit"
              className="w-full bg-[#1447c4] hover:bg-[#0f38a0] active:scale-[0.98] text-white text-sm font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-blue-600/20 mt-2"
            >
              Entrar
            </button>
          </form>

          {/* Divisor */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-slate-200" />
            <span className="text-xs text-slate-400 font-medium">ou, se preferir</span>
            <hr className="flex-1 border-slate-200" />
          </div>

          {/* Botão cadastro cidadão */}
          <Link href="/cadastro-cidadao" className="block">
            <button className="w-full border-2 border-slate-200 hover:border-[#1447c4] hover:text-[#1447c4] text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer">
              Criar conta como cidadão
            </button>
          </Link>

          {/* Botão cadastro prefeitura */}
          <Link href="/cadastro-prefeitura" className="block mt-3">
            <button className="w-full border-2 border-slate-200 hover:border-[#1447c4] hover:text-[#1447c4] text-slate-600 text-sm font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer">
              Acesso para prefeituras
            </button>
          </Link>

        </div>
      </div>
    </main>
  );
}