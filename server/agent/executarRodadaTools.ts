import { executarTool } from "./tools";
import type { Mensagem } from "../types/llm-types";
import { LIMITE_TENTATIVAS_IMAGEM, LIMITE_AJUSTES_RENDERIZACAO, type MetricasRodada } from "../types/tools-types";

const TOOLS_COM_IMAGEM = ["gerarImagem", "renderizarCapa"];

export type DetalheExecucao = {
  nomeTool: string;
  argumentos: Record<string, any>;
  recusada?: boolean;
  motivoRecusa?: string;
};


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

  return [mensagemTool, { role: "user", content: `Resultado de ${nomeTool}: ${resultado}` }];
}

function montarMensagemLimiteAtingido(toolCallId: string, nomeTool: string, etapa: string): Mensagem[] {
  return [
    {
      role: "tool",
      tool_call_id: toolCallId,
      content: `${nomeTool} não executado: limite de tentativas da etapa "${etapa}" atingido.`,
    },
    {
      role: "user",
      content: `Você já usou todas as tentativas disponíveis para "${etapa}". Prossiga com o melhor resultado obtido até agora, ou finalize o processo.`,
    },
  ];
}

export async function executarRodadaTools(
  toolCalls: NonNullable<Mensagem["tool_calls"]>,
  historico: Mensagem[],
  ultimaImagemGeradaRef: { valor: string | null },
  metricas: MetricasRodada
): Promise<DetalheExecucao[]> {
  const detalhes: DetalheExecucao[] = [];

  for (const call of toolCalls) {
    const args = JSON.parse(call.function.arguments);

    console.log(`[AGENTE] → Chamando ferramenta: ${call.function.name}`, args);

    if (call.function.name === "gerarImagem" && metricas.tentativasImagem >= LIMITE_TENTATIVAS_IMAGEM) {
      console.log(`[AGENTE] ✗ Recusado: limite de tentativas de gerarImagem atingido.`);
      historico.push(...montarMensagemLimiteAtingido(call.id, call.function.name, "gerar imagem"));
      detalhes.push({ nomeTool: call.function.name, argumentos: args, recusada: true, motivoRecusa: "Limite de 3 tentativas de geração de imagem atingido." });
      continue;
    }
    if (call.function.name === "renderizarCapa" && metricas.ajustesAgente >= LIMITE_AJUSTES_RENDERIZACAO) {
      console.log(`[AGENTE] ✗ Recusado: limite de ajustes de renderizarCapa atingido.`);
      historico.push(...montarMensagemLimiteAtingido(call.id, call.function.name, "renderizar capa"));
      detalhes.push({ nomeTool: call.function.name, argumentos: args, recusada: true, motivoRecusa: "Limite de 3 ajustes de renderização atingido." });
      continue;
    }

    let resultado: string;

    if (call.function.name === "gerarImagem") {
      metricas.tentativasImagem++;
      resultado = await executarTool(call.function.name, args);
      ultimaImagemGeradaRef.valor = resultado;
      console.log(`[AGENTE] ✓ gerarImagem concluída (tentativa ${metricas.tentativasImagem}/${LIMITE_TENTATIVAS_IMAGEM})`);
    } else if (call.function.name === "renderizarCapa") {
      metricas.ajustesAgente++;
      metricas.layoutFinal = args.layout;
      metricas.fonteFinal = args.fonte;
      if (ultimaImagemGeradaRef.valor) args.imagemUrl = ultimaImagemGeradaRef.valor;
      resultado = await executarTool(call.function.name, args);
      console.log(`[AGENTE] ✓ renderizarCapa concluída (ajuste ${metricas.ajustesAgente}/${LIMITE_AJUSTES_RENDERIZACAO})`);
    } else {
      throw new Error(`Ferramenta desconhecida: ${call.function.name}`);
    }

    detalhes.push({ nomeTool: call.function.name, argumentos: args });
    historico.push(...montarMensagensDeRetorno(call.function.name, resultado, call.id));
  }

  return detalhes;
}