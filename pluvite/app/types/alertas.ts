export type TipoDesastre =
  | "Enchente"
  | "Deslizamento"
  | "Ventos Fortes"
  | "Infraestrutura";

export type GravidadeAlerta = "Atenção" | "Alerta" | "Crítico";

export interface AlertaDesastre {
  id: string;
  tipo: TipoDesastre;
  cidade: string;
  bairro: string;
  data: string; // Formato YYYY-MM-DD
  gravidade: GravidadeAlerta;
  descricao: string;
}

export interface FiltrosAlerta {
  cidade: string;
  mesAno: string; // Formato YYYY-MM
  tipo: string;
}
