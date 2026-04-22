"use client"; // Define como Client Component para lidar com cliques e digitação

import React from "react";
import Link from "next/link";
import { UserRound, Mail, IdCard, Briefcase, Lock } from "lucide-react";

const EngenheiroCivil = "Engenheiro Civil";
const AgenteDefesaCivil = "Agente de Defesa Civil";
const Geologo = "Geólogo";
const VigilanciaAmbiental = "Vigilância Ambiental";

export default function Cadastro() {
  // Função para lidar com o envio do formulário (backend futuro)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando cadastro...");
  };

  return (
    <main className="relative min-h-screen w-full h-full flex items-center justify-center p-6 overflow-hidden bg-slate-50">
      {/* BACKGROUND DE NUVENS*/}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-particle"
            style={{
              // Permite que as nuvens apareçam bem nas pontas (de -10% a 110%)
              left: `${Math.random() * 120 - 10}%`,
              bottom: "-150px",
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${Math.random() * 15 + 25}s`,
              opacity: 0.6,
              // Escala aleatória para as nuvens terem tamanhos diferentes
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
      {/* CARD DE CADASTRO */}
      <div className="flex flex-col mt-12 pb-15 justify-center items-center max-w-xl w-full bg-white rounded-4xl shadow-2xl shadow-zinc-900/50 p-10 border-slate-100 z-100">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
          <img
            src={"PluviteIcon.jpg"}
            alt="Logo"
            className="w-12 h-12 rounded-lg"
          />
        </div>
        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-8  font-sans">
          Criar Conta
        </h1>
        <p className="text-blue-900/60 pb-8 font-medium -mt-5">
          Portal do Servidor Municipal
        </p>
        {/* Campo: Nome */}
        <div className="w-full relative flex items-center w-full max-w-md">
          <input
            type="text"
            required
            placeholder="Nome Completo"
            className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
          ></input>
          <UserRound className="absolute right-4" />
        </div>
        <div className="flex flex-row sm:flex-row gap-4 mt-1 max-w-md">
          {/* Campo: Email */}
          <div className="flex-[2] relative flex items-center max-w-md mt-4">
            <input
              type="text"
              required
              placeholder="E-Mail Institucional"
              className="pr-9 bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
            ></input>
            <Mail className="absolute right-4" />
          </div>
          {/* Campo: Senha */}
          <div className="flex-1 relative flex items-center max-w-md mt-4">
            <input
              type="password"
              required
              placeholder="Senha"
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
            ></input>
            <Lock className="absolute right-4" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Campo: Cargo */}
          <div className="flex-[2] relative flex items-center max-w-md mt-4 bg-zinc-100 rounded-2xl focus-within:ring-3 focus-within:ring-cyan-700/20 transition-all duration-300">
            <select
              id="cadastro"
              className="w-full p-4 pr-12 appearance-none outline-none cursor-pointer text-zinc-500"
              defaultValue=""
            >
              <option value="" disabled>
                Escolha seu cargo
              </option>
              <option value={EngenheiroCivil}>Engenheiro Civil</option>
              <option value={AgenteDefesaCivil}>Agente de Defesa Civil</option>
              <option value={Geologo}>Geólogo</option>
              <option value={VigilanciaAmbiental}>Vigilância Ambiental</option>
            </select>

            {/*pointer-events-none para não atrapalhar o clique no select */}
            <Briefcase className="absolute right-4 pointer-events-none" />
          </div>
          {/* Campo: RE */}
          <div className="flex-1 relative flex items-center max-w-md mt-4">
            <input
              type="password"
              required
              placeholder="RE"
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
            ></input>
            <IdCard className="absolute right-4" />
          </div>
        </div>
        <div className="w-full relative flex items-center w-full max-w-md">
          <button className="bg-[#256ffe] mt-5 p-2 w-full rounded text-white font-medium tracking-wide font-sans hover:bg-cyan-800 transition-all duration-150 cursor-pointer">
            Enviar
          </button>
        </div>
        <div className="mt-4 w-full max-w-md">
          <span className="text-zinc-600">Já tem uma conta? </span>
          <Link href="/login" className="text-[#256ffe] font-bold">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
