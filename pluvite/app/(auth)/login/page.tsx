"use client";

import React, { useState } from "react"; // 1. Importamos o useState
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation"; // 2. Para mudar de página

export default function Login() {
  const router = useRouter();
  
  // Estados para armazenar email e senha
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 3. Faz a chamada para o seu servidor Node (Porta 3001)
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // 4. VERIFICAÇÃO INTELIGENTE
        // O banco de dados vai dizer se é 'prefeitura' ou 'cidadao'
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
    <main className="relative h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      {/* BACKGROUND DE NUVENS (Mantido igual) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-particle"
            style={{
              left: `${Math.random() * 120 - 10}%`,
              bottom: "-150px",
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${Math.random() * 15 + 25}s`,
              opacity: 0.6,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          >
            <div className="relative bg-cyan-900 shadow-xl w-32 h-10 rounded-full">
              <div className="absolute -top-6 left-4 w-14 h-14 bg-cyan-900 rounded-full"></div>
              <div className="absolute -top-9 left-12 w-18 h-18 bg-cyan-900 rounded-full"></div>
              <div className="absolute -top-5 left-24 w-12 h-12 bg-cyan-900 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* CARD DE LOGIN - Adicionado o onSubmit */}
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col -mt-5 pb-15 justify-center items-center max-w-xl w-full bg-white rounded-4xl shadow-2xl shadow-zinc-900/50 p-10 border-slate-100 z-10"
      >
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
          <img src={"PluviteIcon.jpg"} alt="Logo" className="w-12 h-12 rounded-lg" />
        </div>
        
        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-8 font-sans">
          Fazer Login
        </h1>

        {/* Campo: Email - Adicionado value e onChange */}
        <div className="w-full relative flex items-center w-full max-w-md">
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
          />
          <Mail className="absolute right-4 text-zinc-400" />
        </div>

        {/* Campo: SENHA - Adicionado value e onChange */}
        <div className="w-full relative flex items-center w-full max-w-md mt-4">
          <input
            type="password"
            required
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="pr-9 bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
          />
          <Lock className="absolute right-4 text-zinc-400" />
        </div>

        <div className="w-full relative flex items-center w-full max-w-md">
          <button 
            type="submit" 
            className="bg-[#256ffe] mt-5 p-2 w-full rounded text-white font-medium tracking-wide font-sans hover:bg-cyan-800 transition-all duration-150 cursor-pointer"
          >
            Entrar
          </button>
        </div>

        <div className="mt-4 w-full max-w-md text-center">
          <span className="text-zinc-600">Não tem uma conta? </span>
          <Link href="/selecao" className="text-[#256ffe] font-bold">
            Cadastre-se
          </Link>
        </div>
      </form>
    </main>
  );
}