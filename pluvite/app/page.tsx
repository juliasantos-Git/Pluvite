"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import bairros from "../public/bairros.json";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const GeoJSON = dynamic(() => import("react-leaflet").then((m) => m.GeoJSON), {
  ssr: false,
});

export default function PluviteTaubate() {
  return (
    <main className="h-screen w-full">
      <MapContainer
        center={[-23.02, -45.55]}
        zoom={13}
        className="h-full w-full fixed mt-7"
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        {/*"https://www.openstreetmap.org/copyright"*/}
        <GeoJSON
          data={bairros as any}
          style={() => ({
            color: "white",
            weight: 1.5,
            fillOpacity: 0.3,
            fillColor: "#16a34a",
          })}
          // ISSO AQUI TIRA O ÍCONE DE ERRO "MARK"
          pointToLayer={() => {
            const L = require("leaflet");
            return L.circleMarker([0, 0], {
              radius: 0,
              opacity: 0,
              fillOpacity: 0,
            });
          }}
          onEachFeature={(feature, layer) => {
            const nome = feature.properties.name || "";

            // ISSO AQUI DEIXA O NOME ESCRITO DIRETO NO MAPA
            layer
              .bindTooltip(nome, {
                permanent: true, // fixar
                direction: "center", // Fica no meio do bairro
                className:
                  "bg-transparent border-none shadow-none text-white font-bold",
              })
              .openTooltip();

            layer.bindPopup(`<b>Bairro:</b> ${nome}`);
          }}
        />
      </MapContainer>
    </main>
  );
}