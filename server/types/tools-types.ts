export type MetricasRodada = {
  tentativasImagem: number;
  ajustesAgente: number;
  layoutFinal?: string;
  fonteFinal?: string;
};

export type EventoProgresso = {
  titulo: string;
  comentario: string;
  duracaoSegundos: number;
  caminhoImagem?: string;
};

export const LIMITE_TENTATIVAS_IMAGEM = 3;
export const LIMITE_AJUSTES_RENDERIZACAO = 3;
export const LIMITE_SEGURANCA_ITERACOES = 12;

export type CallbackProgresso = (evento: EventoProgresso) => void;