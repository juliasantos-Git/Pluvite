"use client";

import Link from "next/link";
import {
  Map,
  Rss,
  CloudSun,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building2,
  BellRing,
  Activity,
  BarChart3,
  Phone,
  ArrowUp,
} from "lucide-react";

export default function Home() {
  return (
    /* CORREÇÃO DO SCROLL: Mudamos de fixed/h-screen para uma estrutura de bloco fluída. 
       Isso faz o scroll-smooth (rolagem suave) funcionar nativamente. */
    <div className="w-full bg-white text-slate-900 font-sans antialiased pt-12 overflow-y-auto h-screen -mt-5 fixed">
      {/* Main fluído e sem travas de altura */}
      <main className="w-full">
        {/* --- SEÇÃO PRINCIPAL (HERO) --- */}
        <section className="max-w-5xl mx-auto px-6 pt-15 pb-20 flex flex-col items-center text-center gap-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
            <Activity size={16} className="animate-pulse" />
            Sistema Ativo: Monitoramento Vale do Paraíba e Litoral Norte
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-slate-950 leading-tight">
            Sistema de Monitoramento de Riscos do Vale
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl leading-relaxed font-medium">
            Desenvolvido para a região do Vale do Paraíba e Litoral Norte, o
            Pluvite é um sistema de monitoramento de desastres naturais. Com o
            objetivo de prevenir enchentes, deslizamentos e outras complicações
            decorrentes de chuvas intensas, ventos fortes e infraestrutura
            danificada, a plataforma envia alertas em tempo real à população.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4 w-full sm:w-auto">
            <Link href="/cadastro-cidadao" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-10 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/10">
                Acessar Mapa Interativo
                <ArrowRight size={22} />
              </button>
            </Link>
            <button
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl px-10 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              onClick={() => {
                document
                  .getElementById("emergencia")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contatos de Emergência
            </button>
          </div>
        </section>

        {/* --- SEÇÃO: VISUALIZAÇÃO DE COMPONENTES E GRÁFICOS --- */}
        <section className="w-full bg-slate-50 border-t border-b border-slate-200/60 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1 flex flex-col gap-4 text-center lg:text-left">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                  Dados unificados
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
                  Análise e Despacho Integrado
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  O Pluvite centraliza chamados, monitora bairros criticamente
                  afetados e oferece suporte visual imediato para equipes de
                  resposta.
                </p>
              </div>

              <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-blue-600" size={20} />
                    <span className="font-bold text-sm text-slate-800">
                      Visão Geral do Painel
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                    Atualizado agora
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-blue-600 text-white p-3 rounded-xl">
                    <span className="text-xs font-medium opacity-90 block mb-1">
                      Chamados
                    </span>
                    <span className="text-2xl font-bold">6</span>
                  </div>
                  <div className="bg-red-500 text-white p-3 rounded-xl">
                    <span className="text-xs font-medium opacity-90 block mb-1">
                      Críticos
                    </span>
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <div className="bg-amber-500 text-white p-3 rounded-xl">
                    <span className="text-xs font-medium opacity-90 block mb-1">
                      Andamento
                    </span>
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <div className="bg-emerald-500 text-white p-3 rounded-xl">
                    <span className="text-xs font-medium opacity-90 block mb-1">
                      Concluídos
                    </span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ocorrências por Município (Exemplo)
                  </span>
                  <div className="h-28 w-full flex items-end gap-3 pt-4 border-b border-slate-200 px-2">
                    <div
                      className="bg-red-500 w-full rounded-t-md transition-all"
                      style={{ height: "70%" }}
                    ></div>
                    <div
                      className="bg-amber-500 w-full rounded-t-md transition-all"
                      style={{ height: "95%" }}
                    ></div>
                    <div
                      className="bg-emerald-500 w-full rounded-t-md transition-all"
                      style={{ height: "45%" }}
                    ></div>
                    <div
                      className="bg-blue-500 w-full rounded-t-md transition-all"
                      style={{ height: "20%" }}
                    ></div>
                    <div
                      className="bg-purple-500 w-full rounded-t-md transition-all"
                      style={{ height: "60%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                    <span>Taubaté</span> <span>Campos do Jordão</span>{" "}
                    <span>Ubatuba</span> <span>Cunha</span>{" "}
                    <span>Lagoinha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE RECURSOS (GRID DE QUADROS) --- */}
        <section className="max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="flex flex-col gap-2 mb-14 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
              Recursos do Sistema
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Ecossistema completo voltado à contenção de riscos e segurança
              urbana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Mapa Interativo
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Exibe de forma detalhada os polígonos de risco e a situação de
                alerta de cada município em tempo real.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-purple-600 transition-colors group">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Rss size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Feed Colaborativo
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Permite aos moradores publicar ocorrências locais como
                alagamentos e quedas de árvores com fotos e texto.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-amber-500 transition-colors group">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <CloudSun size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Dados Climáticos
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Acompanhamento de índices pluviométricos e alertas
                meteorológicos diretos para prevenção ágil.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-emerald-500 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Rotas Inteligentes
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Cálculo de caminhos e rotas alternativas que evitam
                automaticamente ruas bloqueadas ou inundadas.
              </p>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DO PROPÓSITO E COMPLEMENTOS --- */}
        <section className="w-full bg-slate-50 border-t border-slate-200/60 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-8">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950">
              Comunicação Direta com as Prefeituras
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              O objetivo do projeto é aprimorar a comunicação entre os cidadãos
              e as prefeituras, reforçando a segurança e minimizando os efeitos
              de desastres naturais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-6 text-left">
              <div className="flex items-start gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm pb-12">
                <ShieldCheck
                  className="text-emerald-500 shrink-0 mt-0.5"
                  size={25}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-2xl mb-2">
                    Prevenção Direta
                  </h4>
                  <p className="text-xl text-slate-500 mt-1">
                    Evita acidentes estruturais e logísticos graves.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm pb-12">
                <BellRing className="text-blue-600 shrink-0 mt-0.5" size={25} />
                <div>
                  <h4 className="font-bold text-slate-900 text-2xl mb-2">
                    Alertas em Tempo Real
                  </h4>
                  <p className="text-xl text-slate-500 mt-1">
                    Envio de notificações críticas à população do Vale.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm pb-12">
                <Building2
                  className="text-purple-600 shrink-0 mt-0.5"
                  size={25}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-2xl mb-2">
                    Integração Municipal
                  </h4>
                  <p className="text-xl text-slate-500 mt-1">
                    Garante respostas rápidas das defesas civis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE INDICADORES --- */}
        <section className="w-full bg-slate-50 border-t border-b border-slate-200/60 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col gap-2">
              <h2 className="text-5xl mb-4 font-extrabold tracking-tight text-slate-950">
                Categorização de Riscos
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                O sistema analisa dados pluviométricos e relatos em tempo real
                para mapear a criticidade de cada município.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col gap-2 hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-2 text-purple-600">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <h3 className="font-bold text-2xl text-slate-900">
                    Alerta Máximo
                  </h3>
                </div>
                <p className="text-[40x] ml-3 text-slate-500 leading-relaxed">
                  Inundações iminentes ou deslizamentos detectados. Orientação
                  de evacuação imediata.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col gap-2 hover:border-red-500 transition-colors">
                <div className="flex items-center gap-2 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <h3 className="font-bold text-2xl text-slate-900">
                    Estado de Alerta
                  </h3>
                </div>
                <p className="text-[40x] ml-3  text-slate-500 leading-relaxed">
                  Índice de chuva crítico acumulado. Altos riscos de transbordo
                  de rios e bloqueios.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col gap-2 hover:border-amber-500 transition-colors">
                <div className="flex items-center gap-2 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h3 className="font-bold text-2xl  text-slate-900">
                    Atenção Crítica
                  </h3>
                </div>
                <p className="text-[40x] ml-3 text-slate-500 leading-relaxed">
                  Previsão de tempestades severas na região. Equipes de
                  prontidão técnica.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col gap-2 hover:border-emerald-500 transition-colors">
                <div className="flex items-center gap-2 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="font-bold text-2xl  text-slate-900">
                    Zona Segura
                  </h3>
                </div>
                <p className="text-[40x] ml-3  text-slate-500 leading-relaxed">
                  Condições estáveis e normais. Sem registros de incidentes nas
                  últimas 24 horas.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-slate-950 mb-3">39</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Municípios Monitoradas
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-950 mb-3">100%</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Colaborativo
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-950 mb-3">
                  Tempo real
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Atualização Contínua
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-950 mb-3">+3M</p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Cidadãos Protegidos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEÇÃO: CONTATOS DE EMERGÊNCIA (FOOTER ATUALIZADO) --- */}
        <footer
          id="emergencia"
          className="w-full bg-red-600 text-white py-10 px-6 border-t-4 border-red-700"
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            {/* Bloco de Conteúdo Superior */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/20">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left max-w-xl">
                <div className="w-14 h-14 rounded-xl bg-red-700 text-white flex items-center justify-center shrink-0 shadow-lg">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-extrabold text-3xl">
                    Números de Emergência
                  </h4>
                  <p className="text-[17px] text-red-100 mt-1">
                    Em caso de alagamentos, deslizamentos ou riscos iminentes,
                    acione o socorro imediatamente.
                  </p>
                </div>
              </div>

              {/* Cards de contatos organizados em grid, sem animação de pulo e com hover sutil */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                <div className="bg-white p-4 rounded-xl text-center min-w-[180px] shadow-md hover:bg-slate-100 transition-colors duration-200">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                    Defesa Civil
                  </span>
                  <span className="text-2xl font-black text-slate-900 block mt-0.5">
                    199
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl text-center min-w-[180px] shadow-md hover:bg-slate-100 transition-colors duration-200">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                    Bombeiros
                  </span>
                  <span className="text-2xl font-black text-slate-900 block mt-0.5">
                    193
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl text-center min-w-[180px] shadow-md hover:bg-slate-100 transition-colors duration-200">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                    SAMU
                  </span>
                  <span className="text-2xl font-black text-slate-900 block mt-0.5">
                    192
                  </span>
                </div>
              </div>
            </div>

            {/* Texto acadêmico centralizado na base */}
            <div className="text-center text-red-100/85 text-sm font-medium tracking-wide">
              <p>
                &copy; 2026 Pluvite &bull; @CPS - Desenvolvido para fins
                acadêmicos
              </p>
            </div>
          </div>
        </footer>
      </main>
      <button
        onClick={() => {
          document
            .querySelector(".overflow-y-auto")
            ?.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Voltar ao topo"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}