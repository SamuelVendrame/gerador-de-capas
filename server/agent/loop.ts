import { chamarLLM } from "./llm";
import type { Mensagem } from "../types/llm-types";
import { TOOLS } from "./tools";
import { executarRodadaTools } from "./executarRodadaTools";
import type { MetricasRodada, CallbackProgresso } from "../types/tools-types";
import { PROMPT_SISTEMA, montarPromptUsuario } from "./prompts";

const MAX_TENTATIVAS = 3;

function extrairUltimaRespostaTexto(historico: Mensagem[]): string | undefined {
  for (let i = historico.length - 1; i >= 0; i--) {
    const msg = historico[i];
    if (msg?.role === "assistant" && typeof msg.content === "string" && msg.content.trim()) {
      return msg.content;
    }
  }
  return undefined;
}

function montarResultado(
  sucesso: boolean,
  historico: Mensagem[],
  metricas: MetricasRodada,
  inicio: number,
  motivoFalha?: string
) {
  const duracaoSegundos = (Date.now() - inicio) / 1000;
  return {
    sucesso,
    historico,
    tentativasImagem: metricas.tentativasImagem,
    ajustesAgente: metricas.ajustesAgente,
    duracaoSegundos,
    layout: metricas.layoutFinal,
    fonte: metricas.fonteFinal,
    ...(motivoFalha !== undefined ? { motivoFalha } : {}),
  };
}

export async function rodarAgente(
  dadosDoLivro: { titulo: string; autor: string; tema: string },
  historicoInicial?: Mensagem[],
  onProgresso?: CallbackProgresso
) {
  const inicio = Date.now();
  let tentativas = 0;
  const ultimaImagemGeradaRef = { valor: null as string | null };
  const metricas: MetricasRodada = { tentativasImagem: 0, ajustesAgente: 0 };

  const historico: Mensagem[] = historicoInicial ?? [
    { role: "system", content: PROMPT_SISTEMA },
    { role: "user", content: montarPromptUsuario(dadosDoLivro) },
  ];

  try {
   while (tentativas < MAX_TENTATIVAS) {
      const inicioEtapa = Date.now();
      const resposta = await chamarLLM(historico, TOOLS);
      historico.push(resposta);

      const respostaTexto = typeof resposta.content === "string" ? resposta.content : "";
      const duracaoEtapa = (Date.now() - inicioEtapa) / 1000;

      const tituloEtapa = resposta.tool_calls?.[0]?.function.name
        ? rotularEtapa(resposta.tool_calls[0].function.name)
        : "Revisando o resultado";

      onProgresso?.({
        titulo: tituloEtapa,
        comentario: respostaTexto || "Processando...",
        duracaoSegundos: duracaoEtapa,
      });

      if (respostaTexto.startsWith("APROVADO")) {
        if (metricas.ajustesAgente === 0) {
          historico.push({
            role: "user",
            content: "Você ainda não chamou renderizarCapa. Chame antes de aprovar.",
          });
          continue;
        }
        return montarResultado(true, historico, metricas, inicio);
      }

      if (resposta.tool_calls && resposta.tool_calls.length > 0) {
        await executarRodadaTools(resposta.tool_calls, historico, ultimaImagemGeradaRef, metricas);

        onProgresso?.({
          titulo: tituloEtapa,
          comentario: respostaTexto || "Processando...",
          duracaoSegundos: duracaoEtapa,
          caminhoImagem: ultimaImagemGeradaRef.valor ?? undefined,
        });
      }

      tentativas++;
    }

    return montarResultado(false, historico, metricas, inicio, extrairUltimaRespostaTexto(historico));
  } catch (erro) {
    const duracaoSegundos = (Date.now() - inicio) / 1000;
    const erroComMetricas = erro instanceof Error ? erro : new Error(String(erro));
    (erroComMetricas as any).metricasParciais = {
      tentativasImagem: metricas.tentativasImagem,
      ajustesAgente: metricas.ajustesAgente,
      duracaoSegundos,
      layout: metricas.layoutFinal,
      fonte: metricas.fonteFinal,
    };
    throw erroComMetricas;
  }
}

function rotularEtapa(nomeTool: string): string {
  const rotulos: Record<string, string> = {
    gerarImagem: "Gerando imagem",
    renderizarCapa: "Montando a capa e capturando preview",
  };
  return rotulos[nomeTool] ?? nomeTool;
}