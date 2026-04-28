"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserRound, Mail, IdCard, Briefcase, Lock } from "lucide-react";
import NuvensBackground from "@/components/NuvensBackground";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //conecxão com banco de dados
      const response = await fetch(
        "http://localhost:3001/cadastro-prefeitura",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro do servidor realizado com sucesso!");
      } else {
        alert("Erro do servidor: " + data.message);
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert(
        "Não foi possível conectar ao servidor. Verifique se o Node está rodando!",
      );
    }
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#256ffe]">
      {/* BACKGROUND DE NUVENS */}
      <NuvensBackground />
      {/* CARD DE CADASTRO */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-10 z-10 border border-slate-100"
      >
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
          <img
            src="/PluviteIcon.jpg"
            alt="Logo"
            className="w-14 h-14 rounded-xl"
          />
        </div>

        <h1 className="font-bold tracking-wider text-3xl text-blue-950 pb-2 font-sans text-center">
          Criar Conta
        </h1>
        <p className="text-blue-900/60 pb-8 font-medium text-center">
          Portal do Servidor Municipal
        </p>

        <div className="w-full space-y-4 max-w-md">
          {/* Campo: Nome */}
          <div className="relative flex items-center group">
            <input
              type="text"
              required
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
            />
            <UserRound className="absolute right-4 text-zinc-400" size={20} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo: Email */}
            <div className="relative flex-[2] flex items-center group">
              <input
                type="email"
                required
                placeholder="E-mail Institucional"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Mail className="absolute right-4 text-zinc-400" size={20} />
            </div>

            {/* Campo: Senha */}
            <div className="relative flex-1 flex items-center group">
              <input
                type="password"
                required
                placeholder="Senha"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Lock className="absolute right-4 text-zinc-400" size={20} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo: Cargo */}
            <div className="relative flex-[2] flex items-center group bg-zinc-100 rounded-2xl focus-within:ring-3 focus-within:ring-cyan-700/20 transition-all duration-300">
              <select
                required
                value={formData.cargo}
                onChange={(e) =>
                  setFormData({ ...formData, cargo: e.target.value })
                }
                className="w-full p-4 bg-transparent outline-none cursor-pointer text-zinc-500 appearance-none pr-12"
              >
                <option value="" disabled>
                  Escolha seu cargo
                </option>
                <option value={EngenheiroCivil}>{EngenheiroCivil}</option>
                <option value={AgenteDefesaCivil}>{AgenteDefesaCivil}</option>
                <option value={Geologo}>{Geologo}</option>
                <option value={VigilanciaAmbiental}>
                  {VigilanciaAmbiental}
                </option>
              </select>
              <Briefcase
                className="absolute right-4 text-zinc-400 pointer-events-none"
                size={20}
              />
            </div>

            {/* Campo: RE */}
            <div className="relative flex-1 flex items-center group">
              <input
                type="text"
                required
                placeholder="RE"
                value={formData.re}
                onChange={(e) =>
                  setFormData({ ...formData, re: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <IdCard className="absolute right-4 text-zinc-400" size={20} />
            </div>
          </div>
        </div>

        {/* Botão de Envio (Agora dentro do Form) */}
        <div className="w-full max-w-md">
          <button
            type="submit"
            className="bg-[#256ffe] mt-8 p-3.5 w-full rounded-xl text-white font-semibold tracking-wide hover:bg-[#1a56cc] shadow-lg shadow-blue-500/30 transition-all duration-200 cursor-pointer active:scale-95"
          >
            Finalizar Cadastro
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Já tem uma conta? </span>
          <Link
            href="/login"
            className="text-[#256ffe] font-bold hover:underline"
          >
            Entrar
          </Link>
        </div>
      </form>
    </main>
  );
}
