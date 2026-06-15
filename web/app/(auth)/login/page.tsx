"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.tipo === "prefeitura") {
          router.push("/dashboard-prefeitura");
        } else {
          router.push("/Mapa");
        }
      } else {
        alert("E-mail ou senha incorretos!");
        setSenha("");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Servidor fora do ar. Verifique se o terminal do Node está rodando!");
      setSenha("");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-6 font-sans antialiased">
      
      {/* ── CARD BRANCO ENVOLVENTE ── */}
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-2xl shadow-blue-950/50 border border-slate-100 p-8 sm:p-10 transition-all duration-300">
        
        {/* Logo / Cabeçalho limpo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-2">
            <img
              src="/PluviteIcon.jpg"
              alt="Pluvite"
              className="w-14 h-14 rounded-xl select-none object-cover"
              draggable="false"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                if (el.parentElement) {
                  el.parentElement.innerHTML =
                    '<span style="color:#2563eb;font-weight:900;font-size:36px;font-family:serif;">P</span>';
                }
              }}
            />
          </div>
          <h1 className="text-sm font-black tracking-[0.2em] text-slate-900 uppercase">
            Plataforma Pluvite
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo: E-mail */}
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              disabled={carregando}
              placeholder="E-mail institucional ou pessoal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/50 text-base text-slate-900 rounded-xl px-4 py-3.5 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-500/90 disabled:opacity-60"
            />
          </div>

          {/* Campo: Senha */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                required
                disabled={carregando}
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-slate-50/50 text-base text-slate-900 rounded-xl px-4 py-3.5 pr-12 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-500/90 disabled:opacity-60"
              />
              <button
                type="button"
                disabled={carregando}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="pt-0.5">
              <Link href="/esqueci-senha" className="text-sm text-blue-700 font-medium hover:underline">
                Esqueci a senha
              </Link>
            </div>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#1e4ed8] hover:bg-blue-700 active:bg-blue-800 text-white text-base font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            {carregando ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Divisor Conectar-se com */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-slate-200" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conectar-se com</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Botões de Redes Sociais */}
        <div className="space-y-2.5">
          {/* Facebook */}
          <button 
            type="button" 
            className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuar com o Facebook
          </button>

          {/* Google */}
          <button 
            type="button" 
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continuar com o Google
          </button>
        </div>

        {/* Rodapé: Cadastre-se */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Não tem uma conta?{" "}
          <Link href="/cadastro-cidadao" className="text-blue-700 font-bold hover:underline">
            Cadastre-se
          </Link>
        </div>

      </div>
    </main>
  );
}