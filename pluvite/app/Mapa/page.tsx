"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CircleCheckBig,
  Users,
  TriangleAlert,
  CircleAlert,
  CircleCheck,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";

// ⚠️ IMPORTANTE: Instale o SDK do Supabase no seu projeto Next.js rodando no terminal:
// npm install @supabase/supabase-js
import { createClient } from "@supabase/supabase-js";

// Inicializa o cliente do Supabase (Substitua com as suas credenciais reais)
const SUPABASE_URL = "https://qhughmeaxbyupuglpvud.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodWdobWVheGJ5dXB1Z2xwdnVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAyNzgzMCwiZXhwIjoyMDk0NjAzODMwfQ.LbYDKH9U7IfKfJEbo_RAd4xkQPWBHzoFKLD5ADzdVyc";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Importa o bloco do mapa garantindo o bloqueio de SSR (Server-Side Rendering)
const MapaSemSSR = dynamic(() => import("../components/MapaValeComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">
      <p className="animate-pulse tracking-wide text-sm font-medium">
        A carregar mapa interativo do Vale...
      </p>
    </div>
  ),
});

export default function PluviteVale() {
  const [localAberto, setLocalAberto] = useState<string | null>(null);
  const [dadosBairros, setDadosBairros] = useState<any>(null);

  // --- ESTADOS PARA O POP-UP DE ALERTA EM TEMPO REAL ---
  const [exibirAlerta, setExibirAlerta] = useState(false);
  const [dadosAlerta, setDadosAlerta] = useState<{
    cidade: string;
    condicao: string;
    temperatura: string;
    nome: string;
  } | null>(null);

  // 1. Carrega o JSON do mapa
  useEffect(() => {
    fetch("/map.json")
      .then((res) => res.json())
      .then((data) => setDadosBairros(data))
      .catch((err) => console.error("Erro ao carregar o mapa JSON:", err));
  }, []);

  // 2. 📡 ESCUTA DO SUPABASE EM TEMPO REAL (Substitui o arquivo .js antigo)
  useEffect(() => {
    // SIMULAÇÃO: Aqui você pegaria o ID e Nome vindos do seu sistema de login/sessão.
    // Para testar agora, você pode mudar esses valores para bater com o banco!
    const idCidadaoLogado = 1; 
    const nomeCidadaoLogado = "Quezia";

    console.log(`📡 Pluvite conectado e monitorando para: ${nomeCidadaoLogado}`);

    const canalRealtimes = supabase
      .channel("canal-pluvite")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alertas_tempo_real" },
        (payload) => {
          const novoAlerta = payload.new;

          // Se o alerta gerado pelo Python for para o cidadão que está logado
          if (novoAlerta.id_cidadao === idCidadaoLogado) {
            setDadosAlerta({
              cidade: novoAlerta.cidade_alerta,
              condicao: novoAlerta.condicao,
              temperatura: novoAlerta.temperatura,
              nome: nomeCidadaoLogado,
            });
            setExibirAlerta(true);
          }
        }
      )
      .subscribe();

    // Remove a escuta quando o usuário sai da página para não gastar memória
    return () => {
      supabase.removeChannel(canalRealtimes);
    };
  }, []);

  return (
    <main className="h-screen w-full relative">
      {/* MAPA INTERATIVO SEGURO - Só renderiza quando o JSON terminar de carregar */}
      {dadosBairros ? (
        <MapaSemSSR bairrosDados={dadosBairros} setLocalAberto={setLocalAberto} />
      ) : (
        <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">
          <p className="animate-pulse tracking-wide text-sm font-medium">
            A ler dados geográficos...
          </p>
        </div>
      )}

      {/* --- BOX DE LEGENDA FIXA NO CANTO SUPERIOR DIREITO --- */}
      <div className="absolute top-12 right-4 z-[1000] bg-slate-200 border-slate-200/50 p-4 rounded-2xl shadow-lg max-w-xs flex flex-col gap-2.5 font-sans">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
          Status de Monitoramento
        </h3>
        
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-600 animate-pulse" />
          <span className="text-sm font-semibold text-slate-800">Alerta Máximo</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
          <span className="text-sm font-semibold text-slate-800">Estado de Alerta</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400" />
          <span className="text-sm font-semibold text-slate-800">Atenção</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-slate-800">Seguro</span>
        </div>
      </div>

      {/* --- 🚨 POP-UP DE EMERGÊNCIA EM TEMPO REAL (IGUAL AO DA FOTO) --- */}
      {exibirAlerta && dadosAlerta && (
        <div className="fixed inset-0 left-0 z-[10000] flex items-center justify-center p-4">
          {/* Fundo escuro com desfoque */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Card do Pop-up */}
          <div className="relative bg-white w-full max-w-xs rounded-xl p-5 shadow-2xl flex flex-col font-sans text-slate-800 border border-slate-300">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm tracking-wide">
                <TriangleAlert size={16} />
                <span>ALERTA DE EMERGÊNCIA</span>
              </div>
              <button 
                onClick={() => setExibirAlerta(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo do Alerta */}
            <div className="flex flex-col gap-3 text-sm">
              <p className="font-medium text-slate-900">Olá, {dadosAlerta.nome}!</p>
              
              <div>
                <p className="text-slate-600">Risco detectado em <span className="font-semibold text-slate-900">{dadosAlerta.cidade}</span>:</p>
                <p className="font-bold text-slate-900 tracking-wide uppercase mt-0.5">{dadosAlerta.condicao}</p>
              </div>

              <p className="text-slate-700 font-medium">
                Temperatura: <span className="font-semibold">{dadosAlerta.temperatura}</span>
              </p>

              <p className="text-red-600 font-semibold text-xs mt-1 animate-pulse">
                Tome precauções imediatamente.
              </p>
            </div>

            {/* Botão de Fechar */}
            <div className="text-right mt-4 pt-2 border-t border-slate-100">
              <button
                onClick={() => setExibirAlerta(false)}
                className="bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 font-medium text-xs px-5 py-1.5 rounded cursor-pointer transition-all shadow-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETALHADO DO MUNICÍPIO --- */}
      {localAberto && (
        <div className="fixed inset-0 left-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setLocalAberto(null)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-[1rem] p-8 shadow-2xl flex flex-col gap-6 pb-10">
            <button
              onClick={() => setLocalAberto(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CircleCheckBig className="text-green-500" size={25} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {localAberto}
                </h2>

                <div className="flex items-center gap-4 mt-3">
                  <div className="px-3 py-1 rounded-md border border-zinc-300 text-zinc-600 font-bold text-sm tracking-wide bg-white">
                    Monitorado
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Users size={18} />
                    <p className="tracking-wide text-sm font-medium">
                      Dados Regionais
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-3 mt-4">
              <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex justify-between items-center text-red-700">
                <div>
                  <TriangleAlert className="mb-1" size={20} />
                  <p className="text-sm">Críticos</p>
                </div>
                <div className="text-2xl font-bold">10</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-600 rounded-xl p-6 flex justify-between items-center text-yellow-600">
                <div>
                  <CircleAlert className="mb-1" size={20} />
                  <p className="text-sm">Médios</p>
                </div>
                <div className="text-2xl font-bold">20</div>
              </div>

              <div className="bg-green-100 border border-green-700 rounded-xl p-6 flex justify-between items-center text-green-700">
                <div>
                  <CircleCheck className="mb-1" size={20} />
                  <p className="text-sm">Baixos</p>
                </div>
                <div className="text-2xl font-bold">40</div>
              </div>
            </div>

            <div className="p-3 w-full mt-2 bg-green-100 border border-green-700 rounded-xl flex flex-col text-green-800">
              <div className="flex items-center gap-2">
                <CircleCheckBig size={22} />
                <h1 className="font-bold text-xl tracking-wide">
                  Situação tranquila
                </h1>
              </div>
              <p className="tracking-wide mt-2">
                Nenhum alerta crítico para {localAberto} no momento.
              </p>
            </div>

            <Link href={`/feed?local=${localAberto}`} className="w-full">
              <button className="bg-black w-full rounded-lg text-white flex items-center justify-center p-4 font-medium hover:bg-zinc-800 transition-all gap-2 cursor-pointer">
                Ver todas as postagens de {localAberto}
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}