"use client"; // Define como Client Component para lidar com cliques e digitação

import React from "react";
import Link from "next/link";
import { UserRound, Mail, IdCard, Briefcase, Lock } from "lucide-react";

const Infraestrutura = "Infraestrutura";
const AgenteDefesaCivil = "Agente de Defesa Civil";

export default function Cadastro() {
  // Função para lidar com o envio do formulário (backend futuro)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando cadastro...");
  };

  return (
    <main className=" min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex flex-col pb-15 justify-center items-center max-w-xl w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        {/* FORMS */}

        <img
          src={"PluviteIcon.jpeg"}
          alt="Logo"
          className="w-15 h-15 rounded-xl mb-6"
        />

        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-8  font-sans">
          Criar Conta
        </h1>
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
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
            ></input>
            <Mail className="absolute right-4" />
          </div>
          {/* Campo: Senha */}
          <div className="flex-1 relative flex items-center max-w-md mt-4">
            <input
              type="text"
              required
              placeholder="Senha"
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
            ></input>
            <Lock className="absolute right-4" />
          </div>
        </div>

        <div className="flex flex-row sm:flex-row gap-4 mt-1 max-w-md">
          {/* Campo: Cargo */}
          <div className="flex-[2] relative flex items-center max-w-md mt-4">
            <form>
              <label className=" outline-none border border-none focus:ring-0 focus:outline-none">
                <select id="cadastro" className="">
                  <option selected>Escolha seu cargo</option>
                  <option value={Infraestrutura}>Infraestrutura</option>
                  <option value={AgenteDefesaCivil}>
                    Agente de Defesa Civil
                  </option>
                </select>
              </label>
            </form>
            <Briefcase className="absolute right-4" />
          </div>
          {/* Campo: RE */}
          <div className="flex-1 relative flex items-center max-w-md mt-4">
            <input
              type="text"
              required
              placeholder="RE"
              className="bg-zinc-100 rounded-2xl p-4 w-full focus:ring-3 focus:ring-cyan-700/20 outline-none transition-all duration-300 placeholder:text-zinc-500"
            ></input>
            <IdCard className="absolute right-4" />
          </div>
        </div>
        <div className="w-full relative flex items-center w-full max-w-md">
          <button className="bg-[#5dafe7] mt-5 p-2 w-full rounded text-white font-medium tracking-wide font-sans hover:bg-cyan-800 transition-all duration-150 cursor-pointer">
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}
