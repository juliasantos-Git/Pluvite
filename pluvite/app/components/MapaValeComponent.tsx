"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapaProps {
  bairrosDados: any;
  setLocalAberto: (nome: string) => void;
}

export default function MapaValeComponent({ bairrosDados, setLocalAberto }: MapaProps) {
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
        style={() => ({
          color: "white",
          weight: 1,
          fillOpacity: 0.3,
          fillColor: "#16a34a",
        })}
        onEachFeature={(feature, layer) => {
          const nome =
            feature.properties.NM_MUN ||
            feature.properties.name ||
            feature.properties.NM_MUNICIPIO ||
            "Município";

          /* etiqueta da cidade */
          layer.bindTooltip(nome, {
            permanent: true,
            direction: "center",
            className:
              "bg-black/60 border-none shadow-none text-white font-bold p-1 rounded text-xs select-none",
          });

          layer.on("click", () => {
            setLocalAberto(nome);
          });
        }}
      />
    </MapContainer>
  );
}