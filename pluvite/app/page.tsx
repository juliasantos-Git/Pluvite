"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import bairrosData from "../public/bairros.json";

const Map = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, GeoJSON } = mod;
      return {
        default: (props: any) => (
          <MapContainer {...props}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <GeoJSON {...props.geoProps} />
          </MapContainer>
        ),
      };
    }),
  { ssr: false },
);

export default function PluviteTaubate() {
  const [bairro, setBairro] = useState("Selecione um bairro");

  const obterCor = (nome: string) => {
    if (nome.includes("Cecap") || nome.includes("Marias")) return "#dc2626"; // Vermelho
    if (nome.includes("Independência") || nome.includes("Quiririm"))
      return "#facc15"; // Amarelo
    return "#16a34a"; // Verde
  };

  return (
    <main className="h-screen w-full bg-slate-900">
      <Map
        center={[-23.0267, -45.5558]}
        zoom={13}
        className="h-full w-full z-0 mt-7 fixed"
        geoProps={{
          data: bairrosData as any,
          style: (f: any) => ({
            fillColor: obterCor(f.properties.name || ""),
            weight: 1.5,
            color: "white",
            fillOpacity: 0.4,
          }),
          onEachFeature: (f: any, l: any) => {
            const n = f.properties.name || "Bairro";
            l.on("click", () => setBairro(n));
            l.bindPopup(
              `<b style="color:#1e3a8a">${n}</b><br>Status: Monitorado`,
            );
          },
        }}
      />
    </main>
  );
}
