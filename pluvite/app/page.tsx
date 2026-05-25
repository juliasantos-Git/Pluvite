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
    <div className="fixed h-screen w-full overflow-y-auto bg-white pt-12 font-sans antialiased text-slate-900 -mt-5">
      <main>
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 pt-15 pb-30 flex flex-col items-center text-center gap-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
            <Activity size={16} className="animate-pulse" />
            Monitoramento do Vale do Paraíba e Litoral Norte
          </div>

          <h1 className="text-5=4xl md:text-5xl font-extrabold tracking-tight max-w-4xl text-slate-950 leading-tight">
            Sistema de Monitoramento de Riscos do Vale
          </h1>

          <p className="text-lg text-slate-600 max-w-4xl leading-relaxed font-medium">
            Desenvolvido para a região do Vale do Paraíba e Litoral Norte, o
            Pluvite é um sistema de monitoramento de desastres naturais. Com o
            objetivo de prevenir enchentes, deslizamentos e outras complicações
            decorrentes de chuvas intensas, ventos fortes e infraestrutura
            danificada, a plataforma envia alertas em tempo real à população.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/cadastro-cidadao">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/10">
                Acessar Mapa
                <ArrowRight size={22} />
              </button>
            </Link>

            <button
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors cursor-pointer shadow-md"
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

        {/* PAINEL */}
        <section className="w-full bg-slate-50 border-y border-slate-200/60 py-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="text-center lg:text-left">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                Dados unificados
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight mt-2">
                Análise e Despacho Integrado
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed mt-4">
                O Pluvite centraliza chamados, monitora cidades criticamente
                afetadas e oferece suporte visual imediato para equipes de
                resposta.
              </p>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                  <span className="text-xs opacity-90">Chamados</span>
                  <p className="text-2xl font-bold">6</p>
                </div>

                <div className="bg-red-500 text-white p-3 rounded-xl">
                  <span className="text-xs opacity-90">Críticos</span>
                  <p className="text-2xl font-bold">3</p>
                </div>

                <div className="bg-amber-500 text-white p-3 rounded-xl">
                  <span className="text-xs opacity-90">Andamento</span>
                  <p className="text-2xl font-bold">2</p>
                </div>

                <div className="bg-emerald-500 text-white p-3 rounded-xl">
                  <span className="text-xs opacity-90">Concluídos</span>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>

              <div className="mt-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ocorrências por Município
                </span>

                <div className="h-28 flex items-end gap-3 pt-4 border-b border-slate-200 px-2">
                  <div
                    className="bg-red-500 w-full rounded-t-md"
                    style={{ height: "70%" }}
                  />

                  <div
                    className="bg-amber-500 w-full rounded-t-md"
                    style={{ height: "95%" }}
                  />

                  <div
                    className="bg-emerald-500 w-full rounded-t-md"
                    style={{ height: "45%" }}
                  />

                  <div
                    className="bg-blue-500 w-full rounded-t-md"
                    style={{ height: "20%" }}
                  />

                  <div
                    className="bg-purple-500 w-full rounded-t-md"
                    style={{ height: "60%" }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 mt-2">
                  <span>Taubaté</span>
                  <span>Campos do Jordão</span>
                  <span>Ubatuba</span>
                  <span>Cunha</span>
                  <span>Lagoinha</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-14 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
              Recursos do Sistema
            </h2>

            <p className="text-lg text-slate-500 font-medium mt-2">
              Ecossistema completo voltado à contenção de riscos e segurança da população
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white cursor-pointer border border-slate-200 p-8 rounded-2xl shadow-sm hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Map size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-950 mt-5">
                Mapa Interativo
              </h3>

              <p className="text-base text-slate-600 leading-relaxed mt-2">
                Exibe os polígonos de risco e a situação de alerta de cada
                município em tempo real.
              </p>
            </div>

            <div className="bg-white cursor-pointer border border-slate-200 p-8 rounded-2xl shadow-sm hover:border-purple-600 transition-colors">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Rss size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-950 mt-5">
                Feed Colaborativo
              </h3>

              <p className="text-base text-slate-600 leading-relaxed mt-2">
                Permite publicar ocorrências locais com fotos e texto.
              </p>
            </div>

            <div className="bg-white cursor-pointer border border-slate-200 p-8 rounded-2xl shadow-sm hover:border-amber-500 transition-colors">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <CloudSun size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-950 mt-5">
                Dados Climáticos
              </h3>

              <p className="text-base text-slate-600 leading-relaxed mt-2">
                Acompanhamento de índices pluviométricos e alertas
                meteorológicos.
              </p>
            </div>

            <div className="bg-white cursor-pointer border border-slate-200 p-8 rounded-2xl shadow-sm hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <Compass size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-950 mt-5">
                Rotas Inteligentes
              </h3>

              <p className="text-base text-slate-600 leading-relaxed mt-2">
                Rotas alternativas para evitar locais bloqueados ou inundados.
              </p>
            </div>
          </div>
        </section>

        {/* PROPÓSITO */}
        <section className="w-full bg-slate-50 border-t border-slate-200/60 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950">
              Comunicação Direta com as Prefeituras
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mt-9">
              O projeto aprimora a comunicação entre cidadãos e prefeituras,
              reforçando a segurança e minimizando os efeitos de desastres
              naturais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-left">
              <div className="flex gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <ShieldCheck className="text-emerald-500 mt-1" size={25} />

                <div>
                  <h4 className="font-bold text-slate-900 text-xl">
                    Prevenção Direta
                  </h4>

                  <p className="text-lg text-slate-500 mt-2">
                    Evita acidentes estruturais e logísticos graves.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <BellRing className="text-blue-600 mt-1" size={25} />

                <div>
                  <h4 className="font-bold text-slate-900 text-xl">
                    Alertas em Tempo Real
                  </h4>

                  <p className="text-lg text-slate-500 mt-2">
                    Notificações críticas para a população.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <Building2 className="text-purple-600 mt-1" size={25} />

                <div>
                  <h4 className="font-bold text-slate-900 text-xl">
                    Integração Municipal
                  </h4>

                  <p className="text-lg text-slate-500 mt-2">
                    Respostas rápidas das defesas civis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RISCOS */}
        <section className="w-full border-y border-slate-200/60 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950">
                Categorização de Riscos
              </h2>

              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mt-5">
                O sistema analisa dados pluviométricos e relatos em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />

                  <h3 className="font-bold text-xl text-slate-900">
                    Alerta Máximo
                  </h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2 cursor-pointer">
                  Inundações iminentes ou deslizamentos detectados.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-red-500 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

                  <h3 className="font-bold text-xl text-slate-900">
                    Estado de Alerta
                  </h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2 cursor-pointer">
                  Índice de chuva crítico acumulado.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-amber-500 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />

                  <h3 className="font-bold text-xl text-slate-900">
                    Atenção Crítica
                  </h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2 cursor-pointer">
                  Previsão de tempestades severas na região.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-emerald-500 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                  <h3 className="font-bold text-xl text-slate-900">
                    Zona Segura
                  </h3>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2 cursor-pointer">
                  Condições estáveis e normais.
                </p>
              </div>
            </div>
            {/*MUNICIPIOS MONITORADOS */}
            <div className="mt-26 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-black text-slate-950">39</p>

                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">
                  Municípios Monitorados
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-slate-950">100%</p>

                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">
                  Colaborativo
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-slate-950">Tempo real</p>

                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">
                  Atualização contínua
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-slate-950">+3M</p>

                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">
                  Cidadãos protegidos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          id="emergencia"
          className="w-full bg-red-600 text-white py-10 px-6 border-t-4 border-red-700"
        >
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/20">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left max-w-xl">
                <div className="w-14 h-14 rounded-xl bg-red-800 flex items-center justify-center shadow-lg">
                  <Phone size={28} />
                </div>

                <div>
                  <h4 className="font-extrabold text-3xl">
                    Números de Emergência
                  </h4>

                  <p className="text-[17px] text-red-100 mt-1">
                    Em caso de riscos iminentes, acione o socorro imediatamente.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                <div className="bg-white hover:bg[#e5020c] p-4 rounded-xl text-center min-w-[180px] shadow-md">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Defesa Civil
                  </span>

                  <p className="text-2xl font-black text-slate-900">199</p>
                </div>

                <div className="bg-white hover:bg[#e5020c] p-4 rounded-xl text-center min-w-[180px] shadow-md">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Bombeiros
                  </span>

                  <p className="text-2xl font-black text-slate-900">193</p>
                </div>

                <div className="bg-white hover:bg[#e5020c] p-4 rounded-xl text-center min-w-[180px] shadow-md">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    SAMU
                  </span>

                  <p className="text-2xl font-black text-slate-900">192</p>
                </div>
              </div>
            </div>

            <p className="text-center text-red-100/85 text-sm font-medium tracking-wide">
              &copy; 2026 Pluvite • @CPS - Desenvolvido para fins acadêmicos
            </p>
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
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
