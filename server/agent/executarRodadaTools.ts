import { executarTool } from "./tools";
import type { Mensagem } from "../types/llm-types";
import type { MetricasRodada } from "../types/tools-types";

const TOOLS_COM_IMAGEM = ["gerarImagem", "renderizarCapa"];

function montarMensagensDeRetorno(nomeTool: string, resultado: string, toolCallId: string): Mensagem[] {
  const mensagemTool: Mensagem = {
    role: "tool",
    tool_call_id: toolCallId,
    content: `${nomeTool} executado com sucesso.`,
  };

  if (TOOLS_COM_IMAGEM.includes(nomeTool)) {
    return [
      mensagemTool,
      {
        role: "user",
        content: [
          { type: "text", text: `Aqui está o resultado de ${nomeTool}, analise:` },
          { type: "image_url", image_url: { url: resultado } },
        ],
      },
    ];
  }

  return [
    mensagemTool,
    { role: "user", content: `Resultado de ${nomeTool}: ${resultado}` },
  ];
}

export async function executarRodadaTools(
  toolCalls: NonNullable<Mensagem["tool_calls"]>,
  historico: Mensagem[],
  ultimaImagemGeradaRef: { valor: string | null },
  metricas: MetricasRodada
): Promise<void> {
  for (const call of toolCalls) {
    const args = JSON.parse(call.function.arguments);
    let resultado: string;

    if (call.function.name === "gerarImagem") {
        metricas.tentativasImagem++;
        resultado = await executarTool(call.function.name, args);
        ultimaImagemGeradaRef.valor = resultado;
    } else if (call.function.name === "renderizarCapa") {
        metricas.ajustesAgente++;
        metricas.layoutFinal = args.layout;
        metricas.fonteFinal = args.fonte;
      if (ultimaImagemGeradaRef.valor) args.imagemUrl = ultimaImagemGeradaRef.valor;
        resultado = await executarTool(call.function.name, args);
    } else {
      console.warn("Ferramenta desconhecida chamada. Parando o loop.")
      throw new Error(`Ferramenta desconhecida: ${call.function.name}`);
    }

    historico.push(...montarMensagensDeRetorno(call.function.name, resultado, call.id));
  }
}