import { chamarLLM } from "./llm";
import type { Mensagem } from "../types/llm-types";
import { TOOLS } from "./tools";
import { executarRodadaTools } from "./executarRodadaTools";
import { PROMPT_SISTEMA, montarPromptUsuario } from "./prompts";
import { LIMITE_SEGURANCA_ITERACOES, type MetricasRodada, type EventoProgresso, type CallbackProgresso } from "../types/tools-types";

function extrairUltimaRespostaTexto(historico: Mensagem[]): string | undefined {
  for (let i = historico.length - 1; i >= 0; i--) {
    const msg = historico[i];
    if (msg?.role === "assistant" && typeof msg.content === "string" && msg.content.trim()) {
      return msg.content;
    }
  }
  return undefined;
}

function resumirComentario(texto: string): string {
  if (!texto) return "Processando...";
  const primeiraFrase = texto.split(/[.!?]\s/)[0] ?? texto;
  return primeiraFrase.length > 140 ? primeiraFrase.slice(0, 140) + "..." : primeiraFrase + ".";
}

function montarResultado(
  sucesso: boolean,
  historico: Mensagem[],
  metricas: MetricasRodada,
  inicio: number,
  motivoFalha?: string,
  logEventos?: EventoProgresso[],
  imagemFundoUrl?: string | null
) {
  const duracaoSegundos = (Date.now() - inicio) / 1000;
  return {
    sucesso, historico,
    tentativasImagem: metricas.tentativasImagem,
    ajustesAgente: metricas.ajustesAgente,
    duracaoSegundos,
    layout: metricas.layoutFinal,
    fonte: metricas.fonteFinal,
    logEventos: logEventos ?? [],
    imagemFundoUrl: imagemFundoUrl ?? undefined,
    ...(motivoFalha !== undefined ? { motivoFalha } : {}),
  };
}

function rotularEtapa(nomeTool: string): string {
  const rotulos: Record<string, string> = {
    gerarImagem: "Gerando imagem",
    renderizarCapa: "Montando a capa e capturando preview",
  };
  return rotulos[nomeTool] ?? nomeTool;
}

export async function rodarAgente(
  dadosDoLivro: { titulo: string; autor: string; tema: string },
  historicoInicial?: Mensagem[],
  onProgresso?: CallbackProgresso
) {
  const inicio = Date.now();
  let iteracoes = 0;
  const ultimaImagemGeradaRef = { valor: null as string | null };
  const metricas: MetricasRodada = { tentativasImagem: 0, ajustesAgente: 0 };
  const logEventos: EventoProgresso[] = [];

  function emitirEvento(evento: EventoProgresso) {
    logEventos.push(evento);
    onProgresso?.(evento);
  }

  const historico: Mensagem[] = historicoInicial ?? [
    { role: "system", content: PROMPT_SISTEMA },
    { role: "user", content: montarPromptUsuario(dadosDoLivro) },
  ];

  try {
    while (iteracoes < LIMITE_SEGURANCA_ITERACOES) {
      const inicioEtapa = Date.now();
      const resposta = await chamarLLM(historico, TOOLS);
      historico.push(resposta);

      const respostaTexto = typeof resposta.content === "string" ? resposta.content : "";
      const duracaoEtapa = (Date.now() - inicioEtapa) / 1000;

      if (respostaTexto.startsWith("APROVADO")) {
        if (metricas.ajustesAgente === 0) {
          historico.push({ role: "user", content: "Você ainda não chamou renderizarCapa. Chame antes de aprovar." });
          continue;
        }

        const nota = respostaTexto.match(/Nota da autorrevisão:\s*([\d.,]+)/i)?.[1] ?? "—";
        emitirEvento({
          titulo: "Capa aprovada pelo agente",
          comentario: `Nota da autorrevisão: ${nota}`,
          duracaoSegundos: duracaoEtapa,
        });

        return montarResultado(true, historico, metricas, inicio, undefined, logEventos, ultimaImagemGeradaRef.valor);
      }

      const tituloEtapa = resposta.tool_calls?.[0]?.function.name
        ? rotularEtapa(resposta.tool_calls[0].function.name)
        : "Revisando o resultado";

      emitirEvento({ titulo: tituloEtapa, comentario: resumirComentario(respostaTexto), duracaoSegundos: duracaoEtapa });

      if (resposta.tool_calls && resposta.tool_calls.length > 0) {
        const detalhes = await executarRodadaTools(resposta.tool_calls, historico, ultimaImagemGeradaRef, metricas);
        const detalheAtual = detalhes[0];

        let comentarioFinal = resumirComentario(respostaTexto);
        let ehCorrecao = false;

        if (detalheAtual?.nomeTool === "gerarImagem") {
          comentarioFinal = `Prompt: "${detalheAtual.argumentos.prompt}"`;
          ehCorrecao = metricas.tentativasImagem > 1;
        } else if (detalheAtual?.nomeTool === "renderizarCapa") {
          comentarioFinal = `Layout: ${detalheAtual.argumentos.layout} · Fonte: ${detalheAtual.argumentos.fonte}`;
          ehCorrecao = metricas.ajustesAgente > 1;
        }

        emitirEvento({
          titulo: tituloEtapa,
          comentario: comentarioFinal,
          duracaoSegundos: duracaoEtapa,
          caminhoImagem: ultimaImagemGeradaRef.valor ?? undefined,
          ehCorrecao,
        });
      }

      iteracoes++;
    }

    return montarResultado(false, historico, metricas, inicio, extrairUltimaRespostaTexto(historico), logEventos, ultimaImagemGeradaRef.valor);
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