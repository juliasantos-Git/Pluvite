"use client";

import { useState, useRef } from "react";
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
    ImagePlus,
    X,
    Send,
    CheckCircle,
} from "lucide-react";

interface Comentario {
    id: string;
    autor: string;
    texto: string;
}

type StatusOcorrencia = "Aguardando" | "Em Andamento" | "Visualizado" | "Concluído";

interface Ocorrencia {
    id: string;
    autor: string;
    iniciais: string;
    endereco: string;
    bairro: string;
    tempo: string;
    status: StatusOcorrencia;
    descricao: string;
    imagemUrl: string | null;
    curtido: boolean;
    curtidas: number;
    comentarios: Comentario[];
}

const STATUS_ESTILO: Record<StatusOcorrencia, { badge: string; icon: any; texto: string }> = {
    Aguardando: { badge: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle, texto: "Aguardando" },
    "Em Andamento": { badge: "bg-amber-50 text-amber-800 border-amber-200", icon: Wrench, texto: "Em Andamento" },
    Visualizado: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Eye, texto: "Visualizado" },
    Concluído: { badge: "bg-slate-100 text-slate-600 border-slate-200", icon: CheckCircle, texto: "Concluído" },
};

// Posts de exemplo pra o feed já nascer com conteúdo variado.
// Troque as imagens (imagemUrl) pelos arquivos reais quando tiver.
const OCORRENCIAS_INICIAIS: Ocorrencia[] = [
    {
        id: "post-1",
        autor: "Maria Silva",
        iniciais: "MS",
        endereco: "Avenida Armando de Moura, 256",
        bairro: "Três Marias",
        tempo: "há 15 minutos",
        status: "Em Andamento",
        descricao:
            "Ponto de alagamento acentuado próximo ao cruzamento principal. A água cobriu a calçada impossibilitando a travessia de pedestres. Trânsito lento no local.",
        imagemUrl: "/TresMarias.jpg",
        curtido: false,
        curtidas: 12,
        comentarios: [
            { id: "c1", autor: "João Pedro", texto: "Mesma coisa aqui na rua de baixo, cuidado!" },
            { id: "c2", autor: "Ana Costa", texto: "Prefeitura já foi avisada?" },
        ],
    },
    {
        id: "post-2",
        autor: "Carlos Eduardo",
        iniciais: "CE",
        endereco: "Rua das Palmeiras, 89",
        bairro: "Cecap",
        tempo: "há 42 minutos",
        status: "Aguardando",
        descricao:
            "Árvore de grande porte caiu sobre a via após a chuva forte de hoje de manhã. Bloqueando totalmente a passagem de carros nos dois sentidos.",
        imagemUrl: "https://picsum.photos/seed/arvore-cecap/900/700",
        curtido: false,
        curtidas: 5,
        comentarios: [
            { id: "c3", autor: "Fernanda Lima", texto: "Já faz mais de uma hora, ninguém veio ainda." },
        ],
    },
    {
        id: "post-3",
        autor: "Beatriz Rocha",
        iniciais: "BR",
        endereco: "Estrada do Barreiro, km 3",
        bairro: "Jardim Jaraguá",
        tempo: "há 1 hora",
        status: "Visualizado",
        descricao:
            "Pequeno deslizamento de terra na encosta ao lado da estrada. Ainda não atingiu a pista, mas o barranco está bem instável.",
        imagemUrl: "https://picsum.photos/seed/deslizamento-jaragua/900/700",
        curtido: true,
        curtidas: 8,
        comentarios: [],
    },
    {
        id: "post-4",
        autor: "Rafael Nogueira",
        iniciais: "RN",
        endereco: "Avenida Independência, 1450",
        bairro: "Independência",
        tempo: "há 3 horas",
        status: "Concluído",
        descricao:
            "Alagamento na esquina foi resolvido depois da equipe desobstruir o bueiro. Rua já está passável normalmente.",
        imagemUrl: "https://picsum.photos/seed/rua-independencia/900/700",
        curtido: false,
        curtidas: 3,
        comentarios: [
            { id: "c4", autor: "Marcos Vinícius", texto: "Boa, obrigado por avisar!" },
        ],
    },
];

export default function FeedPage() {
    const [busca, setBusca] = useState("");
    const [cidade, setCidade] = useState("");
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(OCORRENCIAS_INICIAIS);

    // Modal de nova publicação
    const [modalAberto, setModalAberto] = useState(false);
    const [novaLegenda, setNovaLegenda] = useState("");
    const [novaImagem, setNovaImagem] = useState<string | null>(null);
    const inputImagemRef = useRef<HTMLInputElement>(null);

    // Texto do comentário sendo digitado, por ocorrência (id -> texto)
    const [comentarioAtual, setComentarioAtual] = useState<Record<string, string>>({});
    // Controla quais cards estão com a caixa de comentários aberta
    const [comentariosAbertos, setComentariosAbertos] = useState<Record<string, boolean>>({});

    const cidades = ["Taubaté", "São José dos Campos", "Ubatuba", "Caraguatatuba", "São Sebastião"];
    const categorias = ["Todas", "Alagamento", "Deslizamento", "Árvore Caída", "Via Interditada"];

    const gerarIniciais = (nome: string) =>
        nome
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("");

    const handleSelecionarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        const url = URL.createObjectURL(arquivo);
        setNovaImagem(url);
    };

    const handleFecharModal = () => {
        setNovaLegenda("");
        setNovaImagem(null);
        setModalAberto(false);
    };

    const handlePublicar = () => {
        if (!novaLegenda.trim() && !novaImagem) return;

        const novaOcorrencia: Ocorrencia = {
            id: `post-${Date.now()}`,
            autor: "Você",
            iniciais: "EU",
            endereco: "Localização atual",
            bairro: cidade || "Minha região",
            tempo: "Agora mesmo",
            status: "Aguardando",
            descricao: novaLegenda.trim(),
            imagemUrl: novaImagem,
            curtido: false,
            curtidas: 0,
            comentarios: [],
        };

        setOcorrencias((prev) => [novaOcorrencia, ...prev]);
        handleFecharModal();
    };

    const handleCurtir = (id: string) => {
        setOcorrencias((prev) =>
            prev.map((oc) =>
                oc.id === id
                    ? { ...oc, curtido: !oc.curtido, curtidas: oc.curtido ? oc.curtidas - 1 : oc.curtidas + 1 }
                    : oc,
            ),
        );
    };

    const alternarComentarios = (id: string) => {
        setComentariosAbertos((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleEnviarComentario = (id: string) => {
        const texto = (comentarioAtual[id] || "").trim();
        if (!texto) return;

        setOcorrencias((prev) =>
            prev.map((oc) =>
                oc.id === id
                    ? { ...oc, comentarios: [...oc.comentarios, { id: `c-${Date.now()}`, autor: "Você", texto }] }
                    : oc,
            ),
        );
        setComentarioAtual((prev) => ({ ...prev, [id]: "" }));
    };

    const contagem = {
        aguardando: ocorrencias.filter((o) => o.status === "Aguardando").length,
        andamento: ocorrencias.filter((o) => o.status === "Em Andamento").length,
        visualizado: ocorrencias.filter((o) => o.status === "Visualizado").length,
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6 lg:p-8 relative flex flex-col">
            {/* ELEMENTOS VISUAIS DE FUNDO */}
            <div className="absolute -top-[50px] -left-15 w-72 h-72 bg-[#1447f2]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-[400px] -left-35 w-96 h-96 bg-[#1447c4]/8 rounded-full pointer-events-none" />
            <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-[#1447c4]/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#1447c4]/5 rounded-full blur-2xl pointer-events-none" />

            <main className="max-w-6xl w-full mx-auto relative z-10 flex flex-col">

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

                    <button
                        onClick={() => setModalAberto(true)}
                        className="flex items-center justify-center gap-2 bg-[#091f75] hover:bg-[#0f35a0] text-white text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer shadow-md shadow-blue-900/10 shrink-0"
                    >
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


                <div className="flex flex-col lg:flex-row gap-8">
                    {/* FEED */}
                    <div className="w-full lg:w-2/3 space-y-6">

                        {ocorrencias.map((oc) => {
                            const estilo = STATUS_ESTILO[oc.status];
                            const StatusIcon = estilo.icon;
                            const comentariosVisiveis = comentariosAbertos[oc.id];

                            return (
                                <div
                                    key={oc.id}
                                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition"
                                >
                                    <div className="p-5 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full bg-[#091f75] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                                                {oc.iniciais}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm leading-snug">{oc.autor}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                    <MapPin size={13} className="text-slate-400 shrink-0" />
                                                    <span>{oc.endereco}</span>
                                                    <span>•</span>
                                                    <span className="font-semibold text-slate-700">{oc.bairro}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            <span className="text-[11px] text-slate-400 font-medium">{oc.tempo}</span>
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${estilo.badge}`}>
                                                <StatusIcon size={12} />
                                                {estilo.texto}
                                            </span>
                                        </div>
                                    </div>

                                    {oc.descricao && (
                                        <div className="px-5 pb-4 text-xs text-slate-700 font-medium leading-relaxed">
                                            {oc.descricao}
                                        </div>
                                    )}

                                    {/* FOTO DA OCORRÊNCIA */}
                                    {oc.imagemUrl && (
                                        <div className="w-full h-80 bg-slate-100 overflow-hidden relative">
                                            <img
                                                src={oc.imagemUrl}
                                                alt="Foto da ocorrência"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* BARRA DE INTERAÇÕES E AÇÕES */}
                                    <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold px-5">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleCurtir(oc.id)}
                                                className={`flex items-center gap-1.5 transition cursor-pointer ${oc.curtido ? "text-[#091f75]" : "hover:text-[#091f75]"}`}
                                            >
                                                <ThumbsUp size={16} fill={oc.curtido ? "currentColor" : "none"} />
                                                <span>Curtidas ({oc.curtidas})</span>
                                            </button>
                                            <button
                                                onClick={() => alternarComentarios(oc.id)}
                                                className={`flex items-center gap-1.5 transition cursor-pointer ${comentariosVisiveis ? "text-[#091f75]" : "hover:text-[#091f75]"}`}
                                            >
                                                <MessageSquare size={16} />
                                                <span>Comentários ({oc.comentarios.length})</span>
                                            </button>
                                        </div>

                                        <button className="flex items-center gap-1.5 hover:text-[#091f75] transition cursor-pointer">
                                            <Share2 size={16} />
                                            <span>Compartilhar</span>
                                        </button>
                                    </div>

                                    {/* SEÇÃO DE COMENTÁRIOS */}
                                    {comentariosVisiveis && (
                                        <div className="border-t border-slate-100 bg-white px-5 py-4 space-y-3">
                                            {oc.comentarios.length === 0 ? (
                                                <p className="text-xs text-slate-400 font-medium">
                                                    Nenhum comentário ainda. Seja o primeiro a comentar.
                                                </p>
                                            ) : (
                                                oc.comentarios.map((com) => (
                                                    <div key={com.id} className="flex items-start gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                                                            {gerarIniciais(com.autor)}
                                                        </div>
                                                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex-1">
                                                            <span className="text-xs font-bold text-slate-800">{com.autor}</span>
                                                            <p className="text-xs text-slate-600 mt-0.5">{com.texto}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}

                                            <div className="flex items-center gap-2 pt-1">
                                                <input
                                                    type="text"
                                                    value={comentarioAtual[oc.id] || ""}
                                                    onChange={(e) =>
                                                        setComentarioAtual((prev) => ({ ...prev, [oc.id]: e.target.value }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleEnviarComentario(oc.id);
                                                    }}
                                                    placeholder="Escreva um comentário..."
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#091f75]"
                                                />
                                                <button
                                                    onClick={() => handleEnviarComentario(oc.id)}
                                                    className="p-2.5 rounded-xl bg-[#091f75] hover:bg-[#0f35a0] text-white transition cursor-pointer shrink-0"
                                                    title="Enviar comentário"
                                                >
                                                    <Send size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* COLUNA DIREITA */}
                    <div className="w-full lg:w-1/3 h-full overflow-y-auto space-y-6 pb-4">

                        {/* STATUS */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                                    <AlertTriangle size={16} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">{contagem.aguardando}</span>
                                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider text-center">Aguardando</span>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                                    <Wrench size={16} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">{contagem.andamento}</span>
                                <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider text-center">Em Andamento</span>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                                    <Eye size={16} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">{contagem.visualizado}</span>
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

            {/* MODAL DE NOVA PUBLICAÇÃO */}
            {modalAberto && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
                    onClick={handleFecharModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-900 text-sm">Publicar Ocorrência</h2>
                            <button onClick={handleFecharModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <textarea
                                value={novaLegenda}
                                onChange={(e) => setNovaLegenda(e.target.value)}
                                placeholder="Descreva o que está acontecendo..."
                                rows={4}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#091f75] resize-none"
                            />

                            <input
                                ref={inputImagemRef}
                                type="file"
                                accept="image/*"
                                onChange={handleSelecionarImagem}
                                className="hidden"
                            />

                            {novaImagem ? (
                                <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={novaImagem} alt="Prévia" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setNovaImagem(null)}
                                        className="absolute top-2 right-2 bg-slate-900/60 hover:bg-slate-900/80 text-white p-1.5 rounded-full cursor-pointer"
                                        title="Remover foto"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => inputImagemRef.current?.click()}
                                    className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 text-slate-400 hover:border-[#091f75] hover:text-[#091f75] transition cursor-pointer"
                                >
                                    <ImagePlus size={24} />
                                    <span className="text-xs font-semibold">Adicionar foto</span>
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50/60">
                            <button
                                onClick={handleFecharModal}
                                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePublicar}
                                disabled={!novaLegenda.trim() && !novaImagem}
                                className="flex items-center gap-2 bg-[#091f75] hover:bg-[#0f35a0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
                            >
                                <Plus size={14} />
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}