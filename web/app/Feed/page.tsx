"use client";

import { useState } from "react";
import { AlertTriangle, Wrench, Eye, Plus, Search, MapPin } from "lucide-react";

export default function FeedPage() {
    const [busca, setBusca] = useState("");
    const [cidade, setCidade] = useState("");

    const cidades = ["Taubaté", "São José dos Campos", "Ubatuba", "Caraguatatuba", "São Sebastião"];

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            {/* ELEMENTOS DECORATIVOS DE FUNDO */}
            <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#0f35a0]/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0f35a0]/4 rounded-full blur-2xl pointer-events-none" />
            <main className="max-w-3xl mx-auto">
                {/*CARD DE CABEÇALHO */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Feed de Ocorrências</h1>
                        <p className="text-sm text-slate-500 mt-1">Acompanhe e reporte problemas em tempo real</p>
                    </div>

                    <button className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm">
                        <Plus size={18} />
                        <span>Nova Ocorrência</span>
                    </button>
                </div>

                {/* CARDS DE ANDAMENTO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                        <AlertTriangle className="text-red-600" size={24} />
                        <div>
                            <span className="text-2xl font-bold text-red-600 block">2</span>
                            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Aguardando</span>
                        </div>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                        <Wrench className="text-amber-600" size={24} />
                        <div>
                            <span className="text-2xl font-bold text-amber-600 block">2</span>
                            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Em Andamento</span>
                        </div>
                    </div>

                    <div className="bg-green-50/50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                        <Eye className="text-green-600" size={24} />
                        <div>
                            <span className="text-2xl font-bold text-green-600 block">2</span>
                            <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Visualizados</span>
                        </div>
                    </div>
                </div>

                {/* FILTROS E PESQUISA */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative md:w-56">
                        <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
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
                            placeholder="Buscar por bairro (ex: Cecap)..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* CARD DE OCORRÊNCIA POSTADA */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">

                    {/* CARD AUTOR, ENDEREÇO E STATUS */}
                    <div className="p-5 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {/* AVATAR DO USUÁRIO */}
                            <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                MS
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 text-base leading-snug">Maria Silva</h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>Av. Charles Schneider, 1500</span>
                                </div>

                                {/* BAIRRO */}
                                <span className="inline-block mt-2 bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-md border border-slate-200">
                                    Cecap
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-slate-400">há 15 minutos</span>
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                                <Wrench size={12} />
                                Em Andamento
                            </span>
                        </div>
                    </div>

                    {/* FOTO DO DESASTRE */}
                    <div className="w-full h-80 bg-slate-200 overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1000&auto=format&fit=crop"
                            alt="Foto do alagamento"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>

            </main>
        </div>
    );
}