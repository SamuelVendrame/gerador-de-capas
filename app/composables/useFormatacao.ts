export const LABELS_STATUS: Record<string, string> = {
  concluido: "Concluído",
  em_processamento: "Em processamento",
  cancelado: "Cancelado após 3 tentativas",
};

export function formatarDataHora(isoString: string): string {
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}