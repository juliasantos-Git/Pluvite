"use client";

import React, { useState, useMemo } from "react"; 
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  // Estados para armazenar email e senha
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Background de nuvens animadas
  const clouds = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 120 - 10}%`,
      delay: `${Math.random() * 25}s`,
      duration: `${Math.random() * 15 + 25}s`,
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, []);

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
        // VERIFICAÇÃO DE TIPO DE USUÁRIO
        // O backend deve retornar se o usuário é 'prefeitura' ou 'cidadao'
        if (data.tipo === "prefeitura") {
          router.push("/dashboard-prefeitura");
        } else {
          router.push("/home-cidadao");
        }
      } else {
        alert("Email ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Servidor fora do ar. Verifique se o terminal do Node está rodando!");
    }
  };

  return (
    <main className="relative h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#256ffe]">
      
      {/* BACKGROUND DE NUVENS */}
      <div className="absolute inset-0 pointer-events-none">
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute animate-particle"
            style={{
              left: cloud.left,
              bottom: "-150px",
              animationDelay: cloud.delay,
              animationDuration: cloud.duration,
              opacity: 0.6,
              transform: `scale(${cloud.scale})`,
            }}
          >
            <div className="relative bg-cyan-900 shadow-xl w-32 h-10 rounded-full">
              <div className="absolute -top-6 left-4 w-14 h-14 bg-slate-50 rounded-full"></div>
              <div className="absolute -top-9 left-12 w-18 h-18 bg-slate-50 rounded-full"></div>
              <div className="absolute -top-5 left-24 w-12 h-12 bg-slate-50 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* CARD DE LOGIN */}
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col justify-center items-center max-w-[500px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-10 z-10 border border-slate-100"
      >
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
          <img src="/PluviteIcon.jpg" alt="Logo" className="w-12 h-12 rounded-lg" />
        </div>

        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-2 font-sans">
          Fazer Login
        </h1>
        <p className="text-blue-900/60 pb-8 font-medium">Bem-vindo de volta!</p>

        <div className="w-full space-y-4 max-w-md">
          {/* Campo: Email */}
          <div className="relative flex items-center group">
            <input
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-100 rounded-2xl p-4 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
            />
            <Mail className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={20} />
          </div>

          {/* Campo: Senha */}
          <div className="relative flex items-center group">
            <input
              type="password"
              required
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pr-12 bg-zinc-100 rounded-2xl p-4 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
            />
            <Lock className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={20} />
          </div>
        </div>

        <div className="w-full max-w-md">
          <button 
            type="submit" 
            className="bg-[#256ffe] mt-8 p-3.5 w-full rounded-xl text-white font-semibold tracking-wide hover:bg-[#1a56cc] transition-all duration-200 cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Entrar
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-zinc-500">Não tem uma conta? </span>
          <Link href="/selecao" className="text-[#256ffe] font-bold hover:underline">
            Cadastre-se
          </Link>
        </div>
      </form>
    </main>
  );
}