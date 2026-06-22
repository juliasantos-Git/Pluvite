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
  Mail,
  BookOpen,
  HeartHandshake,
} from "lucide-react";
import { text } from "stream/consumers";
import Navbar from "./components/navbar";

// ─── Scroll  ──────────────────────────────────────────────────────────────
const scrollTo = (id: string) => {
  const scrollContainer = document.querySelector(".overflow-y-auto");
  const el = document.getElementById(id);
  if (el && scrollContainer) {
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const top = scrollContainer.scrollTop + elTop - containerTop - 80;
    scrollContainer.scrollTo({ top, behavior: "smooth" });
  }
};

export default function Home() {
  return (
    <div className="fixed h-screen w-full overflow-y-auto bg-slate-50 pt-12 font-sans antialiased text-slate-800">
      <main>
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <Navbar></Navbar>
        <section className="max-w-5xl mx-auto px-6 pt-12 pb-20 flex flex-col items-center text-center gap-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ccddff] bg-[#eff5ff] text-slate-700 text-xs font-bold tracking-widest uppercase shadow-sm">
            <Activity size={13} className="text-[#2C4A6F]" />
            Monitoramento do Vale do Paraíba e Litoral Norte
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1] max-w-3xl">
            Sistema de Monitoramento{" "}
            <span className="text-[#0d43af]">de Riscos do Vale do Paraíba</span>
          </h1>

          <p className="text-lg text-slate-800 font-medium max-w-4xl leading-relaxed">
            Desenvolvido para a região do Vale do Paraíba e Litoral Norte, o
            Pluvite é um sistema de monitoramento de desastres naturais. Com o
            objetivo de prevenir enchentes, deslizamentos e outras complicações
            decorrentes de chuvas intensas, ventos fortes e infraestrutura
            danificada, a plataforma envia alertas em tempo real à população. O
            sistema possui um mapa interativo que exibe os níveis de risco das
            cidades, além de dados meteorológicos atualizados, e um feed
            colaborativo para que os moradores relatem incidentes.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link href="/cadastro-cidadao">
              <button className="bg-[#0d43af] hover:bg-[#0c2b6b] text-white font-bold text-base px-9 py-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md">
                Iniciar sessão
                <ArrowRight size={18} />
              </button>
            </Link>
            <button
              className="border border-[#0d43af] bg-white hover:bg-slate-100 text-slate-900 font-bold text-base px-9 py-4 rounded-lg transition-colors cursor-pointer shadow-sm"
              onClick={() => scrollTo("emergencia")}
            >
              Contatos de Emergência
            </button>
          </div>
        </section>

        <div className="border-t border-slate-300" />

        {/* ── CHAMADOS ────────────────────────────────────────────────────────── */}
        <section id="painel" className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div>
              <span className="text-md font-bold text-[#2C4A6F] uppercase tracking-widest">
                Dados unificados
              </span>
              <h2 className="text-5xl font-extrabold text-slate-950 mt-4 leading-snug">
                Análise e Despacho Integrado
              </h2>
              <p className="text-base text-slate-800 font-medium mt-5">
                O Pluvite centraliza chamados, monitora cidades criticamente
                afetadas e oferece suporte visual imediato para equipes de
                resposta.
              </p>
            </div>

            <div className="lg:col-span-2 border border-[#ccddff] bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-8">
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={18} className="text-[#2C4A6F]" />
                  <span className="text-base font-bold text-slate-900">
                    Visão Geral do Painel
                  </span>
                </div>
                <span className="text-xs font-bold text-black border border-[#ccddff] bg-[#eff5ff] px-3 py-1.5 rounded-md">
                  Atualizado agora
                </span>
              </div>

              {/* LABELS DA VISÃO GERAL */}
              <div className="grid grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Chamados", value: "6", color: "text-[#e8000e]" },
                  { label: "Críticos", value: "3", color: "text-[#1e0972]" },
                  { label: "Andamento", value: "2", color: "text-[#cd7206]" },
                  { label: "Concluídos", value: "0", color: "text-[#006b26]" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="border border-slate-200 bg-slate-50 rounded-xl p-4 text-center"
                  >
                    <p className={`text-3xl font-extrabold ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-600 font-bold mt-2">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* GRÁFICO DE OCORRÊNCIAS POR MUNICÍPIO */}
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Ocorrências por Município
                </span>
                <div className="h-28 flex items-end gap-3 pt-5 border-b border-slate-300 px-1 mt-4">
                  {[
                    { h: "70%" },
                    { h: "95%" },
                    { h: "45%" },
                    { h: "20%" },
                    { h: "60%" },
                  ].map((bar, i) => (
                    <div
                      key={i}
                      className="bg-[#1351cb] w-full rounded-t-sm"
                      style={{ height: bar.h }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-700 font-bold px-1 mt-3">
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

        <div className="border-t border-slate-300" />

        {/* ── RECURSOS ──────────────────────────────────────────────────────── */}
        <section id="recursos" className="max-w-6xl mx-auto px-6 py-24">
          <span className="text-sm font-bold text-[#2C4A6F] uppercase tracking-widest">
            Recursos
          </span>
          <h2 className="text-5xl font-extrabold mt-4 mb-12 text-slate-950">
            Ecossistema do Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Map,
                title: "Mapa Interativo",
                desc: "Exibe os polígonos de risco e a situação de alerta de cada município em tempo real.",
                bgColor: "#f7f7f7",
                hoverBorder: "hover:border-[#006b26]",
                iconColor: "text-[#006b26]",
              },
              {
                icon: Rss,
                title: "Feed Colaborativo",
                desc: "Permite publicar ocorrências locais com fotos e texto, alimentando o mapa em tempo real.",
                bgColor: "#f7f7f7",
                hoverBorder: "hover:border-[#e8000e]",
                iconColor: "text-[#e8000e]",
              },
              {
                icon: CloudSun,
                title: "Dados Climáticos",
                desc: "Acompanhamento de índices pluviométricos e alertas meteorológicos integrados.",
                bgColor: "#f7f7f7",
                hoverBorder: "hover:border-[#e47c00]",
                iconColor: "text-[#e47c00]",
              },
              {
                icon: Compass,
                title: "Rotas Inteligentes",
                desc: "Rotas alternativas calculadas automaticamente para evitar locais bloqueados ou inundados.",
                bgColor: "#f7f7f7",
                hoverBorder: "hover:border-[#00b277]",
                iconColor: "text-[#00b277]",
              },
            ].map(
              ({
                icon: Icon,
                title,
                desc,
                bgColor,
                hoverBorder,
                iconColor,
              }) => (
                <div
                  key={title}
                  style={{ backgroundColor: bgColor }}
                  className={`border border-slate-200 p-7 rounded-2xl ${hoverBorder} transition-colors duration-200 cursor-pointer shadow-sm`}
                >
                  <Icon size={22} className={`${iconColor} mb-5`} />
                  <h3 className="font-bold text-slate-900 text-base mb-2.5">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <div className="border-t border-slate-300" />

        {/* ── COMUNICAÇÃO ───────────────────────────────────────────────────── */}
        <section
          id="comunicacao"
          className="max-w-6xl mx-auto px-6 pt-10 pb-24"
        >
          <span className="text-sm font-bold text-[#2C4A6F] uppercase tracking-widest">
            Comunicação
          </span>
          <h2 className="text-5xl font-extrabold text-slate-950 mt-4 mb-3">
            Comunicação Direta com as Prefeituras
          </h2>
          <p className="text-base text-slate-800 font-medium max-w-2xl mb-12">
            O projeto aprimora a comunicação entre cidadãos e prefeituras,
            reforçando a segurança e minimizando os efeitos de desastres
            naturais.
          </p>

          {/* 3 PILARES DA COMUNICAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {[
              {
                icon: ShieldCheck,
                title: "Prevenção Direta",
                desc: "Evita acidentes estruturais e logísticos graves.",
                borderColor: "border-[#006b26]",
                iconColor: "text-[#006b26]",
              },
              {
                icon: BellRing,
                title: "Alertas em Tempo Real",
                desc: "Notificações críticas para a população.",
                borderColor: "border-[#e8000e]",
                iconColor: "text-[#e8000e]",
              },
              {
                icon: Building2,
                title: "Integração Municipal",
                desc: "Respostas rápidas das defesas civis.",
                borderColor: "border-[#e47c00]",
                iconColor: "text-[#e47c00]",
              },
            ].map(({ icon: Icon, title, desc, borderColor, iconColor }) => (
              <div
                key={title}
                className={`border-2 ${borderColor} bg-white rounded-2xl p-6 flex gap-5 shadow-sm`}
              >
                <Icon
                  size={22}
                  className={`${iconColor} flex-shrink-0 mt-0.5`}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {title}
                  </h4>
                  <p className="text-sm text-slate-700 font-medium mt-1.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FLUXO DE COMUNICAÇÃO */}
          <div className="border border-slate-200 bg-white rounded-2xl p-8 mb-10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-8">
              Fluxo de Comunicação
            </h3>
            <div className="grid grid-cols-5 gap-3 items-start">
              {[
                {
                  icon: Users,
                  titulo: "Cidadão reporta",
                  desc: "Relato via app com foto e localização",
                  color: "text-[#e47c00]",
                  bgColor: "bg-[#ffd29d]/30",
                },
                {
                  icon: Database,
                  titulo: "Sistema processa",
                  desc: "IA classifica risco e urgência",
                  color: "text-[#2C4A6F]",
                  bgColor: "bg-slate-100",
                },
                {
                  icon: Siren,
                  titulo: "Alerta gerado",
                  desc: "Notificação enviada à região",
                  color: "text-[#e8000e]",
                  bgColor: "bg-[#ffb7bb]/30",
                },
                {
                  icon: Building2,
                  titulo: "Prefeitura recebe",
                  desc: "Painel atualizado com o chamado",
                  color: "text-[#006b26]",
                  bgColor: "bg-[#c0ffd6]/30",
                },
                {
                  icon: Navigation,
                  titulo: "Equipe despachada",
                  desc: "Resposta no local em minutos",
                  color: "text-[#00b277]",
                  bgColor: "bg-[#d7fff2]/30",
                },
              ].map(({ icon: Icon, titulo, desc, color, bgColor }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-3 relative"
                >
                  <div
                    className={`w-11 h-11 border border-slate-300 ${bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <Icon size={18} className={color} />
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {titulo}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed hidden sm:block">
                    {desc}
                  </p>
                  {i < 4 && (
                    <ArrowRight
                      size={14}
                      className="hidden sm:block absolute -right-3 top-3.5 text-slate-400"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MUNICÍPIOS */}
          <div className="border border-slate-200 bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-5">
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
                  className="flex items-center gap-2 text-sm text-slate-800 py-1.5 font-bold animate-fade-in"
                >
                  <MapPin size={11} className="text-[#00b277] flex-shrink-0" />
                  {cidade}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#2C4A6F] font-extrabold mt-5">
              + 23 municípios adicionais na região
            </p>
          </div>
        </section>

        <div className="border-t border-slate-300" />

        {/* ── CATEGORIZAÇÃO ─────────────────────────────────────────────────── */}
        <section id="riscos" className="max-w-6xl mx-auto px-6 pt-10 pb-24">
          <span className="text-sm font-bold text-[#2C4A6F] uppercase tracking-widest">
            Categorização
          </span>
          <h2 className="text-5xl font-extrabold text-slate-950 mt-4 mb-3">
            Categorização de Riscos
          </h2>
          <p className="text-base text-slate-800 font-medium max-w-xl mb-12">
            O sistema analisa dados pluviométricos e relatos em tempo real para
            classificar cada região em quatro categorias.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              {
                dot: "bg-[#7c3aed]", // Roxo bem vivo
                border: "border-[#7c3aed]",
                title: "Alerta Máximo",
                desc: "Inundações iminentes ou deslizamentos detectados.",
                color: "text-[#7c3aed]",
              },
              {
                dot: "bg-[#e8000e]", // Vermelho bem vivo
                border: "border-[#e8000e]",
                title: "Estado de Alerta",
                desc: "Índice de chuva crítico acumulado.",
                color: "text-[#e8000e]",
              },
              {
                dot: "bg-[#e47c00]", // Laranja bem vivo
                border: "border-[#e47c00]",
                title: "Atenção Crítica",
                desc: "Previsão de tempestades severas na região.",
                color: "text-[#e47c00]",
              },
              {
                dot: "bg-[#00b277]", // Verde bem vivo
                border: "border-[#00b277]",
                title: "Zona Segura",
                desc: "Condições estáveis e normais.",
                color: "text-[#00b277]",
              },
            ].map(({ dot, border, title, desc, color }) => (
              <div
                key={title}
                className={`border-2 ${border} bg-white p-6 rounded-2xl shadow-sm`}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                  <h3 className={`font-extrabold text-base ${color}`}>
                    {title}
                  </h3>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-bold">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* TIPOS DE OCORRÊNCIA MONITORADOS */}
          <div className="border border-slate-200 bg-white rounded-2xl p-8 mb-14 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-8">
              Tipos de Ocorrência Monitorados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: CloudRain,
                  titulo: "Enchentes e Inundações",
                  desc: "Monitoramento do nível de rios, córregos e áreas historicamente alagáveis com alertas preditivos.",
                  iconColor: "text-[#2563eb]", // Azul
                  borderColor: "hover:border-[#2563eb]",
                },
                {
                  icon: AlertTriangle,
                  titulo: "Deslizamentos",
                  desc: "Análise de encostas instáveis, saturação do solo e histórico de movimentações de terra na região.",
                  iconColor: "text-[#e8000e]", // Vermelho
                  borderColor: "hover:border-[#e8000e]",
                },
                {
                  icon: Wind,
                  titulo: "Ventos Fortes e Tempestades",
                  desc: "Rastreamento de frentes frias, rajadas de vento e eventos de granizo que afetam a infraestrutura.",
                  iconColor: "text-[#e47c00]", // Laranja
                  borderColor: "hover:border-[#e47c00]",
                },
                {
                  icon: TrendingUp,
                  titulo: "Elevação do Nível do Mar",
                  desc: "Alerta para ressacas, maré alta e avanço do mar em municípios do Litoral Norte paulista.",
                  iconColor: "text-[#06b6d4]", // Ciano
                  borderColor: "hover:border-[#06b6d4]",
                },
                {
                  icon: AlertTriangle,
                  titulo: "Infraestrutura Danificada",
                  desc: "Registro de pontes interditadas, rodovias bloqueadas, quedas de energia e danos estruturais.",
                  iconColor: "text-[#7c3aed]", // Roxo
                  borderColor: "hover:border-[#7c3aed]",
                },
                {
                  icon: Eye,
                  titulo: "Visibilidade Crítica",
                  desc: "Monitoramento de neblina densa e baixa visibilidade em rodovias de serra e vias críticas.",
                  iconColor: "text-[#64748b]", // Slate/Cinza
                  borderColor: "hover:border-[#64748b]",
                },
              ].map(({ icon: Icon, titulo, desc, iconColor, borderColor }) => (
                <div
                  key={titulo}
                  className={`flex gap-4 p-5 border border-slate-200 bg-slate-50 rounded-xl ${borderColor} transition-colors duration-200 shadow-sm`}
                >
                  <Icon
                    size={18}
                    className={`${iconColor} flex-shrink-0 mt-0.5`}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{titulo}</p>
                    <p className="text-xs text-slate-700 font-medium mt-1.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ESTATÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-slate-300 text-center">
            {[
              { value: "39", label: "Municípios Monitorados" },
              { value: "100%", label: "Colaborativo" },
              { value: "Tempo real", label: "Atualização contínua" },
              { value: "+3M", label: "Cidadãos protegidos" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-slate-950">
                  {value}
                </p>
                <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mt-2">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EMERGÊNCIA ────────────────────────────────────────────────────── */}
        <div id="emergencia" className="border-t border-slate-300" />
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-24">
          <div className="flex items-start gap-5 mb-10">
            <div className="w-12 h-12 border border-slate-300 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Phone size={20} className="text-[#e8000e]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#e8000e] uppercase tracking-widest">
                Emergência
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-2">
                Números de Emergência
              </h2>
              <p className="text-base text-slate-800 font-medium mt-2 max-w-xl">
                Em caso de riscos iminentes, acione o socorro imediatamente. A
                rapidez no acionamento pode salvar vidas. Mantenha esses números
                salvos.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              {
                label: "Defesa Civil",
                numero: "199",
                color: "text-[#00b277]",
                border: "border-[#00b277]",
              }, // Verde vivo
              {
                label: "Bombeiros",
                numero: "193",
                color: "text-[#e8000e]",
                border: "border-[#e8000e]",
              }, // Vermelho vivo
              {
                label: "SAMU",
                numero: "192",
                color: "text-[#2563eb]",
                border: "border-[#2563eb]",
              }, // Azul vivo
            ].map(({ label, numero, color, border }) => (
              <div
                key={label}
                className={`border-2 ${border} bg-white rounded-2xl p-7 text-center shadow-md`}
              >
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {label}
                </p>
                <p className={`text-5xl font-black ${color}`}>{numero}</p>
              </div>
            ))}
          </div>

          {/* INSTRUÇÕES DE EMERGÊNCIA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                title: "Em caso de enchente",
                bulletColor: "text-[#2563eb]",
                items: [
                  "Desligue a energia elétrica",
                  "Suba para locais altos imediatamente",
                  "Não atravesse áreas alagadas",
                  "Ligue 199 para a Defesa Civil",
                ],
              },
              {
                title: "Em caso de deslizamento",
                bulletColor: "text-[#e8000e]",
                items: [
                  "Afaste-se da encosta imediatamente",
                  "Não retorne ao imóvel",
                  "Procure abrigo seguro",
                  "Avise vizinhos em risco",
                ],
              },
              {
                title: "Kit de emergência",
                bulletColor: "text-[#00b277]",
                items: [
                  "Documentos em saco plástico",
                  "Água e alimentos não perecíveis",
                  "Lanternas e pilhas extras",
                  "Medicamentos essenciais",
                ],
              },
            ].map(({ title, items, bulletColor }) => (
              <div
                key={title}
                className="border border-slate-300 bg-white rounded-2xl p-7 shadow-sm"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <AlertTriangle size={15} className="text-[#e8000e]" />
                  <h5 className="text-base font-bold text-slate-900">
                    {title}
                  </h5>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-slate-800 flex gap-2.5 font-bold"
                    >
                      <span className={`${bulletColor} mt-0.5`}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-slate-300" />

        {/* ── APP ────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pt-10 pb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-bold text-[#0d43af] uppercase tracking-widest">
              Interface Mobile
            </span>
            <h2 className="text-4xl font-extrabold text-slate-950 mt-2">
              Conheça o Nosso Aplicativo
            </h2>
            <p className="text-base text-slate-700 font-medium mt-3">
              Uma experiência rápida e intuitiva feita para manter você
              informado e seguro a qualquer momento do dia.
            </p>
          </div>

          {/*CARDS DAS TELAS DO APP*/}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center items-start pt-4">
            {[
              {
                src: "/app-login.png",
                title: "Acesso Rápido",
                desc: "Login simples e integração social",
              },
              {
                src: "/app-cadastro.png",
                title: "Cadastro Seguro",
                desc: "Conta pessoal ou institucional",
              },
              {
                src: "/app-clima.jpg",
                title: "Painel de Clima",
                desc: "Condições e alertas em tempo real",
              },
              {
                src: "/app-contatos.jpg",
                title: "Canais de Ajuda",
                desc: "Disque emergência em um clique",
              },
            ].map((mockup, index) => (
              <div
                key={index}
                className="flex flex-col items-center group max-w-[165px] transition-transform duration-300 md:odd:-translate-y-4"
              >
                <div className="relative rounded-xl p-1.5 bg-slate-900/5 ring-1 ring-slate-900/10 shadow-md w-full transition-transform duration-300 group-hover:scale-105">
                  <div className="overflow-hidden rounded-lg bg-white aspect-[9/19]">
                    <img
                      src={mockup.src}
                      alt={mockup.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-950 mt-4 text-center leading-tight">
                  {mockup.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium text-center mt-1 px-1 leading-normal">
                  {mockup.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer className="border-t border-slate-700 bg-[#091c4b] px-6 py-12 text-white shadow-inner">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4 text-left">
                <img
                  src="/PluviteIcon.jpg"
                  alt="Logo Pluvite"
                  className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-black tracking-tight">
                    Baixe o App Pluvite
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Alertas de risco em tempo real no seu bolso.
                  </p>
                </div>
              </div>

              {/* LADO DIREITO FOOTER*/}
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-3 bg-white text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-md">
                  <span className="opacity-80">Disponível no</span>
                  <span className="font-black text-sm border-l border-slate-300 pl-3">
                    Google Play
                  </span>
                </button>
                <button className="flex items-center gap-3 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-white/20 transition-colors cursor-pointer shadow-md backdrop-blur-sm">
                  <span className="opacity-80">Baixar para</span>
                  <span className="font-black text-sm border-l border-white/20 pl-3">
                    iOS App Store
                  </span>
                </button>
              </div>
            </div>

            {/*LINHA DIVISÓRIA*/}
            <div className="border-t border-white/10 my-6" />

            {/* CRÉDITOS INSTITUCIONAIS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
              <p>
                © 2026 Pluvite · Centro Paula Souza (FATEC) · Fins acadêmicos
              </p>

              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <MapPin size={12} className="text-[#e8000e]" />
                <span>Vale do Paraíba e Litoral Norte, SP</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/*SCROLL PARA O TOPO*/}
      <button
        onClick={() => {
          document
            .querySelector(".overflow-y-auto")
            ?.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#0d43af] hover:bg-[#0c2b6b] text-white rounded-xl flex items-center justify-center transition-colors shadow-md"
      >
        <ArrowUp size={17} />
      </button>
    </div>
  );
}
