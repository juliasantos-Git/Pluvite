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
    ChevronDown,
} from "lucide-react";

interface Comentario {
    id: string;
    autor: string;
    texto: string;
}

type StatusOcorrencia = "Aguardando" | "Em Andamento" | "Visualizado" | "Concluído";

// Tipos de ocorrência — usados no menu da publicação e nos filtros do feed
const TIPOS_OCORRENCIA = [
    "Alagamento",
    "Árvore caída",
    "Buraco na via",
    "Deslizamento de terra",
    "Via interditada",
    "Outros",
] as const;

type TipoOcorrencia = (typeof TIPOS_OCORRENCIA)[number];

interface Ocorrencia {
    id: string;
    autor: string;
    iniciais: string;
    endereco: string;
    bairro: string;
    cidade: string;
    tipo: TipoOcorrencia;
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

// Remove acentos e maiúsculas pra a busca achar "Tremembe" digitando "tremembé" e vice-versa
const normalizar = (texto: string) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

// Posts de exemplo pra o feed já nascer com conteúdo variado.
// Troque as imagens (imagemUrl) pelos arquivos reais quando tiver.
const OCORRENCIAS_INICIAIS: Ocorrencia[] = [
    {
        id: "post-1",
        autor: "Maria Silva",
        iniciais: "MS",
        endereco: "Avenida Armando de Moura, 256",
        bairro: "Três Marias",
        cidade: "Taubaté",
        tipo: "Alagamento",
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
        cidade: "Taubaté",
        tipo: "Árvore caída",
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
        cidade: "Taubaté",
        tipo: "Deslizamento de terra",
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
        cidade: "Taubaté",
        tipo: "Alagamento",
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
    {
        id: "post-5",
        autor: "Juliana Prado",
        iniciais: "JP",
        endereco: "Rua das Acácias, 310",
        bairro: "Quiririm",
        cidade: "Taubaté",
        tipo: "Buraco na via",
        tempo: "há 5 horas",
        status: "Aguardando",
        descricao:
            "Buraco grande no meio da rua, já causou dano em pelo menos dois carros. Está sem sinalização e piora quando chove.",
        imagemUrl: "https://picsum.photos/seed/buraco-quiririm/900/700",
        curtido: false,
        curtidas: 6,
        comentarios: [
            { id: "c5", autor: "Lucas Andrade", texto: "Passei aqui ontem e quase perdi o pneu." },
        ],
    },
    {
        id: "post-6",
        autor: "Thiago Mendes",
        iniciais: "TM",
        endereco: "Avenida Beira-Mar, 820",
        bairro: "Centro",
        cidade: "Ubatuba",
        tipo: "Alagamento",
        tempo: "há 6 horas",
        status: "Visualizado",
        descricao:
            "Maré alta somada à chuva deixou a avenida com água na altura do meio-fio. Comércios da região estão com dificuldade de abrir.",
        imagemUrl: "https://picsum.photos/seed/alagamento-ubatuba/900/700",
        curtido: false,
        curtidas: 9,
        comentarios: [],
    },
];

// Campo de select: cantos bem arredondados (o "menu suspenso" pedido) e um chevron próprio,
// já que o nativo do navegador não segue o border-radius do container.
const CAMPO_CLASSE =
    "w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0f2a8f] focus:ring-2 focus:ring-[#0f2a8f]/10";

export default function FeedPage() {
    const [busca, setBusca] = useState("");
    const [cidade, setCidade] = useState("");
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(OCORRENCIAS_INICIAIS);

    // Modal de nova publicação
    const [modalAberto, setModalAberto] = useState(false);
    const [novaLegenda, setNovaLegenda] = useState("");
    const [novaImagem, setNovaImagem] = useState<string | null>(null);
    const [novoTipo, setNovoTipo] = useState<TipoOcorrencia | "">("");
    const [novaCidade, setNovaCidade] = useState("");
    const [novoBairro, setNovoBairro] = useState("");
    const [novoEndereco, setNovoEndereco] = useState("");
    const inputImagemRef = useRef<HTMLInputElement>(null);

    // Texto do comentário sendo digitado, por ocorrência (id -> texto)
    const [comentarioAtual, setComentarioAtual] = useState<Record<string, string>>({});
    // Controla qual ocorrência deve tocar a animação de "curtir" no momento
    const [curtidaAnimando, setCurtidaAnimando] = useState<Record<string, boolean>>({});
    // Id da ocorrência aberta no modal estilo Instagram (null = nenhum aberto)
    const [postoSelecionado, setPostoSelecionado] = useState<string | null>(null);

    const cidades = ["Taubaté", "São José dos Campos", "Ubatuba", "Caraguatatuba", "São Sebastião"];
    const categorias = ["Todas", ...TIPOS_OCORRENCIA];

    const gerarIniciais = (nome: string) =>
        nome
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("");

    // ───── FILTROS E BUSCA ─────
    const termoBusca = normalizar(busca);
    const temFiltroAtivo = cidade !== "" || termoBusca !== "" || categoriaAtiva !== "Todas";

    const ocorrenciasFiltradas = ocorrencias.filter((oc) => {
        if (cidade && oc.cidade !== cidade) return false;
        if (categoriaAtiva !== "Todas" && oc.tipo !== categoriaAtiva) return false;
        if (termoBusca) {
            const texto = normalizar(
                `${oc.bairro} ${oc.endereco} ${oc.cidade} ${oc.tipo} ${oc.descricao}`,
            );
            if (!texto.includes(termoBusca)) return false;
        }
        return true;
    });

    const limparFiltros = () => {
        setBusca("");
        setCidade("");
        setCategoriaAtiva("Todas");
    };

    // ───── NOVA PUBLICAÇÃO ─────
    const handleSelecionarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        const url = URL.createObjectURL(arquivo);
        setNovaImagem(url);
    };

    const handleAbrirModal = () => {
        // Já sugere a cidade escolhida no filtro, se houver
        setNovaCidade(cidade);
        setModalAberto(true);
    };

    const handleFecharModal = () => {
        setNovaLegenda("");
        setNovaImagem(null);
        setNovoTipo("");
        setNovaCidade("");
        setNovoBairro("");
        setNovoEndereco("");
        setModalAberto(false);
    };

    const formularioValido =
        novoTipo !== "" &&
        novaCidade !== "" &&
        novoBairro.trim() !== "" &&
        novoEndereco.trim() !== "" &&
        (novaLegenda.trim() !== "" || novaImagem !== null);

    const handlePublicar = () => {
        if (!novoTipo || !novaCidade || !novoBairro.trim() || !novoEndereco.trim()) return;
        if (!novaLegenda.trim() && !novaImagem) return;

        const novaOcorrencia: Ocorrencia = {
            id: `post-${Date.now()}`,
            autor: "Você",
            iniciais: "EU",
            endereco: novoEndereco.trim(),
            bairro: novoBairro.trim(),
            cidade: novaCidade,
            tipo: novoTipo,
            tempo: "Agora mesmo",
            status: "Aguardando",
            descricao: novaLegenda.trim(),
            imagemUrl: novaImagem,
            curtido: false,
            curtidas: 0,
            comentarios: [],
        };

        setOcorrencias((prev) => [novaOcorrencia, ...prev]);

        // Garante que a publicação nova apareça no feed, mesmo com filtros ativos
        setBusca("");
        setCategoriaAtiva("Todas");
        if (cidade && cidade !== novaCidade) setCidade("");

        handleFecharModal();
    };

    const handleCurtir = (id: string) => {
        const ocorrencia = ocorrencias.find((oc) => oc.id === id);
        if (!ocorrencia) return;
        const vaiCurtir = !ocorrencia.curtido;

        setOcorrencias((prev) =>
            prev.map((oc) =>
                oc.id === id
                    ? { ...oc, curtido: vaiCurtir, curtidas: vaiCurtir ? oc.curtidas + 1 : oc.curtidas - 1 }
                    : oc,
            ),
        );

        // Só anima quando está curtindo (não quando remove a curtida)
        if (vaiCurtir) {
            setCurtidaAnimando((prev) => ({ ...prev, [id]: true }));
            setTimeout(() => {
                setCurtidaAnimando((prev) => ({ ...prev, [id]: false }));
            }, 500);
        }
    };

    const abrirPost = (id: string) => setPostoSelecionado(id);
    const fecharPost = () => setPostoSelecionado(null);

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

    // Contadores refletem o que está sendo exibido no feed
    const contagem = {
        aguardando: ocorrenciasFiltradas.filter((o) => o.status === "Aguardando").length,
        andamento: ocorrenciasFiltradas.filter((o) => o.status === "Em Andamento").length,
        visualizado: ocorrenciasFiltradas.filter((o) => o.status === "Visualizado").length,
    };

    // Ranking de bairros calculado a partir das publicações (respeita a cidade escolhida)
    const bairrosRanking = Object.entries(
        ocorrencias
            .filter((o) => !cidade || o.cidade === cidade)
            .reduce<Record<string, number>>((acc, o) => {
                acc[o.bairro] = (acc[o.bairro] || 0) + 1;
                return acc;
            }, {}),
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="min-h-screen w-full bg-[#f4f5f7]">
            {/* Animação do like — "pop" no ícone + onda saindo dele */}
            <style>{`
                @keyframes pluviteCurtirPop {
                    0% { transform: scale(1); }
                    35% { transform: scale(1.4) rotate(-10deg); }
                    65% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                .animate-curtir-pop {
                    animation: pluviteCurtirPop 450ms ease;
                }
            `}</style>
            {/* Um único acento de marca, discreto, no topo — em vez de vários blobs azuis espalhados */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#091f75]/[0.04] to-transparent" />

            <main className="relative z-10 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">

                {/* BANNER — no lugar do título, mapa decorativo com "pessoas" e marcações plotadas */}
                <div className="relative overflow-hidden rounded-2xl bg-[#091f75] p-6 sm:p-8 text-white shadow-sm mb-6">
                    <svg
                        className="absolute inset-0 w-full h-full opacity-[0.18]"
                        viewBox="0 0 1200 220"
                        fill="none"
                        preserveAspectRatio="xMidYMid slice"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M-20 30 C 200 0, 320 80, 480 50 S 780 0, 920 60 S 1180 50, 1240 15"
                            stroke="white" strokeWidth="1" />
                        <path d="M-20 110 C 180 140, 360 90, 520 120 S 820 170, 980 110 S 1200 130, 1260 165"
                            stroke="white" strokeWidth="1" />
                        <path d="M100 -10 C 130 50, 80 100, 140 150 S 260 210, 300 260"
                            stroke="white" strokeWidth="1" />
                        <path d="M560 -10 C 540 40, 600 80, 570 130 S 520 200, 550 250"
                            stroke="white" strokeWidth="1" />
                        <path d="M900 -10 C 880 50, 940 90, 910 140 S 870 200, 900 250"
                            stroke="white" strokeWidth="1" />
                        {/* "rio" — linha um pouco mais grossa e ondulada, cruzando o mapa */}
                        <path d="M-20 175 C 240 150, 440 200, 700 165 S 1080 130, 1260 175"
                            stroke="white" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
                    </svg>

                    {/* grade de pontos, pra lembrar textura de papel de mapa */}
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                    />

                    {/* Marcações "pin" com foto — como pessoas plotadas no mapa */}
                    {[
                        { img: 11, left: "42%", top: "10%", size: 40 },
                        { img: 32, left: "54%", top: "56%", size: 32 },
                        { img: 47, left: "66%", top: "16%", size: 44 },
                        { img: 5, left: "78%", top: "50%", size: 36 },
                        { img: 59, left: "90%", top: "12%", size: 36, lgOnly: true },
                    ].map((m) => (
                        <div
                            key={m.img}
                            className={`${m.lgOnly ? "hidden lg:block" : "hidden sm:block"} absolute -translate-x-1/2`}
                            style={{ left: m.left, top: m.top }}
                        >
                            <div className="relative flex flex-col items-center">
                                <img
                                    src={`https://i.pravatar.cc/100?img=${m.img}`}
                                    alt=""
                                    aria-hidden="true"
                                    style={{ width: m.size, height: m.size }}
                                    className="rounded-full object-cover ring-2 ring-white shadow-md"
                                />
                                {/* ponta do pin */}
                                <span className="w-2.5 h-2.5 bg-white rotate-45 -mt-[5px] shadow-sm" />
                            </div>
                        </div>
                    ))}

                    {/* Marcações simples, sem foto — reforçam a leitura de "vários pontos no mapa" */}
                    {[
                        { left: "35%", top: "40%" },
                        { left: "60%", top: "38%" },
                        { left: "73%", top: "68%" },
                        { left: "25%", top: "62%" },
                    ].map((m, i) => (
                        <MapPin
                            key={i}
                            size={16}
                            strokeWidth={2.5}
                            className="hidden sm:block absolute -translate-x-1/2 -translate-y-full text-white/70 drop-shadow"
                            style={{ left: m.left, top: m.top }}
                        />
                    ))}

                    <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                        <div className="max-w-xl space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                Feed de Ocorrências
                            </h1>
                            <p className="text-xs sm:text-sm text-white leading-relaxed">
                                Aqui você acompanha, em tempo real, alagamentos, quedas de árvore, buracos e outros
                                riscos relatados pela comunidade da sua região. Publique o que você vê, siga o status
                                de cada atendimento e ajude a mapear onde agir primeiro.
                            </p>
                        </div>

                        <button
                            onClick={handleAbrirModal}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-[#091f75] text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer shadow-sm shrink-0"
                        >
                            <Plus size={18} />
                            <span>Publicar Ocorrência</span>
                        </button>
                    </div>
                </div>

                {/* FILTROS DE PESQUISA */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative sm:w-56">
                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                className={`${CAMPO_CLASSE} appearance-none pl-10 pr-9 font-semibold cursor-pointer`}
                            >
                                <option value="">Todas as cidades</option>
                                {cidades.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                            <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por bairro, rua ou descrição (ex: Quiririm)..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className={`${CAMPO_CLASSE} pl-10 pr-10`}
                            />
                            {busca && (
                                <button
                                    onClick={() => setBusca("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    title="Limpar busca"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CATEGORIAS — chips quadrados (rounded-lg), sem o efeito de pílula */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1 no-scrollbar">
                        <Filter size={13} className="text-slate-400 mr-0.5 shrink-0" />
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaAtiva(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${categoriaAtiva === cat
                                    ? "bg-[#091f75] text-white border-[#091f75]"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}

                        {temFiltroAtivo && (
                            <button
                                onClick={limparFiltros}
                                className="ml-auto pl-3 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 whitespace-nowrap shrink-0 cursor-pointer transition"
                            >
                                <X size={13} />
                                Limpar filtros
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* FEED */}
                    <div className="w-full lg:w-2/3 space-y-4">

                        <p className="text-xs font-semibold text-slate-500 px-1">
                            {ocorrenciasFiltradas.length}{" "}
                            {ocorrenciasFiltradas.length === 1 ? "ocorrência encontrada" : "ocorrências encontradas"}
                        </p>

                        {ocorrenciasFiltradas.length === 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center gap-3">
                                <div className="p-3 rounded-full bg-slate-100 text-slate-400">
                                    <Search size={22} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Nenhuma ocorrência encontrada</h3>
                                <p className="text-xs text-slate-500 max-w-xs">
                                    Não há publicações com esses filtros. Tente outra busca ou limpe os filtros.
                                </p>
                                <button
                                    onClick={limparFiltros}
                                    className="mt-1 bg-[#091f75] hover:bg-[#0f2a8f] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}

                        {ocorrenciasFiltradas.map((oc) => {
                            const estilo = STATUS_ESTILO[oc.status];
                            const StatusIcon = estilo.icon;

                            return (
                                <article
                                    key={oc.id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition"
                                >
                                    <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-[#091f75] text-white font-bold flex items-center justify-center text-xs shrink-0">
                                                {oc.iniciais}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm leading-snug truncate">{oc.autor}</h3>
                                                <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500 mt-0.5">
                                                    <MapPin size={12} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">{oc.endereco}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="font-semibold text-slate-700">{oc.bairro}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>{oc.cidade}</span>
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

                                    {/* TIPO DA OCORRÊNCIA — chip neutro, quadrado, combinando com os filtros */}
                                    <div className="px-4 sm:px-5 pb-3 -mt-1.5">
                                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                                            {oc.tipo}
                                        </span>
                                    </div>

                                    {/* FOTO DA OCORRÊNCIA — clique abre o post completo, tipo Instagram */}
                                    {oc.imagemUrl && (
                                        <button
                                            onClick={() => abrirPost(oc.id)}
                                            className="w-full h-72 sm:h-80 bg-slate-100 overflow-hidden relative block cursor-pointer"
                                        >
                                            <img
                                                src={oc.imagemUrl}
                                                alt="Foto da ocorrência"
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    )}

                                    {/* BARRA DE INTERAÇÕES E AÇÕES */}
                                    <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleCurtir(oc.id)}
                                                className={`relative flex items-center gap-1.5 transition cursor-pointer ${oc.curtido ? "text-[#091f75]" : "hover:text-[#091f75]"}`}
                                            >
                                                {curtidaAnimando[oc.id] && (
                                                    <span className="absolute -left-1.5 -top-1.5 w-7 h-7 rounded-full bg-[#091f75]/20 animate-ping pointer-events-none" />
                                                )}
                                                <ThumbsUp
                                                    size={15}
                                                    fill={oc.curtido ? "currentColor" : "none"}
                                                    className={curtidaAnimando[oc.id] ? "animate-curtir-pop" : ""}
                                                />
                                                <span>Curtidas ({oc.curtidas})</span>
                                            </button>
                                            <button
                                                onClick={() => abrirPost(oc.id)}
                                                className="flex items-center gap-1.5 hover:text-[#091f75] transition cursor-pointer"
                                            >
                                                <MessageSquare size={15} />
                                                <span>Comentários ({oc.comentarios.length})</span>
                                            </button>
                                        </div>

                                        <button className="flex items-center gap-1.5 hover:text-[#091f75] transition cursor-pointer">
                                            <Share2 size={15} />
                                            <span className="hidden sm:inline">Compartilhar</span>
                                        </button>
                                    </div>

                                    {/* PRÉVIA DA LEGENDA — clique abre o post completo */}
                                    {oc.descricao && (
                                        <button
                                            onClick={() => abrirPost(oc.id)}
                                            className="block w-full text-left px-4 sm:px-5 pb-3 text-xs text-slate-700 font-medium leading-relaxed cursor-pointer"
                                        >
                                            <span className="font-bold text-slate-900">{oc.autor}</span>{" "}
                                            <span className="line-clamp-2">{oc.descricao}</span>
                                        </button>
                                    )}

                                    {oc.comentarios.length > 0 && (
                                        <button
                                            onClick={() => abrirPost(oc.id)}
                                            className="block w-full text-left px-4 sm:px-5 pb-4 -mt-1.5 text-xs text-slate-400 font-semibold hover:text-slate-600 cursor-pointer"
                                        >
                                            Ver {oc.comentarios.length === 1 ? "o comentário" : `todos os ${oc.comentarios.length} comentários`}
                                        </button>
                                    )}
                                </article>
                            );
                        })}
                    </div>

                    {/* COLUNA DIREITA — fixa na tela (sticky) com scroll próprio e delimitado,
                        em vez de tentar herdar uma altura indefinida do layout em flex */}
                    <aside className="w-full lg:w-1/3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4 pr-0.5">

                        {/* STATUS */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                                    <AlertTriangle size={15} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">{contagem.aguardando}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">Aguardando</span>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                                    <Wrench size={15} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">{contagem.andamento}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">Em Andamento</span>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm">
                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                    <Eye size={15} />
                                </div>
                                <span className="text-lg font-black text-slate-800 leading-tight">{contagem.visualizado}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">Visualizados</span>
                            </div>
                        </div>

                        {/* CARD SITUAÇÃO */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <CloudRain size={16} className="text-[#091f75]" />
                                    Situação em Três Marias
                                </h3>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
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
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                <TrendingUp size={16} className="text-[#091f75]" />
                                Bairros com mais relatos
                            </h3>

                            <div className="space-y-2 pt-1">
                                {bairrosRanking.length === 0 ? (
                                    <p className="text-xs text-slate-400 font-medium">Nenhum relato nessa região ainda.</p>
                                ) : (
                                    bairrosRanking.map(([bairro, chamados]) => (
                                        <div key={bairro} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <span className="font-semibold text-slate-700">{bairro}</span>
                                            <span className="text-[11px] font-bold text-[#091f75] bg-blue-50 px-2 py-0.5 rounded-md">
                                                {chamados} {chamados === 1 ? "relato" : "relatos"}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            {/* MODAL DE POST COMPLETO (ESTILO INSTAGRAM) */}
            {postoSelecionado && (() => {
                const post = ocorrencias.find((o) => o.id === postoSelecionado);
                if (!post) return null;
                const estiloPost = STATUS_ESTILO[post.status];
                const StatusIconPost = estiloPost.icon;

                return (
                    <div
                        className="fixed inset-0 bg-slate-950/90 z-[10002] flex items-center justify-center p-4"
                        onClick={fecharPost}
                    >
                        <button
                            onClick={fecharPost}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white cursor-pointer z-10"
                            title="Fechar"
                        >
                            <X size={28} />
                        </button>

                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* IMAGEM GRANDE */}
                            {post.imagemUrl && (
                                <div className="w-full md:w-3/5 bg-black flex items-center justify-center max-h-[45vh] md:max-h-[90vh] shrink-0">
                                    <img
                                        src={post.imagemUrl}
                                        alt="Foto da ocorrência"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}

                            {/* PAINEL DE LEGENDA E COMENTÁRIOS */}
                            <div className="w-full md:w-2/5 flex flex-col min-h-0">
                                {/* CABEÇALHO DO POST */}
                                <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-[#091f75] text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
                                            {post.iniciais}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug truncate">{post.autor}</h3>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                                                <MapPin size={11} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{post.endereco} • {post.bairro} • {post.cidade}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border shrink-0 ${estiloPost.badge}`}>
                                        <StatusIconPost size={11} />
                                        {estiloPost.texto}
                                    </span>
                                </div>

                                {/* LEGENDA + COMENTÁRIOS (rolável) */}
                                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5">
                                    <span className="inline-block text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                                        {post.tipo}
                                    </span>

                                    {post.descricao && (
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-[#091f75] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                                                {post.iniciais}
                                            </div>
                                            <p className="text-xs text-slate-700 leading-relaxed">
                                                <span className="font-bold text-slate-900">{post.autor}</span>{" "}
                                                {post.descricao}
                                            </p>
                                        </div>
                                    )}

                                    {post.comentarios.length === 0 ? (
                                        <p className="text-xs text-slate-400 font-medium pt-1">
                                            Nenhum comentário ainda. Seja o primeiro a comentar.
                                        </p>
                                    ) : (
                                        post.comentarios.map((com) => (
                                            <div key={com.id} className="flex items-start gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                                                    {gerarIniciais(com.autor)}
                                                </div>
                                                <p className="text-xs text-slate-700 leading-relaxed">
                                                    <span className="font-bold text-slate-900">{com.autor}</span>{" "}
                                                    {com.texto}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* AÇÕES, CURTIDAS E CAMPO DE COMENTÁRIO (fixo embaixo) */}
                                <div className="border-t border-slate-100 shrink-0">
                                    <div className="flex items-center justify-between px-4 pt-3">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleCurtir(post.id)}
                                                className={`relative transition cursor-pointer ${post.curtido ? "text-[#091f75]" : "text-slate-500 hover:text-[#091f75]"}`}
                                                title="Curtir"
                                            >
                                                {curtidaAnimando[post.id] && (
                                                    <span className="absolute -left-2 -top-2 w-9 h-9 rounded-full bg-[#091f75]/20 animate-ping pointer-events-none" />
                                                )}
                                                <ThumbsUp
                                                    size={20}
                                                    fill={post.curtido ? "currentColor" : "none"}
                                                    className={curtidaAnimando[post.id] ? "animate-curtir-pop" : ""}
                                                />
                                            </button>
                                            <MessageSquare size={20} className="text-slate-500" />
                                            <button className="text-slate-500 hover:text-[#091f75] transition cursor-pointer" title="Compartilhar">
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-4 pt-2">
                                        <span className="text-xs font-bold text-slate-800 block">
                                            {post.curtidas} {post.curtidas === 1 ? "curtida" : "curtidas"}
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                            {post.tempo}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 p-4 pt-3">
                                        <input
                                            type="text"
                                            value={comentarioAtual[post.id] || ""}
                                            onChange={(e) =>
                                                setComentarioAtual((prev) => ({ ...prev, [post.id]: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleEnviarComentario(post.id);
                                            }}
                                            placeholder="Adicione um comentário..."
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#091f75]"
                                        />
                                        <button
                                            onClick={() => handleEnviarComentario(post.id)}
                                            className="p-2.5 rounded-xl bg-[#091f75] hover:bg-[#0f2a8f] text-white transition cursor-pointer shrink-0"
                                            title="Enviar comentário"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* MODAL DE NOVA PUBLICAÇÃO */}
            {modalAberto && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
                    onClick={handleFecharModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                            <h2 className="font-bold text-slate-900 text-sm">Publicar Ocorrência</h2>
                            <button onClick={handleFecharModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto">
                            {/* TIPO DA OCORRÊNCIA */}
                            <div>
                                <label htmlFor="novo-tipo" className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Tipo de ocorrência
                                </label>
                                <div className="relative">
                                    <select
                                        id="novo-tipo"
                                        value={novoTipo}
                                        onChange={(e) => setNovoTipo(e.target.value as TipoOcorrencia | "")}
                                        className={`${CAMPO_CLASSE} appearance-none pr-9 cursor-pointer`}
                                    >
                                        <option value="" disabled>Selecione o tipo</option>
                                        {TIPOS_OCORRENCIA.map((tipo) => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* LOCAL */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="nova-cidade" className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Cidade
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="nova-cidade"
                                            value={novaCidade}
                                            onChange={(e) => setNovaCidade(e.target.value)}
                                            className={`${CAMPO_CLASSE} appearance-none pr-9 cursor-pointer`}
                                        >
                                            <option value="" disabled>Selecione a cidade</option>
                                            {cidades.map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="novo-bairro" className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Bairro
                                    </label>
                                    <input
                                        id="novo-bairro"
                                        type="text"
                                        value={novoBairro}
                                        onChange={(e) => setNovoBairro(e.target.value)}
                                        placeholder="Ex: Quiririm"
                                        className={CAMPO_CLASSE}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="novo-endereco" className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Endereço
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="novo-endereco"
                                        type="text"
                                        value={novoEndereco}
                                        onChange={(e) => setNovoEndereco(e.target.value)}
                                        placeholder="Rua e número (ou ponto de referência)"
                                        className={`${CAMPO_CLASSE} pl-10`}
                                    />
                                </div>
                            </div>

                            {/* DESCRIÇÃO */}
                            <div>
                                <label htmlFor="nova-legenda" className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Descrição
                                </label>
                                <textarea
                                    id="nova-legenda"
                                    value={novaLegenda}
                                    onChange={(e) => setNovaLegenda(e.target.value)}
                                    placeholder="Descreva o que está acontecendo..."
                                    rows={3}
                                    className={`${CAMPO_CLASSE} resize-none`}
                                />
                            </div>

                            <input
                                ref={inputImagemRef}
                                type="file"
                                accept="image/*"
                                onChange={handleSelecionarImagem}
                                className="hidden"
                            />

                            {novaImagem ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
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
                                    className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 text-slate-400 hover:border-[#091f75] hover:text-[#091f75] transition cursor-pointer"
                                >
                                    <ImagePlus size={22} />
                                    <span className="text-xs font-semibold">Adicionar foto</span>
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
                            <p className="text-[11px] text-slate-400 font-medium">
                                {formularioValido
                                    ? "Tudo certo para publicar."
                                    : "Informe o tipo, o local e uma descrição ou foto."}
                            </p>
                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={handleFecharModal}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-700 px-4 py-2.5 cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handlePublicar}
                                    disabled={!formularioValido}
                                    className="flex items-center gap-2 bg-[#091f75] hover:bg-[#0f2a8f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
                                >
                                    <Plus size={14} />
                                    Publicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}