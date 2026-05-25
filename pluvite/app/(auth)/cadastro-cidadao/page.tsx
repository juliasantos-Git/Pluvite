"use client";
import { supabase } from "@/app/lib/banco";
import React, { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Mail,
  Lock,
  Phone,
  MapPin,
  Fingerprint,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NuvensBackground from "@/app/components/NuvensBackground";

export default function CadastroCidadao() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    cidade: "",
    pcd: false,
  });

  const [cpfDisplay, setCpfDisplay] = useState("");
  const [telefoneDisplay, setTelefoneDisplay] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const formatarCPF = (valor: string) => {
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatarTelefone = (valor: string) => {
    const nums = valor.replace(/\D/g, "").slice(0, 11);
    return nums
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      });

      if (error) {
        alert("Erro ao criar conta: " + error.message);
        return;
      }

      const { error: erroPerfil } = await supabase.from("cidadao").insert({
        auth_id: data.user?.id,
        nome_completo: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        cidade: formData.cidade,
        pcd: formData.pcd,
      });

      if (erroPerfil) {
        alert("Erro ao salvar dados: " + erroPerfil.message);
        return;
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Erro inesperado:", error);
      alert("Algo deu errado, tente novamente.");
    }
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#256ffe]">
      <NuvensBackground />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center max-w-[550px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-900/50 p-8 z-10 border border-slate-100 max-h-[95vh] overflow-y-auto scrollbar-hide"
      >
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-6">
          <img
            src="/PluviteIcon.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-lg select-none"
            draggable="false"
          />
        </div>

        <div className="text-center shrink-0">
          <h1 className="font-bold tracking-wider text-2xl text-blue-950 font-sans pb-6">
            Criar Conta
          </h1>
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
              className="absolute right-4 text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
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
                className="absolute right-4 text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={18}
              />
            </div>
            {/* Senha */}
            <div className="relative flex-1 flex items-center group">
              <input
                type={mostrarSenha ? "text" : "password"}
                required
                placeholder="Senha"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 text-zinc-500 group-focus-within:text-[#256ffe] hover:text-[#256ffe] transition-colors cursor-pointer"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* CPF */}
            <div className="flex-1 relative flex items-center group">
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={cpfDisplay}
                onChange={(e) => {
                  const nums = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setFormData({ ...formData, cpf: nums });
                  setCpfDisplay(formatarCPF(e.target.value));
                }}
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Fingerprint
                className="absolute right-4 text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={16}
              />
            </div>
            {/* Telefone */}
            <div className="flex-1 relative flex items-center group">
              <input
                type="text"
                required
                placeholder="(00) 00000-0000"
                value={telefoneDisplay}
                onChange={(e) => {
                  const nums = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setFormData({ ...formData, telefone: nums });
                  setTelefoneDisplay(formatarTelefone(e.target.value));
                }}
                className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
              />
              <Phone
                className="absolute right-4 text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
                size={16}
              />
            </div>
          </div>

          {/* Cidade */}
          <div className="relative flex items-center group">
            <input
              type="text"
              required
              placeholder="Sua cidade"
              value={formData.cidade}
              onChange={(e) =>
                setFormData({ ...formData, cidade: e.target.value })
              }
              className="bg-zinc-100 rounded-2xl p-3.5 w-full border-2 border-transparent hover:border-[#256ffe] focus:border-[#256ffe] outline-none transition-all duration-300 placeholder:text-zinc-500 text-slate-900 text-sm"
            />
            <MapPin
              className="absolute right-4 text-zinc-500 group-focus-within:text-[#256ffe] transition-colors"
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