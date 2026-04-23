"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { UserRound, Mail, Lock, Phone, MapPin, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CadastroCidadao() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    bairro: "",
    pcd: false,
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
      const response = await fetch("http://localhost:3001/cadastrar-cidadao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro de cidadão realizado com sucesso!");
        router.push("/login");
      } else {
        alert("Erro: " + data.error);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor backend.");
    }
  };

  return (
    // h-screen garante que o fundo ocupe a tela toda, items-center centraliza verticalmente
    <main className="relative h-screen w-full flex items-start pt-30 justify-center p-4 overflow-hidden bg-slate-50">
      
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

      {/* CARD DE CADASTRO - Ajustado para caber na tela */}
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center max-w-[550px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-8 z-10 border border-slate-100 max-h-[95vh] overflow-y-auto scrollbar-hide"
      >
        <div className="mb-2 shrink-0">
          <img src="/PluviteIcon.jpg" alt="Logo" className="w-12 h-12 rounded-xl" />
        </div>
        
        <div className="text-center shrink-0">
          <h1 className="font-bold tracking-wider text-2xl text-blue-950 font-sans">
            Criar Conta
          </h1>
          <p className="text-blue-900/60 pb-6 font-medium text-sm">Portal do Cidadão</p>
        </div>

        <div className="w-full space-y-3 max-w-md">
          {/* Nome Completo */}
          <div className="relative flex items-center group">
            <input
              type="text"
              required
              placeholder="Nome Completo"
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
            />
            <UserRound className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={18} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Email */}
            <div className="relative flex-[2] flex items-center group">
              <input
                type="email"
                required
                placeholder="E-mail"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
            </div>
            {/* Senha */}
            <div className="relative flex-1 flex items-center group">
              <input
                type="password"
                required
                placeholder="Senha"
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* CPF */}
            <div className="flex-1 relative flex items-center group">
              <input
                type="text"
                required
                maxLength={11}
                placeholder="CPF (números)"
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Fingerprint className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={16} />
            </div>
            {/* Telefone */}
            <div className="flex-1 relative flex items-center group">
              <input
                type="text"
                required
                placeholder="Telefone"
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Phone className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={16} />
            </div>
          </div>

          {/* Bairro */}
          <div className="relative flex items-center group">
            <input
              type="text"
              required
              placeholder="Seu Bairro"
              onChange={(e) => setFormData({...formData, bairro: e.target.value})}
              className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
            />
            <MapPin className="absolute right-4 text-zinc-400 group-focus-within:text-[#256ffe] transition-colors" size={18} />
          </div>

          {/* Opção PcD */}
          <div className="flex items-center gap-3 px-2 py-1">
            <input 
              type="checkbox" 
              id="pcd"
              className="w-4 h-4 accent-[#256ffe] cursor-pointer"
              onChange={(e) => setFormData({...formData, pcd: e.target.checked})}
            />
            <label htmlFor="pcd" className="text-zinc-500 text-xs font-medium cursor-pointer hover:text-[#256ffe] transition-colors">
              Possuo deficiência ou mobilidade reduzida
            </label>
          </div>
        </div>

        <div className="w-full max-w-md shrink-0">
          <button 
            type="submit"
            className="bg-[#256ffe] mt-6 p-3 w-full rounded-xl text-white font-semibold tracking-wide hover:bg-[#1a56cc] shadow-none transition-all duration-200 cursor-pointer active:scale-95"
          >
            Finalizar Cadastro
          </button>
        </div>

        <div className="mt-4 text-center text-xs shrink-0">
          <span className="text-zinc-500">Já tem conta? </span>
          <Link href="/login" className="text-[#256ffe] font-bold hover:underline">
            Entrar
          </Link>
        </div>
      </form>
    </main>
  );
}