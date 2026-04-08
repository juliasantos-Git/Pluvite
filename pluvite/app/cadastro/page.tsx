"use client"; // Define como Client Component para lidar com cliques e digitação

import React from "react";
import Link from "next/link";

export default function Cadastro() {
  // Função para lidar com o envio do formulário (backend futuro)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando cadastro...");
  };

  return (
    <main className=" min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex flex-col justify-center items-center max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        {/* FORMS */}

        <h1 className="font-bold tracking-wider text-2xl text-zinc-800 pb-8">
          Cadastro
        </h1>
        <div className="bg-zinc-100 rounded-2xl p-4 w-full">Nome Completo</div>
      </div>
    </main>
  );
}
