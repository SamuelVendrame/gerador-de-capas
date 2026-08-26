import type { Mensagem } from "../types/llm-types";
import { TOOLS } from "./tools";
import { executarRodadaTools } from "./executarRodadaTools";
import { PROMPT_SISTEMA, montarPromptUsuario } from "./prompts";
import {
  LIMITE_SEGURANCA_ITERACOES,
  LIMITE_TENTATIVAS_IMAGEM,
  type MetricasRodada,
  type EventoProgresso,
  type CallbackProgresso,
} from "../types/tools-types";
import { chamarLLM } from "./llm";

const ROTULOS_TOOL: Record<string, string> = {
  gerarImagem: "Gerando imagem",
  renderizarCapa: "Montando a capa e capturando preview",
};

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

function rotularEtapa(nomeTool: string, metricas: MetricasRodada): string {
  if (nomeTool === "gerarImagem") {
    return `Gerando imagem (tentativa ${metricas.tentativasImagem + 1}/${LIMITE_TENTATIVAS_IMAGEM})`;
  }
  return ROTULOS_TOOL[nomeTool] ?? nomeTool;
}

function montarResultado(
  sucesso: boolean,
  historico: Mensagem[],
  metricas: MetricasRodada,
  inicio: number,
  logEventos: EventoProgresso[],
  imagemFundoUrl: string | null,
  motivoFalha?: string
) {
  return {
    sucesso,
    historico,
    tentativasImagem: metricas.tentativasImagem,
    ajustesAgente: metricas.ajustesAgente,
    duracaoSegundos: (Date.now() - inicio) / 1000,
    layout: metricas.layoutFinal,
    fonte: metricas.fonteFinal,
    logEventos,
    imagemFundoUrl: imagemFundoUrl ?? undefined,
    ...(motivoFalha !== undefined ? { motivoFalha } : {}),
  };
}

async function processarToolCalls(
  resposta: Mensagem,
  respostaTexto: string,
  duracaoEtapa: number,
  historico: Mensagem[],
  ultimaImagemGeradaRef: { valor: string | null },
  metricas: MetricasRodada,
  emitirEvento: (evento: EventoProgresso) => void
): Promise<void> {
  const nomeToolBruto = resposta.tool_calls![0]?.function.name ?? "";
  const tituloEtapa = rotularEtapa(nomeToolBruto, metricas);

  const detalhes = await executarRodadaTools(
    resposta.tool_calls!,
    historico,
    ultimaImagemGeradaRef,
    metricas
  );

  const detalheAtual = detalhes[0];

  if (detalheAtual?.recusada) {
    emitirEvento({
      titulo: `${tituloEtapa} — Limite atingido`,
      comentario: detalheAtual.motivoRecusa ?? "Limite de tentativas atingido.",
      duracaoSegundos: duracaoEtapa,
      status: "limite",
    });
    return;
  }

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
    nomeTool: detalheAtual?.nomeTool,
  });

  emitirEvento({
    titulo: "Ferramenta executada",
    comentario: `${nomeToolBruto} executada com sucesso.`,
    duracaoSegundos: 0,
  });
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
          historico.push({
            role: "user",
            content: "Você ainda não chamou renderizarCapa. Chame antes de aprovar.",
          });
          iteracoes++;
          continue;
        }

        const nota =
          respostaTexto.match(/Nota da autorrevisão:\s*([\d.,]+)/i)?.[1] ?? "—";

        emitirEvento({
          titulo: "Capa aprovada pelo agente",
          comentario: `Nota da autorrevisão: ${nota}`,
          duracaoSegundos: duracaoEtapa,
        });

        return montarResultado(
          true,
          historico,
          metricas,
          inicio,
          logEventos,
          ultimaImagemGeradaRef.valor
        );
      }

      if (resposta.tool_calls && resposta.tool_calls.length > 1) {
        historico.push({
          role: "user",
          content:
            "Chame apenas uma ferramenta por vez. Aguarde o resultado antes de chamar a próxima.",
        });
        iteracoes++;
        continue;
      }

      if (resposta.tool_calls && resposta.tool_calls.length > 0) {
        await processarToolCalls(
          resposta,
          respostaTexto,
          duracaoEtapa,
          historico,
          ultimaImagemGeradaRef,
          metricas,
          emitirEvento
        );
      } else {
        emitirEvento({
          titulo: "Revisando o resultado",
          comentario: resumirComentario(respostaTexto),
          duracaoSegundos: duracaoEtapa,
        });
      }

      iteracoes++;
    }

    return montarResultado(
      false,
      historico,
      metricas,
      inicio,
      logEventos,
      ultimaImagemGeradaRef.valor,
      extrairUltimaRespostaTexto(historico)
    );
  } catch (erro) {
    const erroComMetricas = erro instanceof Error ? erro : new Error(String(erro));

    (erroComMetricas as any).metricasParciais = {
      tentativasImagem: metricas.tentativasImagem,
      ajustesAgente: metricas.ajustesAgente,
      duracaoSegundos: (Date.now() - inicio) / 1000,
      layout: metricas.layoutFinal,
      fonte: metricas.fonteFinal,
    };

    throw erroComMetricas;
  }
}