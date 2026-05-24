"use client";
import { useEffect, useState } from "react";
import { Search, MapPin, CloudRain, Sun, Wind, Droplets } from "lucide-react";

// EMOJIS DO CLIMA
const CLIMA_EMOJIS: { [key: number]: string } = {
  1000: "☀️",
  1003: "⛅",
  1006: "☁️",
  1009: "☁️",
  1030: "🌫️",

  1063: "🌦️",
  1066: "❄️",
  1069: "🌨️",
  1072: "🌨️",
  1087: "⛈️",

  1114: "❄️",
  1117: "❄️",

  1135: "🌫️",
  1147: "🌫️",

  1150: "🌦️",
  1153: "🌦️",

  1168: "🌨️",
  1171: "🌨️",

  1180: "🌦️",
  1183: "🌧️",
  1186: "🌧️",
  1189: "🌧️",
  1192: "🌧️",
  1195: "🌧️",

  1198: "🌨️",
  1201: "🌨️",

  1204: "🌨️",
  1207: "🌨️",

  1210: "❄️",
  1213: "❄️",
  1216: "❄️",
  1219: "❄️",
  1222: "❄️",
  1225: "❄️",

  1237: "🧊",

  1240: "🌦️",
  1243: "🌧️",
  1246: "🌧️",

  1249: "🌨️",
  1252: "🌨️",

  1255: "❄️",
  1258: "❄️",

  1261: "🧊",
  1264: "🧊",

  1273: "⛈️",
  1276: "⛈️",
  1279: "⛈️",
  1282: "⛈️",
};

// FORMATAR DATAS
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
  const [busca, setBusca] = useState("");
  const [cidadeAtual, setCidadeAtual] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  // CIDADES
  const [campos, setCampos] = useState<any>(null);
  const [ubatuba, setUbatuba] = useState<any>(null);
  const [aparecida, setAparecida] = useState<any>(null);

  const API_KEY = "b73dd481d238464caf6232135262005";

  // BUSCAR CIDADE PRINCIPAL
  const BuscarCidade = async (nomeCidade: string) => {
    if (!nomeCidade) return;

    try {
      setErro(null);

      const resposta = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${nomeCidade}&days=7&aqi=no&alerts=no&lang=pt`,
      );

      if (!resposta.ok) throw new Error();

      const dados = await resposta.json();

      setCidadeAtual(dados);
    } catch {
      setErro("Cidade não encontrada. Tente novamente.");
    }
  };

  // BUSCAR OUTRAS CIDADES
  const BuscarOutrasCidades = async () => {
    try {
      const [ubatubaRes, aparecidaRes] = await Promise.all([
        fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Ubatuba&lang=pt`,
        ),
        fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Aparecida&lang=pt`,
        ),
      ]);

      const ubatubaData = await ubatubaRes.json();
      const aparecidaData = await aparecidaRes.json();

      setUbatuba(ubatubaData);
      setAparecida(aparecidaData);
    } catch (erro) {
      console.log(erro);
    }
  };

  // CARREGAR AUTOMATICAMENTE
  useEffect(() => {
    BuscarCidade("Taubaté");
    BuscarOutrasCidades();
  }, []);

  // LOADING
  if (!cidadeAtual) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-gray-600">...</p>
      </div>
    );
  }

  // DADOS PRINCIPAIS
  const { location, current, forecast } = cidadeAtual;
  const hoje = forecast.forecastday[0];

  return (
    <main className="h-screen bg-gray-100 pt-10 pb-20 flex flex-col items-center gap-6 px-4 overflow-y-auto">
      {/* BARRA PESQUISA */}
      <div className="w-full max-w-7xl bg-white rounded-3xl p-2 flex items-center shadow-sm border border-gray-200">
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

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      {/* GRID */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ESQUERDA */}
        <div className="flex flex-col gap-6">
          {/* CARD PRINCIPAL */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <div className="bg-[#cbdcfd] text-[#2262e2] border border-[#2262e2] rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 w-fit">
                <MapPin size={14} />
                {location.name}
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {formatarDiaSemana(hoje.date, "long")}
                </h1>

                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {formatarDataCompleta(hoje.date)}
                </p>

                <h2 className="text-5xl font-bold mt-4 text-gray-900 mb-6">
                  {Math.round(current.temp_c)}°C
                </h2>

                {/* MAX / MIN */}
                <div className="flex gap-3 text-xs font-semibold text-gray-400 mb-4">
                  <span>Máxima: {Math.round(hoje.day.maxtemp_c)}°</span>

                  <span>Mínima: {Math.round(hoje.day.mintemp_c)}°</span>
                </div>

                <p className="text-sm font-medium text-gray-500 px-3 py-1.5 bg-zinc-100 rounded-xl w-fit capitalize">
                  {current.condition.text}
                </p>
              </div>
            </div>

            {/* EMOJI */}
            <span className="text-9xl select-none pr-4">
              {CLIMA_EMOJIS[current.condition.code] || "☀️"}
            </span>
          </div>

          {/* PRÓXIMOS DIAS */}
          <div className="p-6 pb-7 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-sm font-bold text-gray-800 block mb-3">
              Próximos dias
            </span>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {forecast.forecastday.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-2 rounded-xl border border-gray-200 min-w-[75px] bg-gray-50 text-center"
                >
                  <span className="text-xs font-bold text-gray-600 capitalize">
                    {formatarDiaSemana(item.date, "short")}
                  </span>

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

        {/* DIREITA */}
        <div className="flex flex-col gap-6">
          {/* MAIS INFORMAÇÕES */}
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
                  {hoje.day.daily_chance_of_rain}%
                </span>
              </div>

              {/* SENSAÇÃO */}
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
                  {Math.round(current.wind_kph / 2)} km/h
                </span>
              </div>

              {/* UMIDADE */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-24">
                <div className="flex items-center gap-2 text-gray-400">
                  <Droplets size={16} />
                  <span className="text-xs">Umidade</span>
                </div>

                <span className="text-lg font-bold text-gray-800">
                  {Math.round(current.humidity)}%
                </span>
              </div>
            </div>
          </div>

          {/* OUTRAS CIDADES */}
          <div className="p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
            <span className="text-sm font-bold text-gray-700 block mb-3">
              Outras cidades próximas
            </span>

            <div className="flex flex-col gap-3">
              {/* UBATUBA */}
              {ubatuba && (
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-700 text-sm">Ubatuba</h4>

                    <span className="text-xs text-gray-400 capitalize">
                      {ubatuba.current.condition.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">
                      {Math.round(ubatuba.current.temp_c)}°
                    </span>

                    <span className="text-2xl">
                      {CLIMA_EMOJIS[ubatuba.current.condition.code] || "☀️"}
                    </span>
                  </div>
                </div>
              )}

              {/* APARECIDA */}
              {aparecida && (
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-700 text-sm">
                      Aparecida
                    </h4>

                    <span className="text-xs text-gray-400 capitalize">
                      {aparecida.current.condition.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">
                      {Math.round(aparecida.current.temp_c)}°
                    </span>

                    <span className="text-2xl">
                      {CLIMA_EMOJIS[aparecida.current.condition.code] || "☀️"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
