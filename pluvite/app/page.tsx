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
  Users,
  AlertTriangle,
  Database,
  Siren,
  Navigation,
  CloudRain,
  Wind,
  Eye,
  TrendingUp,
  MapPin,
  GitBranch,
  Mail,
  BookOpen,
  HeartHandshake,
  ExternalLink,
} from "lucide-react";

const scrollTo = (id: string) => {
  const scrollContainer = document.querySelector(".overflow-y-auto");
  const el = document.getElementById(id);
  console.log("container:", scrollContainer);
  console.log("elemento:", el);
  console.log("scrollTop atual:", scrollContainer?.scrollTop);
  if (el && scrollContainer) {
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const top = scrollContainer.scrollTop + elTop - containerTop - 80;
    console.log("vai scrollar para:", top);
    scrollContainer.scrollTo({ top, behavior: "smooth" });
  }
};

export default function Home() {
  return (
    <div className="fixed h-screen w-full overflow-y-auto bg-white pt-12 font-sans antialiased text-slate-900 -mt-200px">
      <main>
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-30 flex flex-col items-center text-center gap-15">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
            <Activity size={16} className="animate-pulse" />
            Monitoramento do Vale do Paraíba e Litoral Norte
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight max-w-4xl text-slate-950 leading-tight">
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
                Iniciar sessão
                <ArrowRight size={22} />
              </button>
            </Link>
            <button
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors cursor-pointer shadow-md"
              onClick={() => scrollTo("emergencia")}
            >
              Contatos de Emergência
            </button>
          </div>
        </section>

        {/* PAINEL */}
        <section
          id="painel"
          className="w-full bg-slate-50 border-y border-slate-200/60 py-30"
        >
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
        <section id="recursos" className="max-w-6xl mx-auto px-6 py-30">
          <div className="mb-14 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
              Recursos do Sistema
            </h2>
            <p className="text-lg text-slate-500 font-medium mt-2">
              Ecossistema completo voltado à contenção de riscos e segurança da
              população
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

        {/* COMUNICAÇÃO */}
        <section
          id="comunicacao"
          className="w-full bg-slate-50 border-t border-slate-200/60 py-20"
        >
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

            {/* Como funciona o fluxo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mt-12">
              <h3 className="text-2xl font-extrabold text-slate-950 mb-8 text-center">
                Como Funciona o Fluxo de Comunicação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                {[
                  {
                    icon: Users,
                    titulo: "Cidadão reporta",
                    desc: "Relato via app com foto e localização",
                    cor: "bg-blue-600",
                  },
                  {
                    icon: Database,
                    titulo: "Sistema processa",
                    desc: "IA classifica risco e urgência",
                    cor: "bg-purple-600",
                  },
                  {
                    icon: Siren,
                    titulo: "Alerta gerado",
                    desc: "Notificação enviada à região",
                    cor: "bg-amber-500",
                  },
                  {
                    icon: Building2,
                    titulo: "Prefeitura recebe",
                    desc: "Painel atualizado com o chamado",
                    cor: "bg-emerald-600",
                  },
                  {
                    icon: Navigation,
                    titulo: "Equipe despachada",
                    desc: "Resposta no local em minutos",
                    cor: "bg-red-500",
                  },
                ].map(({ icon: Icon, titulo, desc, cor }, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-2 relative"
                  >
                    <div
                      className={`w-12 h-12 ${cor} text-white rounded-xl flex items-center justify-center shadow-md`}
                    >
                      <Icon size={22} />
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{titulo}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {desc}
                    </p>
                    {i < 4 && (
                      <ArrowRight
                        size={18}
                        className="hidden sm:block absolute -right-3 top-3 text-slate-300"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Municípios monitorados */}
            <div className="mt-8 bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-extrabold mb-6 text-center">
                Principais Municípios Monitorados
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Taubaté",
                  "São José dos Campos",
                  "Jacareí",
                  "Pindamonhangaba",
                  "Guaratinguetá",
                  "Lorena",
                  "Campos do Jordão",
                  "Ubatuba",
                  "Caraguatatuba",
                  "São Sebastião",
                  "Cunha",
                  "Lagoinha",
                  "Tremembé",
                  "Caçapava",
                  "Aparecida",
                  "Potim",
                ].map((cidade) => (
                  <div
                    key={cidade}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  >
                    <MapPin size={13} className="text-blue-200 flex-shrink-0" />
                    <span className="text-sm font-medium">{cidade}</span>
                  </div>
                ))}
              </div>
              <p className="text-blue-200 text-sm text-center mt-5">
                + 23 municípios adicionais na região do Vale do Paraíba e
                Litoral Norte
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORIZAÇÃO */}
        <section
          id="riscos"
          className="w-full border-y border-slate-200/60 py-20"
        >
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
                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2">
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
                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2">
                  Índice de chuva crítico acumulado.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-amber-500 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="font-bold text-slate-900 text-xl">
                    Atenção Crítica
                  </h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2">
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
                <p className="text-sm text-slate-500 leading-relaxed ml-4 -mt-2">
                  Condições estáveis e normais.
                </p>
              </div>
            </div>

            {/* Tipos de ocorrência */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mt-14">
              <h3 className="text-2xl font-extrabold text-slate-950 mb-6">
                Tipos de Ocorrência Monitorados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    icon: CloudRain,
                    titulo: "Enchentes e Inundações",
                    desc: "Monitoramento do nível de rios, córregos e áreas historicamente alagáveis com alertas preditivos.",
                    cor: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: AlertTriangle,
                    titulo: "Deslizamentos",
                    desc: "Análise de encostas instáveis, saturação do solo e histórico de movimentações de terra na região.",
                    cor: "text-red-600",
                    bg: "bg-red-50",
                  },
                  {
                    icon: Wind,
                    titulo: "Ventos Fortes e Tempestades",
                    desc: "Rastreamento de frentes frias, rajadas de vento e eventos de granizo que afetam a infraestrutura.",
                    cor: "text-cyan-600",
                    bg: "bg-cyan-50",
                  },
                  {
                    icon: TrendingUp,
                    titulo: "Elevação do Nível do Mar",
                    desc: "Alerta para ressacas, maré alta e avanço do mar em municípios do Litoral Norte paulista.",
                    cor: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: AlertTriangle,
                    titulo: "Infraestrutura Danificada",
                    desc: "Registro de pontes interditadas, rodovias bloqueadas, quedas de energia e outros danos estruturais.",
                    cor: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                  {
                    icon: Eye,
                    titulo: "Visibilidade Crítica",
                    desc: "Monitoramento de neblina densa e baixa visibilidade em rodovias de serra e vias de acesso críticas.",
                    cor: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                ].map(({ icon: Icon, titulo, desc, cor, bg }) => (
                  <div
                    key={titulo}
                    className="flex gap-4 p-5 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon size={20} className={cor} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {titulo}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-20 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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

        {/* ÂNCORA DA EMERGÊNCIA */}
        <div
          id="emergencia"
          className="w-full"
          style={{ marginBottom: "-120px", paddingTop: "120px" }}
        />

        {/* EMERGÊNCIA */}
        <section className="w-full bg-red-600 text-white py-30 px-6">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-10 pb-10 border-b border-white/20">
              <div className="flex flex-col md:flex-row items-start gap-5 max-w-xl">
                <div className="w-14 h-14 rounded-xl bg-red-800 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-extrabold text-3xl">
                    Números de Emergência
                  </h4>
                  <p className="text-red-100 mt-2 leading-relaxed">
                    Em caso de riscos iminentes, acione o socorro imediatamente.
                    Não espere — a rapidez no acionamento pode salvar vidas.
                    Mantenha esses números salvos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                {[
                  {
                    label: "Defesa Civil",
                    numero: "199",
                    desc: "Desastres naturais e evacuações",
                  },
                  {
                    label: "Bombeiros",
                    numero: "193",
                    desc: "Incêndios, resgates e acidentes",
                  },
                  {
                    label: "SAMU",
                    numero: "192",
                    desc: "Emergências médicas e trauma",
                  },
                ].map(({ label, numero, desc }) => (
                  <div
                    key={label}
                    className="bg-white hover:bg-[#ececea] p-5 rounded-xl text-center shadow-md transition-colors"
                  >
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      {label}
                    </span>
                    <p className="text-3xl font-black text-slate-900 my-1">
                      {numero}
                    </p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-red-700/50 border border-white/10 rounded-xl p-5">
                <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> Em caso de enchente
                </h5>
                <ul className="text-sm text-red-100 flex flex-col gap-1.5">
                  <li>• Desligue a energia elétrica</li>
                  <li>• Suba para locais altos imediatamente</li>
                  <li>• Não atravesse áreas alagadas</li>
                  <li>• Ligue 199 para a Defesa Civil</li>
                </ul>
              </div>
              <div className="bg-red-700/50 border border-white/10 rounded-xl p-5">
                <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> Em caso de deslizamento
                </h5>
                <ul className="text-sm text-red-100 flex flex-col gap-1.5">
                  <li>• Afaste-se da encosta imediatamente</li>
                  <li>• Não retorne ao imóvel</li>
                  <li>• Procure abrigo seguro</li>
                  <li>• Avise vizinhos em risco</li>
                </ul>
              </div>
              <div className="bg-red-700/50 border border-white/10 rounded-xl p-5">
                <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> Kit de emergência
                </h5>
                <ul className="text-sm text-red-100 flex flex-col gap-1.5">
                  <li>• Documentos em saco plástico</li>
                  <li>• Água e alimentos não perecíveis</li>
                  <li>• Lanternas e pilhas extras</li>
                  <li>• Medicamentos essenciais</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* BRANQUINHO DEPOIS DA EMERGÊNCIA */}
        <div className="w-full h-2 bg-white" />

        {/* FOOTER COMPLETO */}
        {/* FOOTER COMPLETO */}
        <footer className="w-full bg-slate-900 text-slate-400 pt-10 pb-6 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Grid principal do footer — Reduzi o gap horizontal para aproximar as colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-x-8 pb-6 border-b border-slate-800">
              {/* Coluna 1 — Marca */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white font-extrabold text-xl">
                  <Activity size={20} className="text-blue-400 animate-pulse" />
                  Pluvite
                </div>
                <p className="text-sm leading-relaxed text-slate-400">
                  Sistema de monitoramento de desastres naturais para o Vale do
                  Paraíba e Litoral Norte
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sistema operacional
                </div>
              </div>

              {/* Coluna 2 — Navegação */}
              <div className="flex flex-col gap-2">
                <h6 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                  Navegação
                </h6>
                {[
                  { label: "Painel de Controle", id: "painel" },
                  { label: "Recursos do Sistema", id: "recursos" },
                  { label: "Municípios", id: "comunicacao" },
                  { label: "Categorização de Riscos", id: "riscos" },
                  { label: "Emergência", id: "emergencia" },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Coluna 3 — Contatos de emergência rápidos (Largura máxima controlada para puxar para a esquerda) */}
              <div className="flex flex-col gap-2 lg:max-w-[220px]">
                <h6 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                  Emergência Rápida
                </h6>
                {[
                  {
                    label: "Defesa Civil",
                    numero: "199",
                    cor: "text-emerald-400",
                  },
                  { label: "Bombeiros", numero: "193", cor: "text-red-400" },
                  { label: "SAMU", numero: "192", cor: "text-blue-400" },
                  {
                    label: "Polícia Militar",
                    numero: "190",
                    cor: "text-purple-400",
                  },
                ].map(({ label, numero, cor }, index, arr) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between text-sm pb-1.5 ${
                      index !== arr.length - 1
                        ? "border-b border-slate-800"
                        : ""
                    }`}
                  >
                    <span className="text-slate-400">{label}</span>
                    <span className={`font-black ${cor}`}>{numero}</span>
                  </div>
                ))}
              </div>

              {/* Coluna 4 — Sobre o projeto */}
              <div className="flex flex-col gap-2">
                <h6 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                  Sobre o Projeto
                </h6>
                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <BookOpen
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-slate-500"
                  />
                  <span>
                    Projeto acadêmico desenvolvido no Centro Paula Souza —
                    FATEC
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <HeartHandshake
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-slate-500"
                  />
                  <span>
                    Desenvolvido com foco na proteção de +3 milhões de cidadãos
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <Mail
                    size={14}
                    className="mt-0.5 flex-shrink-0 text-slate-500"
                  />
                  <span>projetopluvite@gmail.com</span>
                </div>
                {/*<div className="flex items-center gap-3 mt-1">
                  <a
                    href="#"
                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="GitBranch"
                  >
                    <GitBranch size={16} className="text-slate-300" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Documentação"
                  >
                    <ExternalLink size={16} className="text-slate-300" />
                  </a>
                </div>*/}
              </div>
            </div>

            {/* Rodapé inferior */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                &copy; 2026 Pluvite · Centro Paula Souza — Desenvolvido para
                fins acadêmicos
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-slate-600" />
                  Vale do Paraíba e Litoral Norte, SP
                </span>
              </div>
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
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
