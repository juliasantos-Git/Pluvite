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
} from "lucide-react";
import Link from "next/link";
import { supabase } from "../lib/banco";

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
  const [exibirAlerta, setExibirAlerta] = useState(false);
  const [buscaCidade, setBuscaCidade] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [painelAberto, setPainelAberto] = useState(false);
  const [climaPorCidade, setClimaPorCidade] = useState<{ [key: string]: any }>({});

  const [dadosAlerta, setDadosAlerta] = useState<{
    cidade: string;
    condicao: string;
    temperatura: string;
    nome: string;
  } | null>(null);

  useEffect(() => {
    fetch("/map.json")
      .then((res) => res.json())
      .then((data) => setDadosBairros(data))
      .catch((err) => console.error("Erro ao carregar o mapa JSON:", err));
  }, []);

  useEffect(() => {
    const idCidadaoLogado = 1;
    const nomeCidadaoLogado = "Quezia";

    const canalRealtimes = supabase
      .channel("canal-pluvite")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alertas_tempo_real" },
        (payload) => {
          const novoAlerta = payload.new;
          if (novoAlerta.id_cidadao === idCidadaoLogado) {
            setDadosAlerta({
              cidade: novoAlerta.cidade_alerta,
              condicao: novoAlerta.condicao,
              temperatura: novoAlerta.temperatura,
              nome: nomeCidadaoLogado,
            });
            setExibirAlerta(true);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalRealtimes);
    };
  }, []);

  const climaCidadeAberta = localAberto ? climaPorCidade[localAberto] : null;
  const temperaturaAtual = climaCidadeAberta?.list?.[0]?.main?.temp?.toFixed(1);
  const umidade = climaCidadeAberta?.list?.[0]?.main?.humidity;
  const descricao = climaCidadeAberta?.list?.[0]?.weather?.[0]?.description;
  const chuvaLista = climaCidadeAberta?.list?.slice(0, 8) ?? [];
  const chuvaMax = chuvaLista.length > 0
    ? Math.max(...chuvaLista.map((item: any) => item?.rain?.["3h"] ?? 0))
    : 0;

  return (
    <main className="h-screen w-full relative">
      {dadosBairros ? (
        <MapaSemSSR
          bairrosDados={dadosBairros}
          setLocalAberto={setLocalAberto}
          cidadeSelecionada={cidadeSelecionada}
          climaPorCidade={climaPorCidade}
          setClimaPorCidade={setClimaPorCidade}
        />
      ) : (
        <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">
          <p className="animate-pulse tracking-wide text-sm font-medium">
            A ler dados geográficos...
          </p>
        </div>
      )}

      {dadosBairros && (
        <div className="absolute top-10 left-20 z-[9999] w-72">
          <button
            onClick={() => setPainelAberto(!painelAberto)}
            className="w-full rounded-xl bg-white p-4 shadow-xl text-left border border-slate-200"
          >
            <h2 className="font-bold text-slate-800">Municípios Monitorados</h2>
            <p className="text-xs text-slate-500 mt-1 cursor-pointer">
              Busque e selecione uma cidade
            </p>
          </button>

          {painelAberto && (
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Digite uma cidade..."
                  value={buscaCidade}
                  onChange={(e) => setBuscaCidade(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                />
              </div>

              {cidadeSelecionada && (
                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 text-sm cursor-pointer">
                    <span className="font-medium text-red-600">
                      {cidadeSelecionada}
                    </span>
                    <button
                      onClick={() => {
                        setCidadeSelecionada("");
                        setBuscaCidade("");
                      }}
                      className="text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="max-h-[350px] overflow-y-auto">
                {dadosBairros.features
                  ?.filter((feature: any) => {
                    const nome =
                      feature.properties.NM_MUN ||
                      feature.properties.name ||
                      feature.properties.NM_MUNICIPIO ||
                      "";
                    return nome.toLowerCase().includes(buscaCidade.toLowerCase());
                  })
                  .sort((a: any, b: any) => {
                    const nomeA = a.properties.NM_MUN || a.properties.name || a.properties.NM_MUNICIPIO;
                    const nomeB = b.properties.NM_MUN || b.properties.name || b.properties.NM_MUNICIPIO;
                    return nomeA.localeCompare(nomeB);
                  })
                  .map((feature: any, index: number) => {
                    const nome =
                      feature.properties.NM_MUN ||
                      feature.properties.name ||
                      feature.properties.NM_MUNICIPIO;

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setCidadeSelecionada(nome);
                          setLocalAberto(nome);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 transition cursor-pointer ${
                          cidadeSelecionada === nome ? "bg-red-50 text-red-600 font-semibold" : ""
                        }`}
                      >
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span>{nome}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {localAberto && (
        <div className="fixed inset-0 left-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
                <h2 className="text-3xl font-bold text-slate-900">{localAberto}</h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="px-3 py-1 rounded-md border border-zinc-300 text-zinc-600 font-bold text-sm tracking-wide bg-white">
                    Monitorado
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Users size={18} />
                    <p className="tracking-wide text-sm font-medium">Dados Regionais</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DADOS DO CLIMA — linha simples e discreta */}
            {climaCidadeAberta ? (
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 border-b border-slate-100 pb-4">
                <span><strong>{temperaturaAtual}°C</strong></span>
                <span><strong>{umidade}%</strong> umidade</span>
                <span><strong>{chuvaMax.toFixed(1)} mm</strong> nas próximas 24h</span>
                <span className="capitalize"> {descricao}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Carregando dados do clima...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-3">
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

            <div className="p-3 w-full bg-green-100 border border-green-700 rounded-xl flex flex-col text-green-800">
              <div className="flex items-center gap-2">
                <CircleCheckBig size={22} />
                <h1 className="font-bold text-xl tracking-wide">Situação tranquila</h1>
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