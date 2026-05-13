"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import bairros from "../public/map.json";
import { useState } from "react";
import {
  CircleCheckBig,
  Users,
  TriangleAlert,
  CircleAlert,
  CircleCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Imports dinâmicos para evitar erro de Window is not defined no Next.js
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

export default function PluviteVale() {
  const [localAberto, setLocalAberto] = useState<string | null>(null);

  return (
    <main className="h-screen w-full">
      <MapContainer
        key="mapa-vale"
        // AJUSTE: Centro aproximado do Vale do Paraíba e zoom mais distante (9)
        center={[-23.2, -45.2]}
        zoom={9}
        className="h-full w-full fixed mt-7"
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

        <GeoJSON
          data={bairros as any}
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
              "Município";

            /*etiqueta da cidade*/
            layer.bindTooltip(nome, {
              permanent: true,
              direction: "center",
              className:
                "bg-black/60 border-none shadow-none text-white font-bold p-1 rounded text-xs",
            });

            layer.on("click", () => {
              setLocalAberto(nome);
            });
          }}
        />
      </MapContainer>

      {localAberto && (
        <div className="fixed inset-0 left-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setLocalAberto(null)}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-[1rem] p-8 shadow-2xl flex flex-col gap-6 pb-10">
            <button
              onClick={() => setLocalAberto(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CircleCheckBig className="text-green-500" size={25} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {localAberto}
                </h2>

                <div className="flex items-center gap-4 mt-3">
                  <div className="px-3 py-1 rounded-md border border-zinc-300 text-zinc-600 font-bold text-sm tracking-wide bg-white">
                    Monitorado
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Users size={18} />
                    <p className="tracking-wide text-sm font-medium">
                      Dados Regionais
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-3 mt-4">
              <div className="bg-red-50 border border-red-300 rounded-xl p-6 flex justify-between items-center text-red-700">
                <div>
                  <TriangleAlert className="mb-1" size={20} />
                  <p className="text-sm">Críticos</p>
                </div>
                <div className="text-2xl font-bold">0</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-600 rounded-xl p-6 flex justify-between items-center text-yellow-600">
                <div>
                  <CircleAlert className="mb-1" size={20} />
                  <p className="text-sm">Médios</p>
                </div>
                <div className="text-2xl font-bold">1</div>
              </div>

              <div className="bg-green-100 border border-green-700 rounded-xl p-6 flex justify-between items-center text-green-700">
                <div>
                  <CircleCheck className="mb-1" size={20} />
                  <p className="text-sm">Baixos</p>
                </div>
                <div className="text-2xl font-bold">3</div>
              </div>
            </div>

            <div className="p-3 w-full mt-2 bg-green-100 border border-green-700 rounded-xl flex flex-col text-green-800">
              <div className="flex items-center gap-2">
                <CircleCheckBig size={22} />
                <h1 className="font-bold text-xl tracking-wide">
                  Situação tranquila
                </h1>
              </div>
              <p className="tracking-wide mt-2">
                Nenhum alerta crítico para {localAberto} no momento.
              </p>
            </div>

            <Link href={`/feed?local=${localAberto}`} className="w-full">
              <button className="bg-black w-full rounded-lg text-white flex items-center justify-center p-4 font-medium hover:bg-zinc-800 transition-all gap-2">
                Ver todas as postagens de {localAberto}
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
