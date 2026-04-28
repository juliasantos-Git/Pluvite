"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import bairros from "../public/bairros.json";
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
  const [bairroAberto, setBairroAberto] = useState(null);
  return (
    <main className="h-screen w-full">
      <MapContainer
        key="mapa-principal"
        center={[-23.02, -45.55]}
        zoom={13}
        className="h-full w-full fixed mt-7"
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

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
            layer.bindTooltip(nome, {
              permanent: true, // fixar
              direction: "center", // Fica no meio do bairro
              className:
                "bg-transparent border-none shadow-none text-white font-bold",
            });

            layer.on("click", () => {
              setBairroAberto(nome);
            });
          }}
        />
      </MapContainer>
      {bairroAberto && (
        <div className="fixed inset-0 left-0 z-[9999] flex items-center justify-center p-4">
          {/* OVERLAY*/}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setBairroAberto(null)}
          />
          {/*CARD*/}
          <div className="relative bg-white w-full max-w-2xl rounded-[1rem] p-8 shadow-2xl flex flex-col gap-6 pb-10">
            {/* BOTÃO FECHAR (X)*/}
            <button
              onClick={() => setBairroAberto(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-800 cursor-pointer"
            >
              ✕
            </button>
            {/*TOPO*/}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CircleCheckBig className="text-green-500" size={25} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {bairroAberto}
                </h2>

                <div className="flex items-center gap-4 mt-3">
                  <div className="px-3 py-1 rounded-md border border-zinc-300 text-zinc-600 font-bold text-sm tracking-wide bg-white">
                    Seguro
                  </div>

                  {/* Info Habitantes */}
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Users size={18} />
                    <p className="tracking-wide text-sm font-medium">
                      900 habitantes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/*NIVEL */}
            <div className="grid grid-cols-3 w-full gap-3 flex items-start mt-4">
              {/*CRITICO*/}
              <div className="bg-red-50 border border-red-300 rounded-xl p-7 h-25 w-full grid grid-cols-2 text-red-700">
                <div>
                  <TriangleAlert className="mb-3" size={20} />
                  <p className="">Críticos</p>
                </div>
                <div className="text-2xl ml-4 font-bold">0</div>
              </div>
              {/*MEDIO*/}
              <div className="bg-yellow-50 border border-yellow-600 rounded-xl p-7 h-25 grid grid-cols-2 text-yellow-600">
                <div>
                  <CircleAlert className="mb-3" size={20} />
                  <p className="">Médios</p>
                </div>
                <div className="text-2xl ml-4 font-bold">1</div>
              </div>
              {/*BAIXO*/}
              <div className="bg-green-100 border border-green-700 rounded-xl p-7 h-25 grid grid-cols-2 text-green-700">
                <div>
                  <CircleCheck className="mb-3" size={20} />
                  <p className="">Baixos</p>
                </div>
                <div className="text-2xl ml-4 font-bold">3</div>
              </div>
            </div>
            {/*SITUAÇÃO*/}
            <div className="p-3 w-full mt-2 bg-green-100 border border-green-700 rounded-xl flex flex-col text-green-800">
              <div className="flex items-center gap-2">
                <CircleCheckBig size={22} />
                <h1 className="font-bold text-xl tracking-wide">
                  Situação tranquila
                </h1>
              </div>
              <p className="tracking-wide mt-2">
                Nenhuma área crítica identificada neste bairro no momento.
              </p>
            </div>
            {/*BOTÃO IR PARA O FEED*/}
            <div className="bg-black w-full rounded flex flex-col items-center p-2 mt-3 hover:bg-zinc-800 cursor-pointer mb-2">
              <Link href="/feed" className="hover:underline">
                <button className="text-white flex items-center font-medium shrink-0 hover:scale-105 transition-all duration-150 hover:cursor-pointer">
                  Ver todas as postagens desse bairro
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
