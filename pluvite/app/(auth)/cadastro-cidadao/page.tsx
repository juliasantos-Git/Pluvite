"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Lock,
  Phone,
  MapPin,
  Fingerprint,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NuvensBackground from "@/components/NuvensBackground";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Conecta com o seu backend na porta 3001
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
        alert("Erro: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert(
        "Erro ao conectar com o servidor backend. Verifique se o Node está rodando!",
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
        className="flex flex-col justify-center items-center max-w-[550px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-8 z-10 border border-slate-100 max-h-[95vh] overflow-y-auto scrollbar-hide"
      >
        <div className="mb-2 shrink-0">
          <img
            src="/PluviteIcon.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-xl"
          />
        </div>

        <div className="text-center shrink-0">
          <h1 className="font-bold tracking-wider text-2xl text-blue-950 font-sans">
            Criar Conta
          </h1>
          <p className="text-blue-900/60 pb-6 font-medium text-sm">
            Portal do Cidadão
          </p>
        </div>

        <div className="w-full space-y-3 max-w-md">
          {/* Nome Completo */}
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
            <UserRound
              className="absolute right-4 text-zinc-500 focus:shadow-2xl group-focus-within:text-[#256ffe] transition-colors"
              size={18}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Email */}
            <div className="relative flex-[2] flex items-center group">
              <input
                type="email"
                required
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Mail
                className="absolute right-4  text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={18}
              />
            </div>
            {/* Senha */}
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
              <Lock
                className="absolute right-4  text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={18}
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
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Fingerprint
                className="absolute right-4 text-zinc-400 text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={16}
              />
            </div>
            {/* Telefone */}
            <div className="flex-1 relative flex items-center group">
              <input
                type="text"
                required
                placeholder="Telefone"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Phone
                className="absolute right-4  text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={16}
              />
            </div>
          </div>

          {/* Bairro */}
          <div className="relative flex items-center group">
            <input
              type="text"
              required
              placeholder="Seu Bairro"
              value={formData.bairro}
              onChange={(e) =>
                setFormData({ ...formData, bairro: e.target.value })
              }
              className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
            />
            <MapPin
              className="absolute right-4  text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
              size={18}
            />
          </div>

          {/* Opção PcD */}
          <div className="flex items-center gap-3 px-2 py-1">
            <input
              type="checkbox"
              id="pcd"
              checked={formData.pcd}
              className="w-4 h-4 accent-[#256ffe] cursor-pointer"
              onChange={(e) =>
                setFormData({ ...formData, pcd: e.target.checked })
              }
            />
            <label
              htmlFor="pcd"
              className="text-zinc-500 text-xs font-medium cursor-pointer hover:text-[#256ffe] transition-colors"
            >
              Possuo deficiência ou mobilidade reduzida
            </label>
          </div>
        </div>

        <div className="w-full max-w-md shrink-0">
          <button
            type="submit"
            className="bg-[#256ffe] mt-6 p-3 w-full rounded-xl text-white font-semibold tracking-wide hover:bg-[#1a56cc] transition-all duration-200 cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20"
          >
            Finalizar Cadastro
          </button>
        </div>

        <div className="mt-4 text-center text-xs shrink-0">
          <span className="text-zinc-500">Já tem conta? </span>
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
