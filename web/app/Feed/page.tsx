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
        <div className="h-screen w-full bg-slate-50 p-4 sm:p-6 lg:p-8 relative flex flex-col">
            {/* ELEMENTOS VISUAIS DE FUNDO */}
            <div className="absolute -top-[50px] -left-15 w-72 h-72 bg-[#1447f2]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#1447c4]/8 rounded-full pointer-events-none" />
            <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-[#1447c4]/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1447c4]/5 rounded-full blur-2xl pointer-events-none" />

            <main className="max-w-6xl w-full mx-auto relative z-10 flex flex-col h-full">

                {/* CABEÇALHO */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0 mt-2">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Feed de Ocorrências
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 mb-5">
                            Acompanhe, filtre e reporte problemas urbanos em tempo real na sua região.
                        </p>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-[#091f75] hover:bg-[#0f35a0] text-white text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer shadow-md shadow-blue-900/10 shrink-0">
                        <Plus size={18} />
                        <span>Publicar Ocorrência</span>
                    </button>
                </div>

                {/* FILTROS DE PESQUISA */}
                <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 mb-6 shrink-0">
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

                    {/* CATEGORIAS */}
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


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 min-h-0">
                    {/* FEED */}
                    <div className="lg:col-span-8 h-full pr-2 space-y-6 ">

                        {/* LISTA DE CARDS DE OCORRÊNCIA */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition">
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

                    {/* COLUNA DIREITA */}
                    <div className="lg:col-span-4 h-full overflow-hidden space-y-6">

                        {/* STATUS */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                                    <AlertTriangle size={16} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">0</span>
                                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider text-center">Aguardando</span>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                                    <Wrench size={16} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">1</span>
                                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider text-center">Em Andamento</span>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                                    <Eye size={16} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">1</span>
                                <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider text-center">Visualizados</span>
                            </div>
                        </div>

                        {/* CARD SITUAÇÃO */}
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
                                    <span className="font-bold text-amber-600">Baixo</span>
                                </div>
                            </div>
                        </div>

                        {/* CARD BAIRROS */}
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