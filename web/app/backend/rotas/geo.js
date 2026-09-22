// Funções geométricas usadas pelo roteamento. Coordenadas sempre como [lat, lng].

const RAIO_TERRA = 6371000;
const RAD = Math.PI / 180;

export const distanciaMetros = (lat1, lng1, lat2, lng2) => {
  const dLat = (lat2 - lat1) * RAD;
  const dLng = (lng2 - lng1) * RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * RAIO_TERRA * Math.asin(Math.sqrt(a));
};

export const distanciaPontos = ([lat1, lng1], [lat2, lng2]) => distanciaMetros(lat1, lng1, lat2, lng2);

// Rumo (0–360°, sentido horário a partir do norte) entre dois pontos
export const rumo = ([lat1, lng1], [lat2, lng2]) => {
  const y = Math.sin((lng2 - lng1) * RAD) * Math.cos(lat2 * RAD);
  const x =
    Math.cos(lat1 * RAD) * Math.sin(lat2 * RAD) -
    Math.sin(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.cos((lng2 - lng1) * RAD);
  return (Math.atan2(y, x) / RAD + 360) % 360;
};

// Diferença entre rumos em (-180, 180]; positivo = virar à direita
export const diferencaRumo = (rumoChegada, rumoSaida) =>
  ((rumoSaida - rumoChegada + 540) % 360) - 180;

// Ponto que fica a ~`base` metros de pontos[0] seguindo a lista (suaviza ruído de segmentos curtos)
export const pontoAFrente = (pontos, base) => {
  let acumulado = 0;
  for (let i = 1; i < pontos.length; i++) {
    acumulado += distanciaPontos(pontos[i - 1], pontos[i]);
    if (acumulado >= base) return pontos[i];
  }
  return pontos[pontos.length - 1];
};

/**
 * Raio (m) da circunferência que passa por três pontos consecutivos da geometria.
 * Devolve Infinity para trechos retos ou pontos próximos demais (< 2 m), que só geram ruído.
 */
export const raioCurvatura = (p0, p1, p2) => {
  const escalaLng = Math.cos(p1[0] * RAD) * 111320;
  const escalaLat = 110540;
  const ax = (p0[1] - p1[1]) * escalaLng, ay = (p0[0] - p1[0]) * escalaLat;
  const bx = (p2[1] - p1[1]) * escalaLng, by = (p2[0] - p1[0]) * escalaLat;
  const a = Math.hypot(ax, ay);
  const b = Math.hypot(bx, by);
  if (a < 2 || b < 2) return Infinity;
  const c = Math.hypot(ax - bx, ay - by);
  const dobroArea = Math.abs(ax * by - ay * bx);
  if (dobroArea < 1e-6) return Infinity;
  return (a * b * c) / (2 * dobroArea);
};
