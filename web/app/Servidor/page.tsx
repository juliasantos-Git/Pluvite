"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Layers,
  AlertTriangle,
  Wrench,
  CheckCircle,
  Eye,
  Navigation,
  Clock,
  History,
} from "lucide-react";

const listaMunicipios = [
  "Aparecida",
  "Arapeí",
  "Areias",
  "Bananal",
  "Caçapava",
  "Cachoeira Paulista",
  "Campos do Jordão",
  "Caraguatatuba",
  "Cruzeiro",
  "Cunha",
  "Guaratinguetá",
  "Igaratá",
  "Ilhabela",
  "Jacareí",
  "Jambeiro",
  "Lagoinha",
  "Lorena",
  "Monteiro Lobato",
  "Natividade da Serra",
  "Paraibuna",
  "Pindamonhangaba",
  "Piquete",
  "Potim",
  "Potunduva",
  "Redenção da Serra",
  "Roseira",
  "Santa Branca",
  "Santo Antônio do Pinhal",
  "São Bento do Sapucaí",
  "São José do Barreiro",
  "São José dos Campos",
  "São Luís do Paraitinga",
  "São Sebastião",
  "Silveiras",
  "Taubaté",
  "Tremembé",
  "Ubatuba",
].sort((a, b) => a.localeCompare(b));

const CORES_PRIORIDADE: Record<string, string> = {
  "Alerta Máximo": "#653dc2",
  "Estado de Alerta": "#ef4444",
  "Atenção Crítica": "#f59e0b",
  "Zona Segura": "#0a9667",
};

export default function PainelAdministrativo() {
  const [municipioFiltro, setMunicipioFiltro] = useState("Todos os Municípios");
  const [prioridadeFiltro, setPrioridadeFiltro] = useState(
    "Todas as Prioridades",
  );
  const [chamados, setChamados] = useState<any[]>([]);
  const [historicoLogs, setHistoricoLogs] = useState<any[]>([]);

  const calcularTempo = (criadoEm: string) => {
    if (!criadoEm) return "Agora mesmo";
    const diffMin = Math.floor(
      (Date.now() - new Date(criadoEm).getTime()) / 60000,
    );
    if (diffMin < 1) return "Agora mesmo";
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffHoras = Math.floor(diffMin / 60);
    return `há ${diffHoras} ${diffHoras === 1 ? "hora" : "horas"}`;
  };

  const buscarDadosBanco = async () => {
    try {
      const resposta = await fetch("http://localhost:3001/api/alertas");
      if (resposta.ok) {
        const alertasReais = await resposta.json();
        if (Array.isArray(alertasReais)) {
          const alertasFormatados = alertasReais.map((alerta: any) => {
            let statusBruto =
              alerta.statusatual || alerta.statusAtual || "Aguardando";
            let statusTratado = "Aguardando";

            if (statusBruto.toLowerCase() === "visualizado")
              statusTratado = "Visualizado";
            if (statusBruto.toLowerCase() === "em andamento")
              statusTratado = "Em Andamento";
            if (
              statusBruto.toLowerCase() === "concluído" ||
              statusBruto.toLowerCase() === "concluido"
            )
              statusTratado = "Concluído";

            const bairroDetectado =
              alerta.bairro || alerta.cidadao?.bairro || "Geral";

            return {
              id: alerta.id,
              tipo: alerta.tipo,
              prioridade: alerta.prioridade,
              bairro: bairroDetectado,
              municipio: alerta.municipio,
              usuario:
                alerta.usuario || alerta.cidadao?.nome_completo || "Cidadão",
              endereco: alerta.endereco,
              tempo: calcularTempo(alerta.criado_em),
              descricao: alerta.descricao,
              statusAtual: statusTratado,
            };
          });
          setChamados(alertasFormatados);
        }
      }

      const resHistorico = await fetch("http://localhost:3001/api/historico");
      if (resHistorico.ok) {
        const dadosLogs = await resHistorico.json();
        setHistoricoLogs(dadosLogs);
      }
    } catch (e) {
      console.log("Erro ao buscar dados:", e);
    }
  };

  useEffect(() => {
    buscarDadosBanco();
    const idIntervalo = setInterval(buscarDadosBanco, 5000);
    return () => clearInterval(idIntervalo);
  }, []);

  const sincronizarStatusBanco = async (
    id: string,
    novoStatus: string,
    logMsg: string,
    corLog: string,
  ) => {
    try {
      await fetch(`http://localhost:3001/api/alertas/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_atual: novoStatus }),
      });

      const alvo = chamados.find((c) => c.id === id);

      await fetch("http://localhost:3001/api/historico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertaId: id,
          cidade: alvo ? alvo.municipio : "Geral",
          acao: logMsg,
          corAcao: corLog,
        }),
      });

      buscarDadosBanco();
    } catch (err) {
      console.error("Erro na sincronização:", err);
    }
  };

  const handleMarcarComoVisto = (id: string) => {
    setChamados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statusAtual: "Visualizado" } : c)),
    );
    sincronizarStatusBanco(
      id,
      "Visualizado",
      "Comando operacional visualizou o risco iminente.",
      "text-blue-500",
    );
  };

  const handleDespacharEquipe = (id: string) => {
    setChamados((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, statusAtual: "Em Andamento" } : c,
      ),
    );
    sincronizarStatusBanco(
      id,
      "Em Andamento",
      "Equipes de mitigação de crise foram enviadas.",
      "text-amber-500",
    );
  };

  const handleMarcarConcluido = (id: string) => {
    setChamados((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statusAtual: "Concluído" } : c)),
    );
    sincronizarStatusBanco(
      id,
      "Concluído",
      "Ocorrência controlada e vias públicas limpas.",
      "text-emerald-500",
    );
  };

  const chamadosFiltrados = useMemo(() => {
    return chamados.filter((chamado) => {
      const atendeMunicipio =
        municipioFiltro === "Todos os Municípios" ||
        chamado.municipio === municipioFiltro;
      const atendePrioridade =
        prioridadeFiltro === "Todas as Prioridades" ||
        chamado.prioridade === prioridadeFiltro;
      return atendeMunicipio && atendePrioridade;
    });
  }, [chamados, municipioFiltro, prioridadeFiltro]);

  const metricas = useMemo(() => {
    const totalVisiveis = chamadosFiltrados.length;
    let ativos = 0,
      criticos = 0,
      emAndamento = 0,
      concluidos = 0,
      aguardando = 0,
      visualizados = 0;
    const contagemMunicipios: Record<string, number> = {};

    chamadosFiltrados.forEach((c) => {
      if (c.statusAtual !== "Concluído") ativos++;
      if (
        c.prioridade === "Alerta Máximo" ||
        c.prioridade === "Estado de Alerta"
      )
        criticos++;
      if (c.statusAtual === "Em Andamento") emAndamento++;
      if (c.statusAtual === "Concluído") concluidos++;
      if (c.statusAtual === "Aguardando") aguardando++;
      if (c.statusAtual === "Visualizado") visualizados++;
      contagemMunicipios[c.municipio] =
        (contagemMunicipios[c.municipio] || 0) + 1;
    });

    const dadosBarras = Object.keys(contagemMunicipios).map((muni) => {
      const amostra = chamadosFiltrados.find((c) => c.municipio === muni);
      return {
        name: muni,
        total: contagemMunicipios[muni],
        color: amostra ? CORES_PRIORIDADE[amostra.prioridade] : "#64748b",
      };
    });

    const pctVis =
      totalVisiveis > 0 ? Math.round((visualizados / totalVisiveis) * 100) : 0;
    const pctAgu =
      totalVisiveis > 0 ? Math.round((aguardando / totalVisiveis) * 100) : 0;
    const pctCon =
      totalVisiveis > 0 ? Math.round((concluidos / totalVisiveis) * 100) : 0;
    const pctAnd =
      totalVisiveis > 0 ? Math.round((emAndamento / totalVisiveis) * 100) : 0;

    const dadosPizza = [
      { name: "Visualizado", value: pctVis, color: "#3267bd" },
      { name: "Aguardando", value: pctAgu, color: "#787a7e" },
      { name: "Concluído", value: pctCon, color: "#179168" },
      { name: "Em Andamento", value: pctAnd, color: "#f59e0b" },
    ];

    return {
      ativos,
      criticos,
      emAndamento,
      concluidos,
      dadosBarras,
      dadosPizza,
    };
  }, [chamadosFiltrados]);

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden w-[calc(100vw-64px)] mt-10 bg-slate-50 p-6 md:p-8 font-sans text-slate-800 pb-16 ml-16">
      <div className="pt-8 mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Painel Administrativo
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Gerencie ocorrências e despache equipes em tempo real
        </p>
      </div>

      {/* Grid de Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between h-40 shadow-sm">
          <Layers className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.ativos}</h2>
            <p className="text-xs font-semibold opacity-90">Chamados Ativos</p>
          </div>
        </div>
        <div className="bg-red-600 rounded-2xl p-6 text-white flex flex-col justify-between h-40 shadow-sm">
          <AlertTriangle className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.criticos}</h2>
            <p className="text-xs font-semibold opacity-90">
              Ocorrências Críticas
            </p>
          </div>
        </div>
        <div className="bg-amber-500 rounded-2xl p-6 text-white flex flex-col justify-between h-40 shadow-sm">
          <Wrench className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.emAndamento}</h2>
            <p className="text-xs font-semibold opacity-90">Em Andamento</p>
          </div>
        </div>
        <div className="bg-emerald-700 rounded-2xl p-6 text-white flex flex-col justify-between h-40 shadow-sm">
          <CheckCircle className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.concluidos}</h2>
            <p className="text-xs font-semibold opacity-90">Concluídos</p>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-base mb-6">
            Ocorrências por Município
          </h3>
          <div className="h-64 w-full">
            {metricas.dadosBarras.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                Nenhum dado para exibir
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricas.dadosBarras}
                  margin={{ top: 10, right: 10, left: -25, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={35}>
                    {metricas.dadosBarras.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-base mb-4">
            Status dos Chamados (%)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center h-full gap-4">
            <div className="space-y-4 text-xs hidden sm:block">
              <p className="text-blue-500 font-bold">
                Visualizado: {metricas.dadosPizza[0].value}%
              </p>
              <p className="text-amber-500 font-bold">
                Em Andamento: {metricas.dadosPizza[3].value}%
              </p>
            </div>
            <div className="h-48 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricas.dadosPizza}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={70}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {metricas.dadosPizza.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 text-xs hidden sm:block text-right">
              <p className="text-slate-400 font-bold">
                Aguardando: {metricas.dadosPizza[1].value}%
              </p>
              <p className="text-emerald-500 font-bold">
                Concluído: {metricas.dadosPizza[2].value}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Ações Operacionais */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <History className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-800 text-base">
            Histórico de Ações Operacionais
          </h3>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
          {historicoLogs.length === 0 ? (
            <div className="text-xs text-slate-400 py-2">
              Nenhuma ação operacional registrada ainda.
            </div>
          ) : (
            historicoLogs.map((log) => (
              <div
                key={log.id}
                className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-black uppercase tracking-wider ${log.cor_acao || "text-blue-500"}`}
                  >
                    • REGISTRO
                  </span>
                  <span className="text-slate-400 font-bold">
                    ({log.cidade})
                  </span>
                  <p className="text-slate-600 font-semibold">{log.acao}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-bold shrink-0">
                  <Clock size={12} />
                  <span>
                    {log.criado_at
                      ? new Date(log.criado_at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Filtros de Seleção */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 mb-6">
        <div className="flex-1 max-w-xs relative">
          <select
            value={municipioFiltro}
            onChange={(e) => setMunicipioFiltro(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="Todos os Municípios">Todos os Municípios</option>
            {listaMunicipios.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-3.5 text-[9px] text-slate-400 pointer-events-none">
            ▼
          </span>
        </div>
        <div className="flex-1 max-w-xs relative">
          <select
            value={prioridadeFiltro}
            onChange={(e) => setPrioridadeFiltro(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="Todas as Prioridades">Todas as Prioridades</option>
            <option value="Alerta Máximo">Alerta Máximo</option>
            <option value="Estado de Alerta">Estado de Alerta</option>
            <option value="Atenção Crítica">Atenção Crítica</option>
            <option value="Zona Segura">Zona Segura</option>
          </select>
          <span className="absolute right-4 top-3.5 text-[9px] text-slate-400 pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      {/* Lista Dinâmica de Ocorrências */}
      <div className="space-y-4">
        {chamadosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400 text-xs font-semibold">
            Nenhuma ocorrência encontrada para esta combinação de filtros.
          </div>
        ) : (
          chamadosFiltrados.map((chamado) => (
            <div
              key={chamado.id}
              className="flex flex-col md:flex-row bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm justify-between items-start md:items-center gap-6"
            >
              {/* Lado Esquerdo: Identificação e Textos */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="p-1.5 rounded-lg text-white shadow-sm"
                    style={{
                      backgroundColor:
                        CORES_PRIORIDADE[chamado.prioridade] || "#94a3b8",
                    }}
                  >
                    <AlertTriangle size={15} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm md:text-base">
                    {chamado.tipo}
                  </h4>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor:
                        CORES_PRIORIDADE[chamado.prioridade] || "#94a3b8",
                    }}
                  >
                    {chamado.prioridade}
                  </span>

                  {/* MODIFICAÇÃO SELECIONADA: Exibe agora o município dinâmico recebido do banco de dados */}
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {chamado.municipio}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold items-center">
                  <span>👤 {chamado.usuario}</span>

                  {/* MODIFICAÇÃO SELECIONADA: Removido o '(municipio)' daqui para não repetir com a tag superior */}
                  <span>📍 {chamado.endereco}</span>

                  <span>🕒 {chamado.tempo}</span>
                </div>
                <p className="text-slate-600 text-xs md:text-sm font-medium pt-1">
                  {chamado.descricao}
                </p>
              </div>

              {/* Lado Direito: Botões Operacionais e Status */}
              <div className="flex flex-col items-stretch md:items-end gap-2 shrink-0 w-full md:w-auto min-w-[170px]">
                {chamado.statusAtual === "Aguardando" && (
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleMarcarComoVisto(chamado.id)}
                      className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      Marcar como Visto
                    </button>
                    <button
                      onClick={() => handleDespacharEquipe(chamado.id)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Navigation size={12} className="fill-white" /> Despachar
                      Equipe
                    </button>
                  </div>
                )}

                {chamado.statusAtual === "Visualizado" && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 justify-center">
                      <Eye size={12} /> Visualizado
                    </span>
                    <button
                      onClick={() => handleDespacharEquipe(chamado.id)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Navigation size={12} className="fill-white" /> Despachar
                      Equipe
                    </button>
                  </div>
                )}

                {chamado.statusAtual === "Em Andamento" && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 justify-center">
                      <Wrench size={12} /> Em Andamento
                    </span>
                    <button
                      onClick={() => handleMarcarConcluido(chamado.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <CheckCircle size={12} /> Marcar Concluído
                    </button>
                  </div>
                )}

                {chamado.statusAtual === "Concluído" && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1 w-full text-center border border-emerald-200">
                    ✓ Finalizado
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
