import { adicionarRegistro, atualizarRegistro } from "./historicoStore";
import { parseAvaliacao } from "../agent/parseAvaliacao";

export async function criarOuReiniciarRegistro(
  id: string,
  idExistente: string | undefined,
  dados: { titulo: string; autor: string; genero: string; descricao: string; clima?: string }
): Promise<void> {
  if (idExistente) {
    await atualizarRegistro(id, { status: "em_processamento", motivoCancelamento: undefined });
  } else {
    await adicionarRegistro({
      id,
      titulo: dados.titulo,
      autor: dados.autor,
      genero: dados.genero,
      descricao: dados.descricao,
      clima: dados.clima,
      status: "em_processamento",
      criadoEm: new Date().toISOString(),
    });
  }
}

export async function registrarSucesso(id: string, resultado: any, ultimaImagem: string | undefined): Promise<void> {
  const ultimaMensagemTexto = resultado.historico
    .slice()
    .reverse()
    .find((m: any) => m.role === "assistant" && typeof m.content === "string")?.content ?? "";

  const avaliacao = parseAvaliacao(ultimaMensagemTexto);

    await atualizarRegistro(id, {
    status: "concluido",
    caminhoImagem: ultimaImagem,
    layout: resultado.layout,
    fonte: resultado.fonte,
    tentativasImagem: resultado.tentativasImagem,
    ajustesAgente: resultado.ajustesAgente,
    duracaoSegundos: resultado.duracaoSegundos,
    logProcesso: resultado.logEventos,
    ...avaliacao,
  });
}

export async function registrarFalha(id: string, resultado: any): Promise<void> {
  await atualizarRegistro(id, {
    status: "cancelado",
    motivoCancelamento: resultado.motivoFalha ?? "Limite de 3 tentativas atingido sem aprovação do agente.",
    tentativasImagem: resultado.tentativasImagem,
    ajustesAgente: resultado.ajustesAgente,
    duracaoSegundos: resultado.duracaoSegundos,
    layout: resultado.layout,
    fonte: resultado.fonte,
  });
}

export async function registrarErro(id: string, erro: unknown): Promise<void> {
  const metricas = (erro as any).metricasParciais ?? {};
  await atualizarRegistro(id, {
    status: "cancelado",
    motivoCancelamento: erro instanceof Error ? erro.message : "Erro desconhecido durante a geração.",
    ...metricas,
  });
}