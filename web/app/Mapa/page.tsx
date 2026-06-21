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
  const [climaPorCidade, setClimaPorCidade] = useState<{ [key: string]: any }>(
    {},
  );

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
  const chuvaMax =
    chuvaLista.length > 0
      ? Math.max(...chuvaLista.map((item: any) => item?.rain?.["3h"] ?? 0))
      : 0;

  return (
    <main className="h-screen w-full relative  mt-10">
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
        <div className="absolute top-15 left-35 w-72">
          <button
            onClick={() => setPainelAberto(!painelAberto)}
            className="w-full rounded-xl bg-white p-4 shadow-xl text-left border border-slate-200"
          >
            <h2 className="font-bold text-slate-800">Municípios Monitorados</h2>
            <p className="text-xs text-slate-500 mt-1 cursor-pointer">
              Busque e selecione uma cidade{" "}
              <span className="text-red-500 font-bold">clique aqui</span>
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
                    return nome
                      .toLowerCase()
                      .includes(buscaCidade.toLowerCase());
                  })
                  .sort((a: any, b: any) => {
                    const nomeA =
                      a.properties.NM_MUN ||
                      a.properties.name ||
                      a.properties.NM_MUNICIPIO;
                    const nomeB =
                      b.properties.NM_MUN ||
                      b.properties.name ||
                      b.properties.NM_MUNICIPIO;
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
                          cidadeSelecionada === nome
                            ? "bg-red-50 text-red-600 font-semibold"
                            : ""
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

      {/* CONTAINER FIXO DA DIREITA (Legenda + Card da Cidade alinhados) */}
      <div className="absolute top-15 right-4 z-[9999] flex flex-col gap-3 w-[360px]">
        {/* Card de Legenda Simplificado (Fica fixo no topo) */}
        <div className="bg-white/95 p-3 rounded-xl shadow-md border border-slate-200 w-full">
          <h4 className="text-xs font-bold text-slate-800 mb-2">
            Nível de gravidade dos alertas de chuva:
          </h4>
          <div className="flex flex-row gap-4 justify-between">
            {/* Verde */}
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full bg-[#16a34a] border border-black inline-block shrink-0"
                style={{ width: "14px", height: "14px" }}
              ></span>
              <span className="text-[11px] text-slate-700 font-medium">
                Baixo
              </span>
            </div>

            {/* Laranja */}
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full bg-[#ea580c] border border-black inline-block shrink-0"
                style={{ width: "14px", height: "14px" }}
              ></span>
              <span className="text-[11px] text-slate-700 font-medium">
                Médio
              </span>
            </div>

            {/* Vermelho */}
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full bg-[#dc2626] border border-black inline-block shrink-0"
                style={{ width: "14px", height: "14px" }}
              ></span>
              <span className="text-[11px] text-slate-700 font-medium">
                Alto
              </span>
            </div>

            {/* Roxo */}
            <div className="flex items-center gap-1.5">
              <span
                className="rounded-full bg-[#7c3aed] border border-black inline-block shrink-0"
                style={{ width: "14px", height: "14px" }}
              ></span>
              <span className="text-[11px] text-slate-700 font-medium">
                Crítico
              </span>
            </div>
          </div>
        </div>

        {/* Card Informativo da Cidade (Aparece logo abaixo da legenda no fluxo correto) */}
        {localAberto && (
          <div className="relative bg-white w-full overflow-y-auto rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 pb-6 custom-scrollbar">
            {/* Botão de fechar */}
            <button
              onClick={() => setLocalAberto(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-800 cursor-pointer text-sm"
            >
              ✕
            </button>

            {/* TÍTULO E SUBTÍTULO */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <CircleCheckBig className="text-green-500" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {localAberto}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-0.5 rounded border border-zinc-200 text-zinc-500 font-bold text-[11px] tracking-wide bg-white">
                    Monitorado
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Users size={14} />
                    <p className="font-medium">Dados Regionais</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DADOS DO CLIMA */}
            {climaCidadeAberta ? (
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-b border-slate-100 pb-3 bg-slate-50 p-2.5 rounded-xl">
                <span className="font-medium">
                  🌡️ <strong>{temperaturaAtual}°C</strong>
                </span>
                <span className="font-medium">
                  💧 <strong>{umidade}%</strong> umid.
                </span>
                <span className="col-span-2 text-[11px] text-slate-500 mt-0.5">
                  🌧️ <strong>{chuvaMax.toFixed(1)} mm</strong> próx. 24h
                </span>
                <span className="col-span-2 capitalize text-[11px] text-blue-600 font-medium">
                  ✨ {descricao}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Carregando dados do clima...
              </p>
            )}

            {/* CARDS DE ALERTAS */}
            <div className="grid grid-cols-3 w-full gap-2">
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex flex-col items-center justify-center text-center text-red-700">
                <TriangleAlert size={16} />
                <p className="text-[10px] mt-0.5 font-medium">Críticos</p>
                <div className="text-lg font-bold mt-0.5">10</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex flex-col items-center justify-center text-center text-yellow-700">
                <CircleAlert size={16} />
                <p className="text-[10px] mt-0.5 font-medium">Médios</p>
                <div className="text-lg font-bold mt-0.5">20</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex flex-col items-center justify-center text-center text-green-700">
                <CircleCheck size={16} />
                <p className="text-[10px] mt-0.5 font-medium">Baixos</p>
                <div className="text-lg font-bold mt-0.5">40</div>
              </div>
            </div>

            {/* BANNER SITUAÇÃO */}
            <div className="p-3 w-full bg-green-50 border border-green-200 rounded-xl flex flex-col text-green-800 text-xs">
              <div className="flex items-center gap-1.5">
                <CircleCheckBig size={16} className="text-green-600" />
                <h1 className="font-bold text-sm tracking-wide">
                  Situação tranquila
                </h1>
              </div>
              <p className="mt-1 text-green-700/90 leading-normal">
                Nenhum alerta crítico para {localAberto} no momento.
              </p>
            </div>

            {/* BOTÃO DE AÇÃO */}
            <Link href={`/feed?local=${localAberto}`} className="w-full mt-1">
              <button className="bg-slate-900 w-full rounded-xl text-white flex items-center justify-center p-3 text-xs font-semibold hover:bg-slate-800 transition-all gap-1.5 cursor-pointer active:scale-[0.98]">
                Ver postagens de {localAberto}
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
