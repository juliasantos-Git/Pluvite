"use client"
import { useState } from "react"

export default function ClimaPage() {
  const cidades = [
    { nome: "Tremembé", temp: 24, cond: "Ensolarado", vento: "12 km/h", umidade: "25%", chuva: "17%" },
    { nome: "São José dos Campos", temp: 22, cond: "Nublado", vento: "15 km/h", umidade: "40%", chuva: "30%" },
    { nome: "Taubaté", temp: 23, cond: "Ensolarado", vento: "10 km/h", umidade: "35%", chuva: "20%" },
    { nome: "Jacareí", temp: 21, cond: "Chuvoso", vento: "18 km/h", umidade: "60%", chuva: "55%" },
    { nome: "Pindamonhangaba", temp: 22, cond: "Ensolarado", vento: "8 km/h", umidade: "30%", chuva: "10%" },
    { nome: "Guaratinguetá", temp: 20, cond: "Nublado", vento: "12 km/h", umidade: "45%", chuva: "25%" },
    { nome: "Lorena", temp: 21, cond: "Ensolarado", vento: "9 km/h", umidade: "32%", chuva: "15%" },
    { nome: "Caçapava", temp: 23, cond: "Ensolarado", vento: "11 km/h", umidade: "28%", chuva: "12%" },
    { nome: "Aparecida", temp: 22, cond: "Nublado", vento: "14 km/h", umidade: "50%", chuva: "35%" },
    { nome: "Cruzeiro", temp: 19, cond: "Chuvoso", vento: "20 km/h", umidade: "70%", chuva: "60%" },
    { nome: "Cachoeira Paulista", temp: 21, cond: "Ensolarado", vento: "10 km/h", umidade: "33%", chuva: "18%" },
    { nome: "Roseira", temp: 22, cond: "Ensolarado", vento: "9 km/h", umidade: "30%", chuva: "14%" },
    { nome: "Potim", temp: 21, cond: "Nublado", vento: "11 km/h", umidade: "42%", chuva: "22%" },
    { nome: "Redenção da Serra", temp: 18, cond: "Chuvoso", vento: "16 km/h", umidade: "75%", chuva: "65%" },
    { nome: "São Luís do Paraitinga", temp: 19, cond: "Nublado", vento: "13 km/h", umidade: "55%", chuva: "40%" },
    { nome: "Natividade da Serra", temp: 18, cond: "Chuvoso", vento: "17 km/h", umidade: "72%", chuva: "58%" },
    { nome: "Paraibuna", temp: 20, cond: "Nublado", vento: "12 km/h", umidade: "48%", chuva: "28%" },
    { nome: "Santa Branca", temp: 21, cond: "Ensolarado", vento: "10 km/h", umidade: "35%", chuva: "16%" },
    { nome: "Igaratá", temp: 20, cond: "Nublado", vento: "13 km/h", umidade: "50%", chuva: "32%" },
    { nome: "Jambeiro", temp: 21, cond: "Ensolarado", vento: "9 km/h", umidade: "31%", chuva: "13%" },
    { nome: "Monteiro Lobato", temp: 19, cond: "Chuvoso", vento: "15 km/h", umidade: "68%", chuva: "52%" },
    { nome: "Lagoinha", temp: 19, cond: "Nublado", vento: "14 km/h", umidade: "58%", chuva: "38%" },
  ]

  const [busca, setBusca] = useState("")
  const [cidadeAtual, setCidadeAtual] = useState(cidades[0])

  const buscarCidade = () => {
    const encontrada = cidades.find(
      (c) => c.nome.toLowerCase() === busca.toLowerCase()
    )
    if (encontrada) setCidadeAtual(encontrada)
  }

  return (
    <main className="min-h-screen bg-blue-950 flex items-start justify-center pt-24 pb-10 overflow-y-auto">
      <div className="bg-blue-600 rounded-3xl p-6 w-80 text-white text-center">

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Digite uma cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarCidade()}
            className="flex-1 bg-blue-700 rounded-xl px-3 py-2 text-sm text-white placeholder-blue-300 outline-none"
          />
          <button
            onClick={buscarCidade}
            className="bg-blue-500 rounded-xl px-3 py-2 text-sm"
          >
            🔍
          </button>
        </div>

        <h1 className="text-2xl font-bold">{cidadeAtual.nome}</h1>
        <p className="text-6xl my-1">⛅</p>
        <p className="text-5xl font-bold my-2">{cidadeAtual.temp}°</p>
        <p className="text-lg">{cidadeAtual.cond}</p>

        <div className="flex justify-around mt-4">
          <div className="text-center">
            <p className="text-xl">💨</p>
            <p className="text-sm font-bold">{cidadeAtual.vento}</p>
            <p className="text-xs text-blue-200">Vento</p>
          </div>
          <div className="text-center">
            <p className="text-xl">💧</p>
            <p className="text-sm font-bold">{cidadeAtual.umidade}</p>
            <p className="text-xs text-blue-200">Umidade</p>
          </div>
          <div className="text-center">
            <p className="text-xl">🌧️</p>
            <p className="text-sm font-bold">{cidadeAtual.chuva}</p>
            <p className="text-xs text-blue-200">Chuva</p>
          </div>
        </div>

        <div className="mt-4 text-left">
          <p className="text-sm font-bold mb-2">Hoje</p>
          <div className="flex gap-3 overflow-x-auto">
            <div className="bg-blue-500 rounded-2xl p-3 text-center min-w-14">
              <p className="text-xs text-blue-200">09h</p>
              <p className="text-xl my-1">⛅</p>
              <p className="text-sm font-bold">23°</p>
            </div>
            <div className="bg-blue-700 rounded-2xl p-3 text-center min-w-14">
              <p className="text-xs text-blue-200">10h</p>
              <p className="text-xl my-1">🌧️</p>
              <p className="text-sm font-bold">18°</p>
            </div>
            <div className="bg-blue-500 rounded-2xl p-3 text-center min-w-14">
              <p className="text-xs text-blue-200">11h</p>
              <p className="text-xl my-1">⛅</p>
              <p className="text-sm font-bold">20°</p>
            </div>
            <div className="bg-blue-500 rounded-2xl p-3 text-center min-w-14">
              <p className="text-xs text-blue-200">12h</p>
              <p className="text-xl my-1">☀️</p>
              <p className="text-sm font-bold">22°</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-left">
          <p className="text-sm font-bold mb-2">Qualidade do Ar</p>
          <div className="bg-blue-700 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-blue-500 rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg">
              135
            </div>
            <div>
              <p className="text-sm font-bold">O3 (nZone)</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}