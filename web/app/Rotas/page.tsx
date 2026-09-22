"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUp,
  ArrowUpDown,
  Check,
  Clock,
  CornerUpLeft,
  CornerUpRight,
  Flag,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  RotateCcw,
  Route,
  Search,
  X,
} from "lucide-react";
import { API_URL } from "@/app/lib/api";
import { MUNICIPIOS, normalizar, type Municipio } from "@/app/lib/constantes";
import type { Coordenada } from "@/app/components/MapaRotasComponent";

const MapaRotasSemSSR = dynamic(() => import("@/app/components/MapaRotasComponent"), {
  ssr: false,
  loading: () => <CarregandoMapa texto="Carregando mapa..." />,
});

// Ponto enviado ao backend: uma rua escolhida na lista ou uma coordenada (GPS / clique no mapa)
type Ponto = { rua: string } | { lat: number; lng: number };

interface CampoPonto {
  texto: string;
  ponto: Ponto | null;
}

interface DadosCidade {
  limites: [Coordenada, Coordenada];
  ruas: string[];
}

type TipoManobra = "inicio" | "reto" | "direita" | "esquerda" | "retorno" | "chegada";

interface Instrucao {
  tipo: TipoManobra;
  texto: string;
  rua: string;
  distancia: number;
}

interface ResultadoRota {
  distanciaMetros: number;
  duracaoSegundos: number;
  coordenadas: Coordenada[];
  instrucoes: Instrucao[];
}

const CAMPO_VAZIO: CampoPonto = { texto: "", ponto: null };
const CHAVE_CIDADE_SALVA = "pluvite:rotas:cidade";
const MAX_SUGESTOES = 8;

const ICONE_MANOBRA: Record<TipoManobra, typeof ArrowUp> = {
  inicio: Navigation,
  reto: ArrowUp,
  direita: CornerUpRight,
  esquerda: CornerUpLeft,
  retorno: RotateCcw,
  chegada: Flag,
};

const ERRO_CONEXAO =
  "Não foi possível conectar ao servidor de rotas. Verifique se o backend está rodando (npm run dev).";

// Campo usado nos inputs de origem/destino (mesmo padrão do Feed)
const CAMPO_CLASSE =
  "w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-9 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0f2a8f] focus:ring-2 focus:ring-[#0f2a8f]/10 placeholder:text-slate-400";

const formatarDistancia = (metros: number) =>
  metros < 1000
    ? `${Math.round(metros)} m`
    : `${(metros / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;

const formatarDuracao = (segundos: number) => {
  const minutos = Math.max(1, Math.round(segundos / 60));
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas} h ${String(minutos % 60).padStart(2, "0")} min`;
};

const horaDeChegada = (segundos: number) =>
  new Date(Date.now() + segundos * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const coordenadaDoPonto = (ponto: Ponto | null): Coordenada | null =>
  ponto && "lat" in ponto ? [ponto.lat, ponto.lng] : null;

const semAssinatura = () => () => {};

const lerCidadeSalva = (): Municipio | null => {
  try {
    const salva = localStorage.getItem(CHAVE_CIDADE_SALVA);
    return MUNICIPIOS.find((m) => m === salva) ?? null;
  } catch {
    // Sem acesso ao localStorage: o usuário só escolhe a cidade manualmente
    return null;
  }
};

function CarregandoMapa({ texto }: { texto: string }) {
  return (
    <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white">
      <p className="animate-pulse tracking-wide text-sm font-medium">{texto}</p>
    </div>
  );
}

/**
 * Campo de rua com autocompletar a partir das ruas do grafo da cidade.
 * O ponto só é considerado escolhido quando o usuário seleciona uma sugestão
 * (ou usa GPS / clique no mapa), garantindo que o backend conheça a rua.
 */
function CampoRua({
  id,
  placeholder,
  corMarcador,
  valor,
  ruas,
  onChange,
}: {
  id: string;
  placeholder: string;
  corMarcador: string;
  valor: CampoPonto;
  ruas: string[];
  onChange: (valor: CampoPonto) => void;
}) {
  const [focado, setFocado] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const sugestoes = useMemo(() => {
    const termo = normalizar(valor.texto);
    if (valor.ponto || termo.length < 2) return [];
    const encontradas = ruas.filter((rua) => normalizar(rua).includes(termo));
    // Prioriza ruas em que alguma palavra começa com o termo digitado
    const comecaCom = (rua: string) =>
      normalizar(rua)
        .split(" ")
        .some((palavra) => palavra.startsWith(termo));
    return [...encontradas.filter(comecaCom), ...encontradas.filter((r) => !comecaCom(r))].slice(
      0,
      MAX_SUGESTOES,
    );
  }, [valor, ruas]);

  const aberto = focado && sugestoes.length > 0;

  const selecionar = (rua: string) => {
    onChange({ texto: rua, ponto: { rua } });
    setFocado(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!aberto) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndiceAtivo((i) => Math.min(sugestoes.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndiceAtivo((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selecionar(sugestoes[indiceAtivo]);
    } else if (e.key === "Escape") {
      setFocado(false);
    }
  };

  return (
    <div className="relative">
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ring-2 ring-white shadow"
        style={{ backgroundColor: corMarcador }}
      />
      <input
        id={id}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={aberto}
        aria-controls={`${id}-lista`}
        placeholder={placeholder}
        value={valor.texto}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        onChange={(e) => {
          setIndiceAtivo(0);
          setFocado(true);
          onChange({ texto: e.target.value, ponto: null });
        }}
        onKeyDown={handleKeyDown}
        className={CAMPO_CLASSE}
      />
      {valor.texto && (
        <button
          type="button"
          aria-label="Limpar campo"
          onClick={() => onChange(CAMPO_VAZIO)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={15} />
        </button>
      )}

      {aberto && (
        <ul
          id={`${id}-lista`}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-64 overflow-y-auto rounded-2xl border border-[#3d5cc9] bg-[#091f75] p-1.5 shadow-xl shadow-[#091f75]/30"
        >
          {sugestoes.map((rua, i) => (
            <li
              key={rua}
              role="option"
              aria-selected={i === indiceAtivo}
              // onMouseDown evita que o blur do input feche a lista antes do clique
              onMouseDown={(e) => {
                e.preventDefault();
                selecionar(rua);
              }}
              onMouseEnter={() => setIndiceAtivo(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
                i === indiceAtivo ? "bg-white/15 text-white" : "text-white/85"
              }`}
            >
              <MapPin size={13} className="shrink-0 opacity-70" />
              <span className="truncate">{rua}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Caixa inicial: pergunta em qual cidade do Vale o usuário está
function ModalCidade({
  cidadeAtual,
  cidadesDisponiveis,
  erroServidor,
  onConfirmar,
  onFechar,
}: {
  cidadeAtual: Municipio | null;
  cidadesDisponiveis: string[] | null;
  erroServidor: boolean;
  onConfirmar: (cidade: Municipio) => void;
  onFechar: (() => void) | null;
}) {
  const [busca, setBusca] = useState("");
  const [escolhida, setSelecionada] = useState<Municipio | null>(cidadeAtual);
  // Pré-seleciona a última cidade usada; no servidor é sempre null, então o HTML não diverge
  const cidadeSalva = useSyncExternalStore(semAssinatura, lerCidadeSalva, () => null);
  const selecionada = escolhida ?? cidadeSalva;

  const cidadesFiltradas = MUNICIPIOS.filter((m) => normalizar(m).includes(normalizar(busca)));
  const disponivel = (cidade: string) =>
    !cidadesDisponiveis || cidadesDisponiveis.includes(normalizar(cidade));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10001] flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-cidade"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* CABEÇALHO */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#091f75]/[0.08] text-[#091f75] flex items-center justify-center shrink-0">
            <Route size={20} />
          </div>
          <div className="flex-1">
            <h2 id="titulo-modal-cidade" className="font-bold text-slate-800 text-lg">
              Em qual cidade você está?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Escolha um dos 39 municípios do Vale do Paraíba e Litoral Norte para carregar o mapa
              de ruas.
            </p>
          </div>
          {onFechar && (
            <button
              type="button"
              aria-label="Fechar"
              onClick={onFechar}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* BUSCA */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              autoFocus
              placeholder="Buscar cidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={CAMPO_CLASSE}
            />
          </div>
          {erroServidor && (
            <p className="mt-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-xl">
              {ERRO_CONEXAO}
            </p>
          )}
        </div>

        {/* LISTA DE MUNICÍPIOS */}
        <div className="p-5 pt-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {cidadesFiltradas.map((cidade) => {
            const ativa = cidade === selecionada;
            const habilitada = disponivel(cidade);
            return (
              <button
                key={cidade}
                type="button"
                disabled={!habilitada}
                onClick={() => setSelecionada(cidade)}
                onDoubleClick={() => habilitada && onConfirmar(cidade)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm text-left border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  ativa
                    ? "bg-[#091f75] border-[#091f75] text-white font-semibold"
                    : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="truncate">{cidade}</span>
                {ativa && <Check size={14} className="shrink-0" />}
                {!habilitada && (
                  <span className="text-[10px] font-bold uppercase tracking-wider">Em breve</span>
                )}
              </button>
            );
          })}
          {cidadesFiltradas.length === 0 && (
            <p className="col-span-full text-center text-sm text-slate-500 py-6">
              Nenhuma cidade encontrada.
            </p>
          )}
        </div>

        {/* RODAPÉ */}
        <div className="p-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={!selecionada || !disponivel(selecionada)}
            onClick={() => selecionada && onConfirmar(selecionada)}
            className="w-full bg-[#0d1b54] hover:bg-[#0d163b] text-white text-sm font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPin size={16} />
            {selecionada ? `Carregar mapa de ${selecionada}` : "Selecione uma cidade"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RotasPage() {
  const [cidade, setCidade] = useState<Municipio | null>(null);
  const [modalAberto, setModalAberto] = useState(true);
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<string[] | null>(null);
  const [erroServidor, setErroServidor] = useState(false);

  const [dadosCidade, setDadosCidade] = useState<DadosCidade | null>(null);
  const [carregandoCidade, setCarregandoCidade] = useState(false);

  const [origem, setOrigem] = useState<CampoPonto>(CAMPO_VAZIO);
  const [destino, setDestino] = useState<CampoPonto>(CAMPO_VAZIO);
  const [rota, setRota] = useState<ResultadoRota | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Descarta respostas antigas quando o usuário muda os pontos antes da rota voltar
  const idRequisicao = useRef(0);

  // CIDADES COM GRAFO DISPONÍVEL NO BACKEND
  useEffect(() => {
    fetch(`${API_URL}/api/rotas/cidades`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((lista: string[]) => setCidadesDisponiveis(lista))
      .catch((err) => {
        console.error("Erro ao listar cidades de rotas:", err);
        setErroServidor(true);
      });
  }, []);

  // CARREGAMENTO DO MAPA DA CIDADE ESCOLHIDA
  const handleConfirmarCidade = async (novaCidade: Municipio) => {
    setModalAberto(false);
    if (novaCidade === cidade && dadosCidade) return;

    try {
      localStorage.setItem(CHAVE_CIDADE_SALVA, novaCidade);
    } catch {
      // Sem localStorage (aba anônima, bloqueio) a cidade só não fica lembrada
    }

    setCidade(novaCidade);
    setDadosCidade(null);
    setOrigem(CAMPO_VAZIO);
    setDestino(CAMPO_VAZIO);
    setRota(null);
    setErro(null);
    setCarregandoCidade(true);

    try {
      const resposta = await fetch(`${API_URL}/api/rotas/${encodeURIComponent(novaCidade)}`);
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error ?? "Mapa indisponível para esta cidade.");
      setDadosCidade(dados);
    } catch (err) {
      console.error("Erro ao carregar mapa da cidade:", err);
      setErro(err instanceof TypeError ? ERRO_CONEXAO : (err as Error).message);
    } finally {
      setCarregandoCidade(false);
    }
  };

  // CÁLCULO AUTOMÁTICO DA ROTA QUANDO ORIGEM E DESTINO ESTÃO DEFINIDOS
  useEffect(() => {
    if (!cidade || !dadosCidade || !origem.ponto || !destino.ponto) return;

    const id = ++idRequisicao.current;
    const calcularRota = async () => {
      setCalculando(true);
      setErro(null);
      try {
        const resposta = await fetch(
          `${API_URL}/api/rotas/${encodeURIComponent(cidade)}/calcular`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origem: origem.ponto, destino: destino.ponto }),
          },
        );
        const dados = await resposta.json();
        if (id !== idRequisicao.current) return;
        if (!resposta.ok) throw new Error(dados.error ?? "Não foi possível calcular a rota.");

        setRota({
          ...dados,
          instrucoes: [
            ...dados.instrucoes,
            { tipo: "chegada", texto: "Você chegou ao destino", rua: destino.texto, distancia: 0 },
          ],
        });
      } catch (err) {
        if (id !== idRequisicao.current) return;
        console.error("Erro ao calcular rota:", err);
        setRota(null);
        setErro(err instanceof TypeError ? ERRO_CONEXAO : (err as Error).message);
      } finally {
        if (id === idRequisicao.current) setCalculando(false);
      }
    };

    calcularRota();
  }, [cidade, dadosCidade, origem.ponto, destino.ponto, destino.texto]);

  // Ao apagar/editar um ponto a rota atual deixa de valer (e respostas pendentes são descartadas)
  const invalidarRota = (campo: CampoPonto) => {
    if (campo.ponto) return;
    idRequisicao.current++;
    setRota(null);
    setCalculando(false);
  };

  const handleAlterarOrigem = (campo: CampoPonto) => {
    setOrigem(campo);
    invalidarRota(campo);
  };

  const handleAlterarDestino = (campo: CampoPonto) => {
    setDestino(campo);
    invalidarRota(campo);
  };

  // Clique no mapa preenche a origem e depois o destino
  const handleCliqueMapa = (lat: number, lng: number) => {
    const campo: CampoPonto = { texto: "Ponto marcado no mapa", ponto: { lat, lng } };
    if (!origem.ponto) setOrigem(campo);
    else setDestino(campo);
  };

  const handleUsarLocalizacao = () => {
    if (!navigator.geolocation) {
      setErro("Seu navegador não permite obter a localização. Digite a rua de origem.");
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setOrigem({
          texto: "Minha localização",
          ponto: { lat: posicao.coords.latitude, lng: posicao.coords.longitude },
        });
        setLocalizando(false);
      },
      () => {
        setErro("Não foi possível obter sua localização. Permita o acesso ou digite a rua.");
        setLocalizando(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleInverter = () => {
    setOrigem(destino);
    setDestino(origem);
  };

  const marcadorOrigem = rota ? rota.coordenadas[0] : coordenadaDoPonto(origem.ponto);
  const marcadorDestino = rota
    ? rota.coordenadas[rota.coordenadas.length - 1]
    : coordenadaDoPonto(destino.ponto);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 top-[68px] bg-slate-100">
        {/* MAPA */}
        {dadosCidade ? (
          <MapaRotasSemSSR
            limites={dadosCidade.limites}
            rota={rota?.coordenadas ?? null}
            origem={marcadorOrigem}
            destino={marcadorDestino}
            onCliqueMapa={handleCliqueMapa}
          />
        ) : (
          <CarregandoMapa
            texto={
              carregandoCidade
                ? `Carregando ruas de ${cidade}...`
                : "Escolha uma cidade para ver o mapa de rotas"
            }
          />
        )}
  
        {/* PAINEL DE ROTA (estilo GPS) */}
        {cidade && !modalAberto && (
          <div className="absolute top-3 left-3 right-3 md:right-auto md:w-[380px] max-h-[calc(100%-1.5rem)] overflow-y-auto z-[1000] bg-white rounded-2xl border border-slate-200 shadow-xl">
            {/* CABEÇALHO */}
            <div className="p-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-100">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Rotas em
                </p>
                <h1 className="font-black text-slate-900 text-lg leading-tight truncate">
                  {cidade}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#0f35a0] bg-[#0f35a0]/10 hover:bg-[#0f35a0]/15 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <MapPin size={14} />
                Trocar cidade
              </button>
            </div>
  
            {/* ORIGEM E DESTINO */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-2">
                  <CampoRua
                    id="campo-origem"
                    placeholder="De onde você está saindo? (rua)"
                    corMarcador="#0a9667"
                    valor={origem}
                    ruas={dadosCidade?.ruas ?? []}
                    onChange={handleAlterarOrigem}
                  />
                  <CampoRua
                    id="campo-destino"
                    placeholder="Para onde você vai? (rua)"
                    corMarcador="#ef4444"
                    valor={destino}
                    ruas={dadosCidade?.ruas ?? []}
                    onChange={handleAlterarDestino}
                  />
                </div>
                <button
                  type="button"
                  aria-label="Inverter origem e destino"
                  title="Inverter origem e destino"
                  onClick={handleInverter}
                  className="w-9 h-9 shrink-0 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center cursor-pointer"
                >
                  <ArrowUpDown size={16} />
                </button>
              </div>
  
              <button
                type="button"
                disabled={!dadosCidade || localizando}
                onClick={handleUsarLocalizacao}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0f35a0] px-1 py-1 cursor-pointer disabled:opacity-50"
              >
                {localizando ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LocateFixed size={14} />
                )}
                Usar minha localização atual como origem
              </button>
  
              {!rota && !calculando && !erro && dadosCidade && (
                <p className="text-[11px] text-slate-500 px-1">
                  Digite e escolha as ruas na lista ou clique no mapa para marcar a origem e o
                  destino.
                </p>
              )}
  
              {erro && (
                <p className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-2.5 rounded-xl">
                  {erro}
                </p>
              )}
  
              {calculando && (
                <div className="flex items-center gap-2 text-sm text-slate-600 px-1 py-2">
                  <Loader2 size={16} className="animate-spin text-[#0f35a0]" />
                  Calculando a melhor rota...
                </div>
              )}
            </div>
  
            {/* RESULTADO */}
            {rota && !calculando && (
              <div className="border-t border-slate-100">
                <div className="p-4 flex items-end justify-between gap-3 bg-[#091f75] text-white">
                  <div>
                    <p className="text-3xl font-black leading-none">
                      {formatarDuracao(rota.duracaoSegundos)}
                    </p>
                    <p className="text-xs text-white/70 mt-1.5">
                      {formatarDistancia(rota.distanciaMetros)} · rota mais rápida
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-xl">
                    <Clock size={13} />
                    Chegada às {horaDeChegada(rota.duracaoSegundos)}
                  </div>
                </div>
  
                <ol className="p-2">
                  {rota.instrucoes.map((passo, i) => {
                    const Icone = ICONE_MANOBRA[passo.tipo];
                    return (
                      <li
                        key={i}
                        className="flex items-center gap-3 px-2 py-2.5 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#091f75]/[0.08] text-[#091f75] flex items-center justify-center shrink-0">
                          <Icone size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 leading-snug">{passo.texto}</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {passo.rua}
                          </p>
                        </div>
                        {passo.distancia > 0 && (
                          <span className="text-xs font-bold text-slate-500 shrink-0">
                            {formatarDistancia(passo.distancia)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CAIXA DE ESCOLHA DA CIDADE — fora do container fixo para ficar acima da navbar */}
      {modalAberto && (
        <ModalCidade
          cidadeAtual={cidade}
          cidadesDisponiveis={cidadesDisponiveis}
          erroServidor={erroServidor}
          onConfirmar={handleConfirmarCidade}
          onFechar={cidade ? () => setModalAberto(false) : null}
        />
      )}
    </>
  );
}
