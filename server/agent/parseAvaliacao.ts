import type { AvaliacaoEstruturada } from "../types/avaliacao-types";

export function parseAvaliacao(texto: string): AvaliacaoEstruturada {
  const extrairCampo = (rotulo: string): string | undefined => {
    const regex = new RegExp(`${rotulo}:\\s*(.+)`, "i");
    return texto.match(regex)?.[1]?.trim();
  };

  return {
    layoutMotivo: extrairCampo("Layout escolhido"),
    fonteMotivo: extrairCampo("Fonte escolhida"),
    avaliacaoArte: extrairCampo("Avaliação da arte"),
    consideracoesFinais: extrairCampo("Considerações finais"),
  };
}