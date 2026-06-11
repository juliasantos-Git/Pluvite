"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MapaProps {
  bairrosDados: any;
  setLocalAberto: (nome: string) => void;
  cidadeSelecionada: string;
}

export default function MapaValeComponent({
  bairrosDados,
  setLocalAberto,
  cidadeSelecionada,
}: MapaProps) {

//Primeiro eu criei uma variavel climaPorCidade ela vai armazernar o clima das cidade depois o
// setClima ele atualiza os dados que vieram da API e o useState começa zerado sem nenhuma cidade. 
// Quando o componente carrega, o useEffect executa o fetch que busca os dados da API. O effect ele ta carregando 
// o próprio componente mapavalevomponent ou seja, quando o mapa aparecer na tela, ele já dispara o fetch pra buscar o clima.
  const [climaPorCidade, setClimaPorCidade] = useState<{[key: string]: any}>({})
  useEffect(() => {
    const cidades = ["Aparecida", "Areias", "Bananal", "Cacapava", "Cachoeira+Paulista", "Campos+do+Jordao", "Canas", "Caraguatatuba", "Cruzeiro", "Cunha", "Guararema", "Guaratingueta", "Igarata", "Ilhabela", "Jacarei", "Jambeiro", "Lagoinha", "Lavrinhas", "Lorena", "Monteiro+Lobato", "Natividade+da+Serra", "Paraibuna", "Pindamonhangaba", "Piquete", "Potim", "Queluz", "Roseira", "Santa+Branca", "Santo+Antonio+do+Pinhal", "Sao+Bento+Sapucai", "Sao+Jose+do+Barreiro", "Sao+Jose+dos+Campos", "Sao Luiz do Paraitinga", "Silveiras", "Taubate", "Tremembe", "Ubatuba"]
    const intervalo = setInterval(() => {
  cidades.map(cidade => 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade},BR&appid=aea3caae2787bef2039681102761e6d1&units=metric&lang=pt_br`)
      .then(res => res.json())
      .then(data => {
        const nomeSemPlus = cidade.replace(/\+/g, " ")
        setClimaPorCidade(anterior => ({
          ...anterior,
          [nomeSemPlus]: data
        }))
      })
  )
}, 3600000)

return () => clearInterval(intervalo)
  }, [])

  const dadosFiltrados = {
    ...bairrosDados,
    features: bairrosDados.features.filter((feature: any) => {
      if (!cidadeSelecionada) return true;
      const nome =
        feature.properties.NM_MUN ||
        feature.properties.name ||
        feature.properties.NM_MUNICIPIO;
      return nome === cidadeSelecionada;
    }),
  };

  function obterCor(chuva: number) {
    if (chuva < 1) return "green"
    if (chuva >= 1 && chuva < 3) return "orange"
    if (chuva >= 3 && chuva < 6) return "red"
    if (chuva > 6) return "purple"
    return "green"
  }

  return (
    <MapContainer
      key="mapa-vale"
      center={[-23.2, -45.2]}
      zoom={9}
      className="h-full w-full fixed mt-7"
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

      <GeoJSON
        data={dadosFiltrados as any}
        style={(feature) => {
          const nome =
            feature?.properties?.NM_MUN ||
            feature?.properties?.name ||
            feature?.properties?.NM_MUNICIPIO;

          const selecionada = cidadeSelecionada && nome === cidadeSelecionada;
          const chuva = climaPorCidade[nome]?.list?.[0]?.rain?.["3h"] ?? 0

          return {
            color: selecionada ? "#ef4444" : "white",
            weight: selecionada ? 3 : 1,
            fillOpacity: selecionada ? 0.6 : 0.3,
            fillColor: selecionada ? "#ef4444" : obterCor(chuva),
          };
        }}
        onEachFeature={(feature, layer) => {
          const nome =
            feature.properties.NM_MUN ||
            feature.properties.name ||
            feature.properties.NM_MUNICIPIO ||
            "Município";

          layer.on("click", () => {
            setLocalAberto(nome);
          });
        }}
      />
    </MapContainer>
  );
}