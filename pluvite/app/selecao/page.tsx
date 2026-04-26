"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { UserRound, Briefcase } from "lucide-react";

export default function SelecaoPerfil() {
  // Memoriza as nuvens para evitar que "saltem" ao interagir com a página
  const clouds = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 120 - 10}%`,
      delay: `${Math.random() * 25}s`,
      duration: `${Math.random() * 15 + 25}s`,
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#256ffe]">
      
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

      {/* CARD DE SELEÇÃO */}
      <div className="flex flex-col justify-center items-center max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-10 z-10 border border-slate-100">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
          <img
            src="/PluviteIcon.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-lg"
          />
        </div>

        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-2 font-sans text-center">
          Bem-vindo ao Pluvite
        </h1>
        <p className="text-blue-900/60 pb-10 font-medium text-center">
          Como deseja utilizar o portal hoje?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-lg">
          
          {/* OPÇÃO: CIDADÃO */}
          <Link
            href="/cadastro-cidadao"
            className="group flex flex-col items-center p-8 bg-zinc-50 rounded-3xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <UserRound
                size={40}
                className="text-zinc-400 group-hover:text-blue-600 transition-colors"
              />
            </div>
            <span className="font-bold text-lg text-blue-950">Sou Cidadão</span>
            <p className="text-xs text-zinc-500 text-center mt-2 leading-relaxed">
              Quero ver alertas e reportar ocorrências na minha região.
            </p>
          </Link>

          {/* OPÇÃO: PREFEITURA / SERVIDOR */}
          <Link
            href="/cadastro-prefeitura"
            className="group flex flex-col items-center p-8 bg-zinc-50 rounded-3xl border-2 border-transparent hover:border-blue-600 hover:bg-blue-50/30 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Briefcase
                size={40}
                className="text-zinc-400 group-hover:text-blue-700 transition-colors"
              />
            </div>
            <span className="font-bold text-lg text-blue-950">Sou Servidor</span>
            <p className="text-xs text-zinc-500 text-center mt-2 leading-relaxed">
              Acesso restrito para gestão de dados e defesa civil.
            </p>
          </Link>
        </div>

        <div className="mt-10 text-center text-sm">
          <span className="text-zinc-500">Já tem conta? </span>
          <Link
            href="/login"
            className="text-[#256ffe] font-bold hover:underline transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}