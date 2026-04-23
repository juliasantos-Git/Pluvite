"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { UserRound, Mail, IdCard, Briefcase, Lock } from "lucide-react";

const EngenheiroCivil = "Engenheiro Civil";
const AgenteDefesaCivil = "Agente de Defesa Civil";
const Geologo = "Geólogo";
const VigilanciaAmbiental = "Vigilância Ambiental";

export default function CadastroServidor() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    re: "",
  });

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
      // O 'fetch' envia os dados do formulário para o seu backend no Node.js
      const response = await fetch("http://localhost:3001/cadastro-prefeitura", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro do servidor realizado com sucesso!");
        // Se quiser, pode limpar o formulário aqui
      } else {
        alert("Erro do servidor: " + data.message);
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Não foi possível conectar ao servidor. Verifique se o Node está rodando!");
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-start pt-25 justify-center p-6 overflow-hidden bg-slate-50">
      
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
              <div className="absolute -top-6 left-4 w-14 h-14 bg-cyan-900 rounded-full"></div>
              <div className="absolute -top-9 left-12 w-18 h-18 bg-cyan-900 rounded-full"></div>
              <div className="absolute -top-5 left-24 w-12 h-12 bg-cyan-900 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* CARD DE CADASTRO - Mantendo max-w-xl e centralização original */}
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-10 z-10 border border-slate-100"
      >
        <div className="mb-4">
          <img src="/PluviteIcon.jpg" alt="Logo" className="w-14 h-14 rounded-xl" />
        </div>
        
        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-2 font-sans">
          Criar Conta
        </h1>
        <p className="text-blue-900/60 pb-8 font-medium">Portal do Servidor Municipal</p>

        <div className="w-full space-y-4 max-w-md">
          {/* Nome Completo */}
          <div className="relative flex items-center group">
            <input
              type="text"
              required
              placeholder="Nome Completo"
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className="bg-zinc-100 rounded-2xl p-4 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
            />
            <UserRound className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={20} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Email */}
            <div className="relative flex-[2] flex items-center group">
              <input
                type="email"
                required
                placeholder="E-mail Institucional"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-4 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
              />
              <Mail className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={20} />
            </div>
            {/* Senha */}
            <div className="relative flex-1 flex items-center group">
              <input
                type="password"
                required
                placeholder="Senha"
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-4 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
              />
              <Lock className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={20} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Cargo (Select Estilizado) */}
            <div className="relative flex-[2] flex items-center group bg-zinc-100 rounded-2xl border-2 border-transparent hover:border-[#256ffe] focus-within:border-[#256ffe] transition-all duration-300">
              <select
                required
                value={formData.cargo}
                onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                className="w-full p-4 bg-transparent outline-none cursor-pointer text-zinc-500 appearance-none pr-12"
              >
                <option value="" disabled>Escolha seu cargo</option>
                <option value={EngenheiroCivil}>{EngenheiroCivil}</option>
                <option value={AgenteDefesaCivil}>{AgenteDefesaCivil}</option>
                <option value={Geologo}>{Geologo}</option>
                <option value={VigilanciaAmbiental}>{VigilanciaAmbiental}</option>
              </select>
              <Briefcase className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] pointer-events-none" size={20} />
            </div>
            {/* RE */}
            <div className="relative flex-1 flex items-center group">
              <input
                type="text"
                required
                placeholder="RE"
                onChange={(e) => setFormData({...formData, re: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-4 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900"
              />
              <IdCard className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={20} />
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <button 
            type="submit"
            className="bg-[#256ffe] mt-8 p-3.5 w-full rounded-xl text-white font-semibold tracking-wide hover:bg-[#1a56cc] shadow-none transition-all duration-200 cursor-pointer active:scale-95"
          >
            Finalizar Cadastro
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Já tem uma conta? </span>
          <Link href="/login" className="text-[#256ffe] font-bold hover:underline">
            Entrar
          </Link>
        </div>
      </form>
    </main>
  );
}