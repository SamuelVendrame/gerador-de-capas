import { executarTool } from "./tools";
import type { Mensagem } from "./llm";

export type MetricasRodada = {
  tentativasImagem: number;
  ajustesAgente: number;
  layoutFinal?: string;
  fonteFinal?: string;
};

export async function executarRodadaTools(
  toolCalls: NonNullable<Mensagem["tool_calls"]>,
  historico: Mensagem[],
  ultimaImagemGeradaRef: { valor: string | null },
  metricas: MetricasRodada
): Promise<void> {
  for (const call of toolCalls) {
    const args = JSON.parse(call.function.arguments);
    let url: string;

    if (call.function.name === "gerarImagem") {
      metricas.tentativasImagem++;
      url = await executarTool(call.function.name, args);
      ultimaImagemGeradaRef.valor = url;
    } else if (call.function.name === "renderizarCapa") {
      metricas.ajustesAgente++;
      metricas.layoutFinal = args.layout;
      metricas.fonteFinal = args.fonte;
      if (ultimaImagemGeradaRef.valor) args.imagemUrl = ultimaImagemGeradaRef.valor;
      url = await executarTool(call.function.name, args);
    } else {
      throw new Error(`Ferramenta desconhecida: ${call.function.name}`);
    }

    historico.push({ role: "tool", tool_call_id: call.id, content: `${call.function.name} executado com sucesso.` });
    historico.push({
      role: "user",
      content: [
        { type: "text", text: `Aqui está o resultado de ${call.function.name}, analise:` },
        { type: "image_url", image_url: { url } },
      ],
    });
  }
}