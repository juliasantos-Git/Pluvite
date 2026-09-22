"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type Coordenada = [number, number];

interface MapaRotasProps {
  limites: [Coordenada, Coordenada];
  rota: Coordenada[] | null;
  origem: Coordenada | null;
  destino: Coordenada | null;
  onCliqueMapa: (lat: number, lng: number) => void;
}

// Reenquadra o mapa quando a cidade ou a rota mudam
function Enquadramento({
  limites,
  rota,
}: {
  limites: [Coordenada, Coordenada];
  rota: Coordenada[] | null;
}) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(limites, { padding: [20, 20] });
  }, [map, limites]);

  useEffect(() => {
    // Deixa espaço para o painel flutuante: à esquerda no desktop, em cima no celular
    if (rota && rota.length > 1) {
      const telaLarga = map.getSize().x >= 768;
      map.fitBounds(rota, {
        paddingTopLeft: telaLarga ? [420, 40] : [20, 320],
        paddingBottomRight: [40, 40],
      });
    }
  }, [map, rota]);

  return null;
}

function CapturaClique({ onCliqueMapa }: { onCliqueMapa: MapaRotasProps["onCliqueMapa"] }) {
  useMapEvents({
    click: (e) => onCliqueMapa(e.latlng.lat, e.latlng.lng),
  });
  return null;
}

export default function MapaRotasComponent({
  limites,
  rota,
  origem,
  destino,
  onCliqueMapa,
}: MapaRotasProps) {
  return (
    <MapContainer
      bounds={limites}
      className="h-full w-full cursor-crosshair"
      zoomControl={false}
    >
      {/* Mapa de ruas do OpenStreetMap (mesma base dos grafos de rotas, sem chave de API) */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <Enquadramento limites={limites} rota={rota} />
      <CapturaClique onCliqueMapa={onCliqueMapa} />

      {/* TRAÇADO DA ROTA: contorno branco + linha azul da marca */}
      {rota && (
        <>
          <Polyline positions={rota} pathOptions={{ color: "#ffffff", weight: 10, opacity: 0.9 }} />
          <Polyline positions={rota} pathOptions={{ color: "#0f35a0", weight: 6 }} />
        </>
      )}

      {origem && (
        <CircleMarker
          center={origem}
          radius={9}
          pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#0a9667", fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -8]}>Origem</Tooltip>
        </CircleMarker>
      )}

      {destino && (
        <CircleMarker
          center={destino}
          radius={9}
          pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#ef4444", fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -8]}>Destino</Tooltip>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
