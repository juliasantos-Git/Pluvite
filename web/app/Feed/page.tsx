"use client";

import { useState } from "react";
import {
    AlertTriangle,
    Wrench,
    Eye,
    Plus,
    Search,
    MapPin,
    Filter,
    MessageSquare,
    ThumbsUp,
    Share2,
    TrendingUp,
    CloudRain,
} from "lucide-react";

export default function FeedPage() {
    const [busca, setBusca] = useState("");
    const [cidade, setCidade] = useState("");
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    const cidades = ["Taubaté", "São José dos Campos", "Ubatuba", "Caraguatatuba", "São Sebastião"];
    const categorias = ["Todas", "Alagamento", "Deslizamento", "Árvore Caída", "Via Interditada"];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* ELEMENTOS VISUAIS DE FUNDO (BOLAS DECORATIVAS) */}
            <div className="absolute -top-[50px] -left-15 w-72 h-72 bg-[#1447f2]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#1447c4]/8 rounded-full pointer-events-none" />
            <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-[#1447c4]/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1447c4]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-10 right-[560px] w-32 h-32 bg-[#1447c4]/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#1447c4]/8 rounded-full blur-sm pointer-events-none" />
            <div className="absolute top-8 right-5 w-16 h-16 bg-[#1447f2]/6 rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-5 right-1/3 w-28 h-28 bg-[#1447c4]/3 rounded-full blur-md pointer-events-none" />

            {/* CONTEÚDO PRINCIPAL (Z-INDEX SUPERIOR) */}
            <main className="max-w-6xl mx-auto relative z-10">

                {/* CABEÇALHO */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Feed de Ocorrências
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Acompanhe, filtre e reporte problemas urbanos em tempo real na sua região.
                        </p>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-[#091f75] hover:bg-[#0f35a0] text-white text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer shadow-md shadow-blue-900/10 shrink-0">
                        <Plus size={18} />
                        <span>Publicar Ocorrência</span>
                    </button>
                </div>

                {/* CARDS DE RESUMO DE STATUS (TOPO) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                                <AlertTriangle size={22} />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 block leading-tight">2</span>
                                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Aguardando</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                                <Wrench size={22} />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 block leading-tight">2</span>
                                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Em Andamento</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
                                <Eye size={22} />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-slate-800 block leading-tight">2</span>
                                <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">Visualizados</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ESTRUTURA EM GRID: FEED (ESQUERDA) + SIDEBAR (DIREITA) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* COLUNA DA ESQUERDA: FEED DE OCORRÊNCIAS (8 COLUNAS) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* FILTROS E PESQUISA */}
                        <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative sm:w-52">
                                    <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={cidade}
                                        onChange={(e) => setCidade(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold outline-none focus:border-[#091f75] cursor-pointer"
                                    >
                                        <option value="">Todas as Cidades</option>
                                        {cidades.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por bairro (ex: Quiririm)..."
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#091f75]"
                                    />
                                </div>
                            </div>

                            {/* CHIPS DE CATEGORIA */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
                                <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
                                {categorias.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoriaAtiva(cat)}
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${categoriaAtiva === cat
                                            ? "bg-[#091f75] text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CARD DE OCORRÊNCIA POSTADA */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition">

                            {/* CABEÇALHO DA POSTAGEM */}
                            <div className="p-5 flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-[#091f75] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                                        MS
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm leading-snug">Maria Silva</h3>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                            <MapPin size={13} className="text-slate-400 shrink-0" />
                                            <span>Avenida Armando de Moura, 256</span>
                                            <span>•</span>
                                            <span className="font-semibold text-slate-700">Três Marias</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <span className="text-[11px] text-slate-400 font-medium">há 15 minutos</span>
                                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                        <Wrench size={12} className="text-amber-600" />
                                        Em Andamento
                                    </span>
                                </div>
                            </div>

                            {/* DESCRIÇÃO DO PROBLEMA */}
                            <div className="px-5 pb-4 text-xs text-slate-700 font-medium leading-relaxed">
                                Ponto de alagamento acentuado próximo ao cruzamento principal. A água cobriu a calçada impossibilitando a travessia de pedestres. Trânsito lento no local.
                            </div>

                            {/* FOTO DO DESASTRE */}
                            <div className="w-full h-80 bg-slate-100 overflow-hidden relative">
                                <img
                                    src="/TresMarias.jpg"
                                    alt="Foto do alagamento"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* BARRA DE INTERAÇÕES E AÇÕES */}
                            <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold px-5">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 hover:text-[#091f75] transition cursor-pointer">
                                        <ThumbsUp size={16} />
                                        <span>Curtidas (12)</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 hover:text-[#091f75] transition cursor-pointer">
                                        <MessageSquare size={16} />
                                        <span>Comentários (4)</span>
                                    </button>
                                </div>

                                <button className="flex items-center gap-1.5 hover:text-[#091f75] transition cursor-pointer">
                                    <Share2 size={16} />
                                    <span>Compartilhar</span>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* COLUNA DA DIREITA: BARRA LATERAL INFORMATIVA (4 COLUNAS) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* CARD 1: CONDIÇÕES NA CIDADE */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                    <CloudRain size={16} className="text-[#091f75]" />
                                    Situação em Três Marias
                                </h3>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    Estável
                                </span>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                                <div className="flex justify-between text-slate-600">
                                    <span>Risco de Deslizamento:</span>
                                    <span className="font-bold text-amber-600">Baixo </span>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: BAIRROS MAIS AFETADOS */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#091f75]" />
                                Bairros com mais relatos
                            </h3>

                            <div className="space-y-2 pt-1">
                                {[
                                    { bairro: "Cecap", chamados: 8 },
                                    { bairro: "Jardim Jaraguá", chamados: 5 },
                                    { bairro: "Independência", chamados: 3 },
                                ].map((item) => (
                                    <div key={item.bairro} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <span className="font-semibold text-slate-700">{item.bairro}</span>
                                        <span className="text-[11px] font-bold text-[#091f75] bg-blue-50 px-2 py-0.5 rounded-md">
                                            {item.chamados} relatos
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}