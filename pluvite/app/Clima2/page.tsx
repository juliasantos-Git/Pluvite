"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, CloudRain, Sun, Wind, Droplets } from "lucide-react";

// 1. DICIONÁRIO DE EMOJIS PARA CADA CÓDIGO DE CLIMA
const CLIMA_EMOJIS: { [key: number]: string } = {
  1000: "☀️", // Céu limpo
  1003: "⛅", // Parcialmente nublado
  1006: "☁️", // Nublado
  1009: "☁️", // Encoberto
  1030: "🌫️", // Névoa
  1063: "🌦️", // Chuvisco
  1087: "⛈️", // Trovoadas
  1183: "🌧️", // Chuva leve
  1189: "🌧️", // Chuva moderada
  1195: "🌧️", // Chuva forte
  1213: "❄️", // Neve
};

// 2. PARA FORMATAR AS DATAS
const formatarDiaSemana = (
  dataTexto: string,
  formato: "long" | "short" = "long",
) => {
  return new Date(dataTexto + "T00:00:00")
    .toLocaleDateString("pt-BR", { weekday: formato })
    .replace(".", "");
};

const formatarDataCompleta = (dataTexto: string) => {
  return new Date(dataTexto + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ClimaPage() {
  //VARIAVEIS DE ESTADO
  const [busca, setBusca] = useState("");
  const [cidadeAtual, setCidadeAtual] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  const API_KEY = "b73dd481d238464caf6232135262005";

  //BUSCAR CIDADE NA API
  const BuscarCidade = async (nomeCidade: string) => {
    if (!nomeCidade) return;
    try {
      //LIMPA O ERRO ANTERIOR, SE HOUVER
      setErro(null);
      const resposta = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${nomeCidade}&days=7&lang=pt`,
      );
      //SE A RESPOSTA NÃO FOR OK, LANÇA UM ERRO PARA SER CAPTURADO PELO CATCH
      if (!resposta.ok) throw new Error();

      const dados = await resposta.json();
      setCidadeAtual(dados);
    } catch {
      setErro("Cidade não encontrada. Tente novamente.");
    }
  };

  //BUSCA AUTOMÁTICA AO CARREGAR A PÁGINA
  useEffect(() => {
    BuscarCidade("Taubaté");
  }, []);

  //APARECE ... ENQUANTO A CIDADE (PÁGINA) ESTÁ SENDO CARREGADA
  if (!cidadeAtual) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-gray-600">...</p>
      </div>
    );
  }

  // EXTRAINDO INFORMAÇÕES PRINCIPAIS DA CIDADE ATUAL
  const { location, current, forecast } = cidadeAtual;
  const hoje = forecast.forecastday[0];

  return (
    <main className="h-screen bg-gray-100 pt-10 pb-20 flex flex-col items-center gap-6 px-4 overflow-y-auto">
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
          className="bg-[#2a68e2] rounded-full text-white p-2.5 hover:scale-105 transition-all cursor-pointer"
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
                {/*DIA DA SEMANA E DATA FORMATADAS DE FORMA SIMPLES*/}
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {formatarDiaSemana(hoje.date, "long")}
                </h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {formatarDataCompleta(hoje.date)}
                </p>

                <h2 className="text-5xl font-bold mt-4 text-gray-900 mb-6">
                  {Math.round(current.temp_c)}°C
                </h2>

                {/* MAXIMA E MÍNIMA */}
                <div className="flex gap-3 text-xs font-semibold text-gray-400 mb-4">
                  <span>Máxima: {Math.round(hoje.day.maxtemp_c)}°</span>
                  <span>Mínima: {Math.round(hoje.day.mintemp_c)}°</span>
                </div>

                <p className="text-sm font-medium text-gray-500 px-3 py-1.5 bg-zinc-100 rounded-xl w-fit capitalize">
                  {current.condition.text}
                </p>
              </div>
            </div>

            {/* ÍCONE DO CLIMA */}
            <span className="text-9xl select-none pr-4">
              {CLIMA_EMOJIS[current.condition.code] || "☀️"}
            </span>
          </div>

          {/* PREVISÃO DA SEMANA */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm font-bold text-gray-800 block mb-3">
              Próximos dias
            </span>
            <div className="bg-zinc-200 w-full rounded mb-4 h-10"></div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {forecast.forecastday.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 rounded-xl border border-gray-200 min-w-[75px] bg-gray-50 text-center"
                >
                  <span className="text-xs font-bold text-gray-600 capitalize">
                    {formatarDiaSemana(item.date, "short")}
                  </span>

                  {/* EMOJI DO CLIMA DA SEMANA*/}
                  <span className="text-2xl my-1.5 select-none">
                    {CLIMA_EMOJIS[item.day.condition.code] || "☀️"}
                  </span>

                  <span className="text-xs font-bold text-gray-800">
                    {Math.round(item.day.maxtemp_c)}°
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.round(item.day.mintemp_c)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCO DA DIREIRA: MAIS INFORMAÇÕES */}
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-sm font-bold text-gray-800 block mb-4">
              Mais informações
            </span>
            {/*CHUVA*/}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <CloudRain size={16} />
                  <span className="text-xs">Chuva</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {hoje.day.daily_chance_of_rain}%
                </span>
              </div>
              {/**SENSAÇÃO TÉRMICA*/}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <Sun size={16} />
                  <span className="text-xs">Sensação</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {Math.round(current.feelslike_c)}°C
                </span>
              </div>
              {/**VENTO*/}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <Wind size={16} />
                  <span className="text-xs">Vento</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {current.wind_kph} km/h
                </span>
              </div>
              {/**UMIDADE*/}
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

          {/* OUTRAS CIDADES */}
          <div className="p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-gray-700 block mb-3">
                Outras cidades próximas
              </span>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-700">Tremembé</h4>
                    <span className="text-[10px] text-gray-400">
                      Ensolarado
                    </span>
                  </div>
                  <span className="text-2xl select-none">☀️</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-700">
                      São José dos Campos
                    </h4>
                    <span className="text-[10px] text-gray-400">Chuvoso</span>
                  </div>
                  <span className="text-2xl select-none">🌧️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
