"use client";

import React, { useState } from "react"; // Adicionado useState
import Link from "next/link";
import { UserRound, Mail, IdCard, Briefcase, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  
  // 1. Criamos o "balde" para guardar os dados digitados
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    re: "",
  });

  // 2. Função que realmente envia os dados para o seu Node.js
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    
    try {
      const response = await fetch("http://localhost:3001/cadastrar-prefeitura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Servidor cadastrado com sucesso!");
        router.push("/login");
      } else {
        alert("Erro no cadastro: " + data.error);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor 3001. Verifique o terminal!");
    }
  };

  return (
    <main className="relative min-h-screen w-full h-full flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      {/* BACKGROUND DE NUVENS (Mantido) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute animate-particle" style={{ left: `${Math.random() * 120 - 10}%`, bottom: "-150px", animationDelay: `${Math.random() * 25}s`, animationDuration: `${Math.random() * 15 + 25}s`, opacity: 0.6, transform: `scale(${Math.random() * 0.5 + 0.5})` }}>
            <div className="relative bg-cyan-900 shadow-xl w-32 h-10 rounded-full">
              <div className="absolute -top-6 left-4 w-14 h-14 bg-cyan-900 rounded-full"></div>
              <div className="absolute -top-9 left-12 w-18 h-18 bg-cyan-900 rounded-full"></div>
              <div className="absolute -top-5 left-24 w-12 h-12 bg-cyan-900 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MUDANÇA AQUI: Trocamos a DIV externa por FORM e adicionamos o onSubmit */}
      <form onSubmit={handleSubmit} className="flex flex-col -mt-5 pb-15 justify-center items-center max-w-xl w-full bg-white rounded-4xl shadow-2xl shadow-zinc-900/50 p-10 border-slate-100 z-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
          <img src={"PluviteIcon.jpg"} alt="Logo" className="w-12 h-12 rounded-lg" />
        </div>
        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-8 font-sans">Criar Conta</h1>
        <p className="text-blue-900/60 pb-8 font-medium -mt-5">Portal do Servidor Municipal</p>

        {/* Campo: Nome */}
        <div className="w-full relative flex items-center w-full max-w-md">
          <input
            type="text"
            required
            placeholder="Nome Completo"
            onChange={(e) => setFormData({...formData, nome: e.target.value})} // Salva o nome
            className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300"
          />
          <UserRound className="absolute right-4 text-zinc-400" />
        </div>

        <div className="flex flex-row sm:flex-row gap-4 mt-1 max-w-md">
          {/* Campo: Email */}
          <div className="flex-[2] relative flex items-center mt-4">
            <input
              type="email"
              required
              placeholder="E-Mail Institucional"
              onChange={(e) => setFormData({...formData, email: e.target.value})} // Salva o email
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none"
            />
            <Mail className="absolute right-4 text-zinc-400" />
          </div>
          {/* Campo: Senha */}
          <div className="flex-1 relative flex items-center mt-4">
            <input
              type="password"
              required
              placeholder="Senha"
              onChange={(e) => setFormData({...formData, senha: e.target.value})} // Salva a senha
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none"
            />
            <Lock className="absolute right-4 text-zinc-400" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {/* Campo: Cargo */}
          <div className="flex-[2] relative flex items-center mt-4 bg-zinc-100 rounded-2xl focus-within:ring-3 focus-within:ring-cyan-700/20 transition-all duration-300">
            <select
              required
              className="w-full p-4 pr-12 appearance-none outline-none cursor-pointer text-zinc-500 bg-transparent"
              defaultValue=""
              onChange={(e) => setFormData({...formData, cargo: e.target.value})} // Salva o cargo
            >
              <option value="" disabled>Escolha seu cargo</option>
              <option value="Engenheiro Civil">Engenheiro Civil</option>
              <option value="Agente de Defesa Civil">Agente de Defesa Civil</option>
              <option value="Geólogo">Geólogo</option>
              <option value="Vigilância Ambiental">Vigilância Ambiental</option>
            </select>
            <Briefcase className="absolute right-4 pointer-events-none text-zinc-400" />
          </div>
          {/* Campo: RE */}
          <div className="flex-1 relative flex items-center mt-4">
            <input
              type="text"
              required
              placeholder="RE"
              onChange={(e) => setFormData({...formData, re: e.target.value})} // Salva o RE
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none"
            />
            <IdCard className="absolute right-4 text-zinc-400" />
          </div>
        </div>

        <div className="w-full relative flex items-center w-full max-w-md">
          <button type="submit" className="bg-[#256ffe] mt-5 p-4 w-full rounded-2xl text-white font-bold hover:bg-cyan-800 transition-all cursor-pointer shadow-lg">
            Enviar Cadastro
          </button>
        </div>

        <div className="mt-4 w-full max-w-md text-center">
          <span className="text-zinc-600">Já tem uma conta? </span>
          <Link href="/login" className="text-[#256ffe] font-bold">Entrar</Link>
        </div>
      </form>
    </main>
  );
}