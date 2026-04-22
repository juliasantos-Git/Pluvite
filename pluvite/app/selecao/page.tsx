"use client";

import React from "react";
import Link from "next/link";
import { UserRound, Briefcase } from "lucide-react";

export default function SelecaoPerfil() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      
      {/* BACKGROUND DE NUVENS (Mantendo o teu padrão) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-particle"
            style={{
              left: `${Math.random() * 120 - 10}%`,
              bottom: "-150px",
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 15 + 20}s`,
              opacity: 0.4,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          >
            <div className="relative bg-cyan-900/20 w-32 h-10 rounded-full">
              <div className="absolute -top-6 left-4 w-14 h-14 bg-cyan-900/10 rounded-full"></div>
              <div className="absolute -top-9 left-12 w-18 h-18 bg-cyan-900/10 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* CARD DE SELEÇÃO */}
      <div className="flex flex-col justify-center items-center max-w-2xl w-full bg-white rounded-4xl shadow-2xl p-12 z-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
           <img src="/PluviteIcon.jpg" alt="Logo" className="w-12 h-12 rounded-lg" />
        </div>

        <h1 className="font-bold text-3xl text-blue-950 mb-2 font-sans text-center">
          Bem-vindo ao Pluvite
        </h1>
        <p className="text-blue-900/60 mb-10 font-medium text-center">
          Como deseja utilizar o portal hoje?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          
          {/* OPÇÃO: CIDADÃO */}
          <Link href="/cadastro-cidadao" className="group flex flex-col items-center p-8 bg-zinc-50 rounded-3xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-4 group-hover:scale-110 transition-transform">
              <UserRound size={40} className="text-zinc-400 group-hover:text-blue-600" />
            </div>
            <span className="font-bold text-xl text-blue-950">Sou Cidadão</span>
            <p className="text-sm text-zinc-500 text-center mt-3">
              Quero ver alertas e reportar ocorrências na minha região.
            </p>
          </Link>

          {/* OPÇÃO: PREFEITURA */}
          <Link href="/cadastro-prefeitura" className="group flex flex-col items-center p-8 bg-zinc-50 rounded-3xl border-2 border-transparent hover:border-blue-600 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-4 group-hover:scale-110 transition-transform">
              <Briefcase size={40} className="text-zinc-400 group-hover:text-blue-700" />
            </div>
            <span className="font-bold text-xl text-blue-950">Sou Servidor</span>
            <p className="text-sm text-zinc-500 text-center mt-3">
              Acesso restrito para gestão de dados e defesa civil.
            </p>
          </Link>

        </div>

        <div className="mt-10">
            <Link href="/login" className="text-zinc-400 hover:text-blue-600 font-medium transition-colors">
                Já tenho conta? Entrar
            </Link>
        </div>
      </div>
    </main>
  );
}