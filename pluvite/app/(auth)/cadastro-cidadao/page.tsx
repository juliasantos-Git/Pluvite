"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserRound, Mail, Lock, Phone, MapPin, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CadastroCidadao() {
  const router = useRouter();
  
  // Estado para capturar os dados do cidadão
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    bairro: "",
    pcd: false, // Campo extra de acessibilidade
  });

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
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      {/* BACKGROUND DE NUVENS (Mantendo seu padrão visual) */}
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

      {/* CARD DE CADASTRO CIDADÃO */}
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center max-w-xl w-full bg-white rounded-4xl shadow-2xl p-10 z-10"
      >
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
          <img src="/PluviteIcon.jpg" alt="Logo" className="w-12 h-12 rounded-lg" />
        </div>
        
        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-2 font-sans">
          Criar Conta
        </h1>
        <p className="text-blue-900/60 pb-6 font-medium">Portal do Cidadão</p>

        {/* Nome Completo */}
        <div className="w-full relative flex items-center max-w-md mb-4">
          <input
            type="text"
            required
            placeholder="Nome Completo"
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all placeholder:text-zinc-500"
          />
          <UserRound className="absolute right-4 text-zinc-400" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-4">
          {/* Email */}
          <input
            type="email"
            required
            placeholder="E-mail"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="flex-[2] bg-zinc-100 rounded-2xl p-4 focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all placeholder:text-zinc-500"
          />
          {/* Senha */}
          <input
            type="password"
            required
            placeholder="Senha"
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
            className="flex-1 bg-zinc-100 rounded-2xl p-4 focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all placeholder:text-zinc-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-4">
          {/* CPF */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              required
              maxLength={11}
              placeholder="CPF (apenas números)"
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all placeholder:text-zinc-500"
            />
            <Fingerprint className="absolute right-4 text-zinc-400" size={18} />
          </div>
          {/* Telefone */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              required
              placeholder="Telefone/WhatsApp"
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all placeholder:text-zinc-500"
            />
            <Phone className="absolute right-4 text-zinc-400" size={18} />
          </div>
        </div>

        {/* Bairro */}
        <div className="w-full relative flex items-center max-w-md mb-6">
          <input
            type="text"
            required
            placeholder="Seu Bairro"
            onChange={(e) => setFormData({...formData, bairro: e.target.value})}
            className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all placeholder:text-zinc-500"
          />
          <MapPin className="absolute right-4 text-zinc-400" />
        </div>

        {/* Opção PcD */}
        <div className="w-full max-w-md flex items-center gap-3 mb-6 px-2">
          <input 
            type="checkbox" 
            id="pcd"
            className="w-5 h-5 accent-[#256ffe]"
            onChange={(e) => setFormData({...formData, pcd: e.target.checked})}
          />
          <label htmlFor="pcd" className="text-zinc-600 text-sm font-medium cursor-pointer">
            Possuo deficiência ou mobilidade reduzida
          </label>
        </div>

        <button 
          type="submit"
          className="bg-[#256ffe] p-3 w-full max-w-md rounded-xl text-white font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Finalizar Cadastro
        </button>

        <div className="mt-6 text-zinc-500 text-sm">
          Já tem conta? <Link href="/login" className="text-[#256ffe] font-bold">Entrar</Link>
        </div>
      </form>
    </main>
  );
}