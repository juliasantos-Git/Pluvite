"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapaProps {
  bairrosDados: any;
  setLocalAberto: (nome: string) => void;
  cidadeSelecionada: string;
  climaPorCidade: { [key: string]: any };
  setClimaPorCidade: (fn: (anterior: any) => any) => void;
}

export default function MapaValeComponent({
  bairrosDados,
  setLocalAberto,
  cidadeSelecionada,
  climaPorCidade,
  setClimaPorCidade,
}: MapaProps) {
  const cidades = [
    "Aparecida", "Arapeí", "Areias", "Bananal", "Caçapava", "Cachoeira Paulista",
    "Campos do Jordão", "Canas", "Caraguatatuba", "Cruzeiro", "Cunha",
    "Guararema", "Guaratinguetá", "Igaratá", "Ilhabela", "Jacareí",
    "Jambeiro", "Lagoinha", "Lavrinhas", "Lorena", "Monteiro Lobato",
    "Natividade da Serra", "Paraibuna", "Pindamonhangaba", "Piquete",
    "Potim", "Queluz", "Redenção da Serra", "Roseira", "Santa Branca",
    "Santo Antônio do Pinhal", "São Bento do Sapucaí", "São José do Barreiro",
    "São José dos Campos", "São Luiz do Paraitinga", "São Sebastião",
    "Silveiras", "Taubaté", "Tremembé", "Ubatuba",
  ];

  useEffect(() => {
    Promise.all(
      cidades.map(cidade =>
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cidade)},BR&appid=aea3caae2787bef2039681102761e6d1&units=metric&lang=pt_br`)
          .then(res => res.json())
          .then(data => {
            if (data.cod !== "200") return;
            setClimaPorCidade(anterior => ({
              ...anterior,
              [cidade]: data,
            }));
          })
      )
    );
  }, []);

  function obterCor(chuva: number) {
    if (chuva < 1) return "green";
    if (chuva >= 1 && chuva < 3) return "orange";
    if (chuva >= 3 && chuva < 6) return "red";
    if (chuva > 6) return "purple";
    return "green";
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
        data={bairrosDados as any}
        style={(feature) => {
          const nomeGeoJSON =
            feature?.properties?.NM_MUN ||
            feature?.properties?.name ||
            feature?.properties?.NM_MUNICIPIO;

          const selecionada = cidadeSelecionada && nomeGeoJSON === cidadeSelecionada;

          const lista = climaPorCidade[nomeGeoJSON]?.list?.slice(0, 8) ?? [];
          const chuva = lista.length > 0
            ? Math.max(...lista.map((item: any) => item?.rain?.["3h"] ?? 0))
            : 0;

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