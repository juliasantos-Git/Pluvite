// Listas oficiais do domínio Pluvite (ver SKILLS/pluvite-domain). Importe daqui em vez de
// redeclarar as listas em cada página.

// Os 39 municípios do Vale do Paraíba e Litoral Norte
export const MUNICIPIOS = [
  "Aparecida",
  "Arapeí",
  "Areias",
  "Bananal",
  "Caçapava",
  "Cachoeira Paulista",
  "Campos do Jordão",
  "Canas",
  "Caraguatatuba",
  "Cruzeiro",
  "Cunha",
  "Guaratinguetá",
  "Igaratá",
  "Ilhabela",
  "Jacareí",
  "Jambeiro",
  "Lagoinha",
  "Lavrinhas",
  "Lorena",
  "Monteiro Lobato",
  "Natividade da Serra",
  "Paraibuna",
  "Pindamonhangaba",
  "Piquete",
  "Potim",
  "Queluz",
  "Redenção da Serra",
  "Roseira",
  "Santa Branca",
  "Santo Antônio do Pinhal",
  "São Bento do Sapucaí",
  "São José do Barreiro",
  "São José dos Campos",
  "São Luiz do Paraitinga",
  "São Sebastião",
  "Silveiras",
  "Taubaté",
  "Tremembé",
  "Ubatuba",
] as const;

export type Municipio = (typeof MUNICIPIOS)[number];

// Remove acentos e maiúsculas pra a busca achar "Tremembe" digitando "tremembé" e vice-versa
export const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Tipos de ocorrência que o cidadão pode relatar no Feed
export const TIPOS_OCORRENCIA = [
  "Alagamento",
  "Árvore caída",
  "Buraco na via",
  "Deslizamento de terra",
  "Via interditada",
  "Outros",
] as const;

export type TipoOcorrencia = (typeof TIPOS_OCORRENCIA)[number];

// Fluxo de status de uma ocorrência, nessa ordem
export const STATUS_OCORRENCIA = [
  "Aguardando",
  "Visualizado",
  "Em Andamento",
  "Concluído",
] as const;

export type StatusOcorrencia = (typeof STATUS_OCORRENCIA)[number];

// Níveis de prioridade/risco (do mais brando ao mais grave) e a cor de cada um
export const PRIORIDADES = [
  "Zona Segura",
  "Atenção Crítica",
  "Estado de Alerta",
  "Alerta Máximo",
] as const;

export type Prioridade = (typeof PRIORIDADES)[number];

export const CORES_PRIORIDADE: Record<Prioridade, string> = {
  "Zona Segura": "#0a9667",
  "Atenção Crítica": "#f59e0b",
  "Estado de Alerta": "#ef4444",
  "Alerta Máximo": "#653dc2",
};

// Mapeamento padrão tipo de ocorrência → prioridade. É o valor usado quando a
// equipe Pluvite ainda não configurou nada na tela "Níveis de Risco" do
// painel /Adm (tabela "config_prioridades") — ver web/app/Adm/PainelPrioridades.tsx.
export const PRIORIDADE_POR_TIPO_PADRAO: Record<TipoOcorrencia, Prioridade> = {
  "Deslizamento de terra": "Alerta Máximo",
  Alagamento: "Estado de Alerta",
  "Via interditada": "Atenção Crítica",
  "Árvore caída": "Atenção Crítica",
  "Buraco na via": "Atenção Crítica",
  Outros: "Zona Segura",
};