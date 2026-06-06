"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

          return {
            color: selecionada ? "#ef4444" : "white",
            weight: selecionada ? 3 : 1,
            fillOpacity: selecionada ? 0.6 : 0.3,
            fillColor: selecionada ? "#ef4444" : "#16a34a",
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
