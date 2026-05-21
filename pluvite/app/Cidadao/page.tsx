"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { Layers, AlertTriangle, Wrench, CheckCircle } from 'lucide-react';

// --- MOCK DE DADOS ---

// Dados corrigidos com os Municípios do Vale do Paraíba e Litoral Norte
const dadosMunicipios = [
  { name: 'Taubaté', total: 12, color: '#ef4444' },
  { name: 'São José dos Campos', total: 15, color: '#f59e0b' },
  { name: 'Jacareí', total: 7, color: '#10b981' },
  { name: 'Pindamonhangaba', total: 2, color: '#3b82f6' },
  { name: 'Caraguatatuba', total: 10, color: '#8b5cf6' },
  { name: 'Ubatuba', total: 3, color: '#06b6d4' },
];

const dadosStatus = [
  { name: 'Visualizado', value: 15, color: '#3b82f6' },
  { name: 'Aguardando', value: 21, color: '#9ca3af' },
  { name: 'Concluído', value: 38, color: '#10b981' },
  { name: 'Em Andamento', value: 27, color: '#f59e0b' },
];

export default function PainelAdministrativo() {
  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      
      {/* Título do Painel */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Painel Administrativo</h1>
        <p className="text-slate-500 mt-1">Gerencie ocorrências e despache equipes em tempo real</p>
      </div>

      {/* --- QUADROS DE MÉTRICAS (CARDS) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Chamados Ativos */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-44">
          <div className="flex justify-between items-start">
            <Layers className="w-8 h-8 opacity-90" />
            <span className="text-xs font-semibold tracking-wider opacity-60">↗</span>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-1">6</h2>
            <p className="text-sm font-medium opacity-90">Chamados Ativos</p>
          </div>
        </div>

        {/* Card 2: Ocorrências Críticas */}
        <div className="bg-red-600 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-44">
          <div className="flex justify-between items-start">
            <AlertTriangle className="w-8 h-8 opacity-90" />
            <span className="text-xs font-semibold tracking-wider opacity-60">↗</span>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-1">3</h2>
            <p className="text-sm font-medium opacity-90">Ocorrências Críticas</p>
          </div>
        </div>

        {/* Card 3: Em Andamento */}
        <div className="bg-amber-500 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-44">
          <div className="flex justify-between items-start">
            <Wrench className="w-8 h-8 opacity-90" />
            <span className="text-xs font-semibold tracking-wider opacity-60">↗</span>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-1">2</h2>
            <p className="text-sm font-medium opacity-90">Em Andamento</p>
          </div>
        </div>

        {/* Card 4: Concluídos Hoje */}
        <div className="bg-emerald-500 rounded-2xl p-6 text-white relative shadow-sm overflow-hidden flex flex-col justify-between h-44">
          <div className="flex justify-between items-start">
            <CheckCircle className="w-8 h-8 opacity-90" />
            <span className="text-xs font-semibold tracking-wider opacity-60">↗</span>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-1">0</h2>
            <p className="text-sm font-medium opacity-90">Concluídos Hoje</p>
          </div>
        </div>

      </div>

      {/* --- SEÇÃO DE GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Gráfico de Barras: Ocorrências por Município */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-blue-600 font-bold">📊</span>
            <h3 className="font-bold text-slate-800 text-lg">Ocorrências por Município</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMunicipios} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis 
                  domain={[0, 16]} 
                  ticks={[0, 4, 8, 12, 16]}
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {dadosMunicipios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza: Status dos Chamados */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-purple-600 font-bold">👥</span>
            <h3 className="font-bold text-slate-800 text-lg">Status dos Chamados</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center h-full gap-4">
            <div className="space-y-4 text-sm hidden sm:block">
              <div>
                <p className="text-blue-500 font-medium">Visualizado: 15%</p>
              </div>
              <div>
                <p className="text-amber-500 font-medium">Em Andamento: 27%</p>
              </div>
            </div>

            <div className="h-56 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {dadosStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 text-sm hidden sm:block text-right">
              <div>
                <p className="text-slate-400 font-medium">Aguardando: 21%</p>
              </div>
              <div>
                <p className="text-emerald-500 font-medium">Concluído: 38%</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 text-xs sm:hidden justify-center col-span-1">
              <span className="text-blue-500 font-medium">Visualizado (15%)</span>
              <span className="text-amber-500 font-medium">Em Andamento (27%)</span>
              <span className="text-slate-400 font-medium">Aguardando (21%)</span>
              <span className="text-emerald-500 font-medium">Concluído (38%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- BARRA DE FILTROS INFERIOR --- */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
        <div className="flex-1 max-w-xs relative">
          <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
            <option>Todos os Municípios</option>
          </select>
          <span className="absolute right-4 top-3.5 text-xs text-slate-400 pointer-events-none">▼</span>
        </div>
        
        <div className="flex-1 max-w-xs relative">
          <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
            <option>Todas as Prioridades</option>
          </select>
          <span className="absolute right-4 top-3.5 text-xs text-slate-400 pointer-events-none">▼</span>
        </div>
      </div>

    </div>
  );
}