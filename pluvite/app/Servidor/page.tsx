"use client";
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Layers, AlertTriangle, Wrench, CheckCircle, Eye, Navigation } from 'lucide-react';

// --- LISTA OFICIAL DOS 39 MUNICÍPIOS DO VALE DO PARAÍBA E LITORAL NORTE ---
const listaMunicipios = [
  "Aparecida", "Arapeí", "Areias", "Bananal", "Caçapava", "Cachoeira Paulista", 
  "Campos do Jordão", "Caraguatatuba", "Cruzeiro", "Cunha", "Guaratinguetá", 
  "Igaratá", "Ilhabela", "Jacareí", "Jambeiro", "Lagoinha", "Lorena", 
  "Monteiro Lobato", "Natividade da Serra", "Paraibuna", "Pindamonhangaba", 
  "Piquete", "Potim", "Potunduva", "Redenção da Serra", "Roseira", "Santa Branca", 
  "Santo Antônio do Pinhal", "São Bento do Sapucaí", "São José do Barreiro", 
  "São José dos Campos", "São Luís do Paraitinga", "São Sebastião", "Silveiras", 
  "Taubaté", "Tremembé", "Ubatuba"
].sort((a, b) => a.localeCompare(b));

// --- CORRESPONDÊNCIA DE CORES DA LEGENDA OFICIAL ---
const CORES_PRIORIDADE: Record<string, string> = {
  'Alerta Máximo': '#653dc2',    // Roxo
  'Estado de Alerta': '#ef4444',  // Vermelho
  'Atenção Crítica': '#f59e0b',   // Laranja
  'Zona Segura': '#0a9667',       // Verde
};

// --- BASE DE DADOS EXPANDIDA COM EXEMPLOS DE VÁRIAS CIDADES ---
const chamadosIniciais = [
  {
    id: 1,
    tipo: 'Alagamento',
    prioridade: 'Alerta Máximo',
    bairro: 'Cecap',
    municipio: 'Taubaté',
    usuario: 'Maria Silva',
    endereco: 'Av. Charles Schnneider, 1500',
    tempo: 'há 15 min',
    descricao: 'Alagamento grave, água ultrapassando 50cm',
    statusAtual: 'Aguardando' 
  },
  {
    id: 2,
    tipo: 'Enchente',
    prioridade: 'Alerta Máximo',
    bairro: 'Esplanada Santa Terezinha',
    municipio: 'Taubaté',
    usuario: 'Carlos Eduardo',
    endereco: 'Praça Santa Terezinha, 45',
    tempo: 'há 5 horas',
    descricao: 'Rio transbordando próximo às residências',
    statusAtual: 'Aguardando'
  },
  {
    id: 3,
    tipo: 'Inundação de Via',
    prioridade: 'Estado de Alerta',
    bairro: 'Centro',
    municipio: 'São José dos Campos',
    usuario: 'Marcos Oliveira',
    endereco: 'Av. Nelson D\'Ávila, 400',
    tempo: 'há 20 min',
    descricao: 'Água subindo rapidamente na altura do cruzamento central.',
    statusAtual: 'Em Andamento'
  },
  {
    id: 4,
    tipo: 'Desabamento de Encosta',
    prioridade: 'Alerta Máximo',
    bairro: 'Morro do Algodão',
    municipio: 'Caraguatatuba',
    usuario: 'Roberto Souza',
    endereco: 'Rua das Flores, 88',
    tempo: 'há 1 hora',
    descricao: 'Deslizamento parcial de terra sobre via pública.',
    statusAtual: 'Aguardando'
  },
  {
    id: 5,
    tipo: 'Bueiro Entupido',
    prioridade: 'Atenção Crítica',
    bairro: 'Jardim das Nações',
    municipio: 'Taubaté',
    usuario: 'Ana Paula Costa',
    endereco: 'Rua Emílio Winther, 800',
    tempo: 'há 3 horas',
    descricao: 'Bueiro completamente entupido com lixo',
    statusAtual: 'Visualizado' 
  },
  {
    id: 6,
    tipo: 'Queda de Árvore',
    prioridade: 'Atenção Crítica',
    bairro: 'Jardim Califórnia',
    municipio: 'Jacareí',
    usuario: 'Fernanda Lima',
    endereco: 'Av. Getúlio Vargas, 1200',
    tempo: 'há 2 hours',
    descricao: 'Árvore de grande porte caída interditando meia pista.',
    statusAtual: 'Em Andamento'
  },
  {
    id: 7,
    tipo: 'Acúmulo de Água',
    prioridade: 'Zona Segura',
    bairro: 'Estiva',
    municipio: 'Taubaté',
    usuario: 'Ricardo Santos',
    endereco: 'Rua Voluntário Penna Ramos, 31',
    tempo: 'há 4 horas',
    descricao: 'Poça de água na sarjeta sem risco iminente de invasão.',
    statusAtual: 'Concluído'
  },
  {
    id: 8,
    tipo: 'Vazamento de Esgoto',
    prioridade: 'Zona Segura',
    bairro: 'Maranduba',
    municipio: 'Ubatuba',
    usuario: 'Juliana Prado',
    endereco: 'Av. Marginal, 500',
    tempo: 'há 6 horas',
    descricao: 'Odor forte vindo de bueiro sem transbordamento iminente.',
    statusAtual: 'Concluído'
  }
];

export default function PainelAdministrativo() {
  const [municipioFiltro, setMunicipioFiltro] = useState('Todos os Municípios');
  const [prioridadeFiltro, setPrioridadeFiltro] = useState('Todas as Prioridades');
  const [chamados, setChamados] = useState(chamadosIniciais);

  // --- HANDLERS INTERATIVOS ---
  const handleMarcarComoVisto = (id: number) => {
    setChamados(prev => prev.map(c => c.id === id ? { ...c, statusAtual: 'Visualizado' } : c));
  };

  const handleDespacharEquipe = (id: number) => {
    setChamados(prev => prev.map(c => c.id === id ? { ...c, statusAtual: 'Em Andamento' } : c));
  };

  const handleMarcarConcluido = (id: number) => {
    setChamados(prev => prev.map(c => c.id === id ? { ...c, statusAtual: 'Concluído' } : c));
  };

  // --- FILTRAGEM REATIVA DA LISTA ---
  const chamadosFiltrados = useMemo(() => {
    return chamados.filter(chamado => {
      const atendeMunicipio = municipioFiltro === 'Todos os Municípios' || chamado.municipio === municipioFiltro;
      const atendePrioridade = prioridadeFiltro === 'Todas as Prioridades' || chamado.prioridade === prioridadeFiltro;
      return atendeMunicipio && atendePrioridade;
    });
  }, [chamados, municipioFiltro, prioridadeFiltro]);

  // --- PROCESSAMENTO DE MÉTRICAS E GRÁFICOS ---
  const metricas = useMemo(() => {
    const totalVisiveis = chamadosFiltrados.length;
    let ativos = 0;
    let criticos = 0;
    let emAndamento = 0;
    let concluidos = 0;
    let aguardando = 0;
    let visualizados = 0;

    const contagemMunicipios: Record<string, number> = {};

    chamadosFiltrados.forEach(c => {
      if (c.statusAtual !== 'Concluído') ativos++;
      if (c.prioridade === 'Alerta Máximo' || c.prioridade === 'Estado de Alerta') criticos++;
      if (c.statusAtual === 'Em Andamento') emAndamento++;
      if (c.statusAtual === 'Concluído') concluidos++;
      if (c.statusAtual === 'Aguardando') aguardando++;
      if (c.statusAtual === 'Visualizado') visualizados++;

      contagemMunicipios[c.municipio] = (contagemMunicipios[c.municipio] || 0) + 1;
    });

    const dadosBarras = Object.keys(contagemMunicipios).map(muni => {
      const amostra = chamadosFiltrados.find(c => c.municipio === muni);
      return {
        name: muni,
        total: contagemMunicipios[muni],
        color: amostra ? CORES_PRIORIDADE[amostra.prioridade] : '#64748b'
      };
    });

    const pctVis = totalVisiveis > 0 ? Math.round((visualizados / totalVisiveis) * 100) : 0;
    const pctAgu = totalVisiveis > 0 ? Math.round((aguardando / totalVisiveis) * 100) : 0;
    const pctCon = totalVisiveis > 0 ? Math.round((concluidos / totalVisiveis) * 100) : 0;
    const pctAnd = totalVisiveis > 0 ? Math.round((emAndamento / totalVisiveis) * 100) : 0;

    const dadosPizza = [
      { name: 'Visualizado', value: pctVis, color: '#3267bd' },
      { name: 'Aguardando', value: pctAgu, color: '#787a7e' },
      { name: 'Concluído', value: pctCon, color: '#179168' },
      { name: 'Em Andamento', value: pctAnd, color: '#f59e0b' },
    ];

    return { ativos, criticos, emAndamento, concluidos, dadosBarras, dadosPizza };
  }, [chamadosFiltrados]);

  return (
    // pb-16 na div principal adiciona um espaçamento natural de 64px no final da rolagem
    <div className="h-screen w-full overflow-y-auto bg-slate-50 p-6 md:p-8 font-sans text-slate-800 pb-16">

      {/* --- HEADER DO PAINEL (EQUILIBRADO) --- */}
      <div className="pt-8 mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Painel Administrativo</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Gerencie ocorrências e despache equipes em tempo real</p>
      </div>

      {/* --- CARDS METRICOS OPERACIONAIS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-40">
          <Layers className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.ativos}</h2>
            <p className="text-xs font-semibold opacity-90">Chamados Ativos</p>
          </div>
        </div>

        <div className="bg-red-600 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-40">
          <AlertTriangle className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.criticos}</h2>
            <p className="text-xs font-semibold opacity-90">Ocorrências Críticas</p>
          </div>
        </div>

        <div className="bg-amber-500 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-40">
          <Wrench className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.emAndamento}</h2>
            <p className="text-xs font-semibold opacity-90">Em Andamento</p>
          </div>
        </div>

        <div className="bg-emerald-700 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-40">
          <CheckCircle className="w-7 h-7 opacity-90" />
          <div>
            <h2 className="text-4xl font-black mb-1">{metricas.concluidos}</h2>
            <p className="text-xs font-semibold opacity-90">Concluídos</p>
          </div>
        </div>
      </div>

      {/* --- GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-slate-800 text-base">Ocorrências por Município</h3>
          </div>
          <div className="h-64 w-full">
            {metricas.dadosBarras.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">Nenhum dado para exibir</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricas.dadosBarras} margin={{ top: 10, right: 10, left: -25, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-25} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Bar 
                    dataKey="total" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={35}
                    isAnimationActive={true}
                    animationDuration={400}
                    animationEasing="linear"
                  >
                    {metricas.dadosBarras.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-slate-800 text-base">Status dos Chamados (%)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center h-full gap-4">
            <div className="space-y-4 text-xs hidden sm:block">
              <p className="text-blue-500 font-bold">Visualizado: {metricas.dadosPizza[0].value}%</p>
              <p className="text-amber-500 font-bold">Em Andamento: {metricas.dadosPizza[3].value}%</p>
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
                    isAnimationActive={true}
                    animationDuration={350}
                    animationEasing="ease-out"
                  >
                    {metricas.dadosPizza.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 text-xs hidden sm:block text-right">
              <p className="text-slate-400 font-bold">Aguardando: {metricas.dadosPizza[1].value}%</p>
              <p className="text-emerald-500 font-bold">Concluído: {metricas.dadosPizza[2].value}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SELETORES DE FILTRO --- */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 mb-6">
        <div className="flex-1 max-w-xs relative">
          <select 
            value={municipioFiltro}
            onChange={(e) => setMunicipioFiltro(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="Todos os Municípios">Todos os Municípios</option>
            {listaMunicipios.map((cidade) => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
          <span className="absolute right-4 top-3.5 text-[9px] text-slate-400 pointer-events-none">▼</span>
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
          <span className="absolute right-4 top-3.5 text-[9px] text-slate-400 pointer-events-none">▼</span>
        </div>
      </div>

      {/* --- HISTÓRICO DE OCORRÊNCIAS --- */}
      <div className="space-y-4">
        {chamadosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400 text-xs font-semibold">
            Nenhuma ocorrência encontrada para esta combinação de região e filtros.
          </div>
        ) : (
          chamadosFiltrados.map((chamado) => (
            <div key={chamado.id} className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div 
                    className="p-1.5 rounded-lg text-white shadow-sm"
                    style={{ backgroundColor: CORES_PRIORIDADE[chamado.prioridade] || '#94a3b8' }}
                  >
                    <AlertTriangle size={15} />
                  </div>
                  
                  <h4 className="font-black text-slate-900 text-sm md:text-base">{chamado.tipo}</h4>
                  
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: CORES_PRIORIDADE[chamado.prioridade] || '#94a3b8' }}
                  >
                    {chamado.prioridade}
                  </span>
                  
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {chamado.bairro}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold items-center">
                  <span>👤 {chamado.usuario}</span>
                  <span>📍 {chamado.endereco} ({chamado.municipio})</span>
                  <span>🕒 {chamado.tempo}</span>
                </div>

                <p className="text-slate-600 text-xs md:text-sm font-medium pt-1">
                  {chamado.descricao}
                </p>
              </div>

              {/* Botões Operacionais das Equipes */}
              <div className="flex flex-col items-stretch md:items-end gap-2 shrink-0 w-full md:w-auto min-w-[170px]">
                
                {chamado.statusAtual === 'Aguardando' && (
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
                      <Navigation size={12} className="fill-white" /> Despachar Equipe
                    </button>
                  </div>
                )}

                {chamado.statusAtual === 'Visualizado' && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 justify-center">
                      <Eye size={12} /> Visualizado
                    </span>
                    <button 
                      onClick={() => handleDespacharEquipe(chamado.id)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Navigation size={12} className="fill-white" /> Despachar Equipe
                    </button>
                  </div>
                )}

                {chamado.statusAtual === 'Em Andamento' && (
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

                {chamado.statusAtual === 'Concluído' && (
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