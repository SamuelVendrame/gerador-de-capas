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
};

export type CallbackProgresso = (evento: EventoProgresso) => void;