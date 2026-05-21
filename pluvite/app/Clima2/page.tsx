"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, CloudRain, Sun, Wind, Droplets } from "lucide-react";

export default function ClimaPage() {
  const [busca, setBusca] = useState("");
  const [cidadeAtual, setCidadeAtual] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  const API_KEY = "b73dd481d238464caf6232135262005";

  const BuscarCidade = async (nomeCidade: string) => {
    if (!nomeCidade) return;
    try {
      setErro(null);
      const resposta = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${nomeCidade}&days=7&lang=pt`,
      );
      if (!resposta.ok) throw new Error();

      const dados = await resposta.json();
      setCidadeAtual(dados);
    } catch {
      setErro("Cidade não encontrada. Tente novamente.");
    }
  };

  useEffect(() => {
    BuscarCidade("Taubaté");
  }, []);

  if (!cidadeAtual) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-gray-600">Carregando dados...</p>
      </div>
    );
  }

  // Atalhos para os dados da API para diminuir o tamanho das linhas do HTML
  const { location, current, forecast } = cidadeAtual;
  const hoje = forecast.forecastday[0].day;

  return (
    <main className="min-h-screen bg-gray-100 pt-10 pb-20 flex flex-col items-center gap-6 px-4">
      {/* BARRA DE BUSCA */}
      <div className="w-full max-w-5xl bg-white rounded-3xl p-2 flex items-center shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Digite uma cidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && BuscarCidade(busca)}
          className="flex-1 ml-6 text-sm outline-none text-gray-700"
        />
        <button
          onClick={() => BuscarCidade(busca)}
          className="bg-[#2a68e2] rounded-full text-white p-2.5 hover:scale-105 transition-all"
        >
          <Search size={20} />
        </button>
      </div>

      {erro && <p className="text-red-500 text-sm font-medium -mt-2">{erro}</p>}

      {/* GRID PRINCIPAL */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BLOCO DA ESQUERDA: TEMPO ATUAL E PREVISÃO */}
        <div className="flex flex-col gap-6">
          {/* CARD ATUAL */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <div className="bg-[#cbdcfd] text-[#2262e2] border border-[#2262e2] rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 w-fit">
                <MapPin size={14} />
                {location.name}
              </div>
              <div className="mt-4">
                {/* Dia da semana grande e data/mês/ano em baixo */}
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {new Date(
                    forecast.forecastday[0].date + "T00:00:00",
                  ).toLocaleDateString("pt-BR", { weekday: "long" })}
                </h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {new Date(
                    forecast.forecastday[0].date + "T00:00:00",
                  ).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Temperatura Atual */}
                <h2 className="text-5xl font-bold mt-4 text-gray-900 mb-6">
                  {Math.round(current.temp_c)}°C
                </h2>

                {/* Máxima e Mínima em baixo do grau */}
                <div className="flex gap-2 text-xs font-semibold mt-1 text-zinc-400">
                  <span className="">
                    Máxima: {Math.round(hoje.maxtemp_c)}°
                  </span>
                  <span className="">
                    Mínima: {Math.round(hoje.mintemp_c)}°
                  </span>
                </div>

                {/* Texto do clima (ex: Ensolarado) */}
                <p className="text-sm font-medium text-gray-500 mt-3 capitalize bg-zinc-100 p-2 rounded-2xl w-fit">
                  {current.condition.text}
                </p>
              </div>
            </div>

            {/* Ícone do Clima */}
            <img
              src={`https:${current.condition.icon}`}
              alt="Clima"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* PREVISÃO DA SEMANA AUTOMÁTICA */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-sm font-bold text-gray-800 block mb-3">
              Próximos dias
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {forecast.forecastday.map((item: any, idx: number) => {
                const diaSemana = new Date(
                  item.date + "T00:00:00",
                ).toLocaleDateString("pt-BR", { weekday: "short" });
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-2 rounded-xl border border-gray-200 min-w-[75px] bg-gray-50 text-center"
                  >
                    <span className="text-xs font-bold text-gray-600 capitalize">
                      {diaSemana.replace(".", "")}
                    </span>
                    <img
                      src={`https:${item.day.condition.icon}`}
                      alt="ícone"
                      className="w-8 h-8 my-1"
                    />
                    <span className="text-xs font-bold text-gray-800">
                      {Math.round(item.day.maxtemp_c)}°
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.round(item.day.mintemp_c)}°
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BLOCO DA DIREITA: MAIS INFORMAÇÕES */}
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-sm font-bold text-gray-800 block mb-4">
              Mais informações
            </span>

            <div className="grid grid-cols-2 gap-4">
              {/* CHUVA */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <CloudRain size={16} />
                  <span className="text-xs">Chuva</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {hoje.daily_chance_of_rain}%
                </span>
              </div>
              {/* SENSACÃO */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <Sun size={16} />
                  <span className="text-xs">Sensação</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {Math.round(current.feelslike_c)}°C
                </span>
              </div>
              {/* VENTO */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <Wind size={16} />
                  <span className="text-xs">Vento</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {current.wind_kph} km/h
                </span>
              </div>
              {/* UMIDADE */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <Droplets size={16} />
                  <span className="text-xs">Umidade</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {current.humidity}%
                </span>
              </div>
            </div>
          </div>
          {/*OUTRAS CIDADES*/}

          <div className="p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-gray-700 block mb-3">
                Outras cidades próximas
              </span>

              {/*TREMEMBÉ*/}

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-700">Tremembé</h4>

                    <span className="text-[10px] text-gray-400">
                      Ensolarado
                    </span>
                  </div>

                  <span className="font-bold text-gray-800 text-2xl">☀️</span>
                </div>
              </div>

              {/*TREMEMBÉ*/}

              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-700">
                      São José dos Campos
                    </h4>

                    <span className="text-[10px] text-gray-400">Chuvoso</span>
                  </div>

                  <span className="font-bold text-gray-800 text-2xl">🌧️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
