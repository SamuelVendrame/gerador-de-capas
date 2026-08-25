import { randomUUID } from "crypto";
import { schemaGeracaoCapa, GENEROS } from "../../shared/schemasGeneros";
import { rodarAgente } from "../agent/loop";
import { adicionarRegistro, atualizarRegistro } from "../data/historicoStore";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validacao = schemaGeracaoCapa.safeParse(body);
  if (!validacao.success) {
    throw createError({ statusCode: 400, statusMessage: "Dados inválidos", data: validacao.error.issues });
  }

  const dados = validacao.data;
  const idExistente = body.idExistente as string | undefined;
  const id = idExistente ?? randomUUID();

  if (idExistente) {
    await atualizarRegistro(id, {
      status: "em_processamento",
      motivoCancelamento: undefined,
    });
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


  const generoInfo = GENEROS.find((g) => g.valor === dados.genero);
  const contextoGenero = generoInfo
    ? `Gênero: ${generoInfo.label} (${generoInfo.descricao})`
    : `Gênero: ${dados.genero}`;

  const climaTexto = dados.clima
    ? `Preferência de clima/atmosfera: ${dados.clima}`
    : "Sem preferência de clima específica — decida livremente com base no gênero e na descrição.";

  const tema = `${dados.descricao}. ${contextoGenero}. ${climaTexto}`;

  try {
    const resultado = await rodarAgente({
      titulo: dados.titulo,
      autor: dados.autor,
      tema,
    });

    if (resultado.sucesso) {
    const ultimaImagem = extrairUltimaImagem(resultado.historico);

      await atualizarRegistro(id, {
        status: "concluido",
        caminhoImagem: ultimaImagem,
        layout: resultado.layout,
        fonte: resultado.fonte,
        tentativasImagem: resultado.tentativasImagem,
        ajustesAgente: resultado.ajustesAgente,
        duracaoSegundos: resultado.duracaoSegundos,
      });
    } else {
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
    

    return { id, ...resultado };
  } catch (erro) {
    const metricas = (erro as any).metricasParciais ?? {};
    await atualizarRegistro(id, {
      status: "cancelado",
      motivoCancelamento: erro instanceof Error ? erro.message : "Erro desconhecido durante a geração.",
      ...metricas,
    });
    throw erro;
  }
});

function extrairUltimaImagem(historico: any[]): string | undefined {
    for (let i = historico.length - 1; i >= 0; i--) {
      const msg = historico[i];
      if (Array.isArray(msg.content)) {
        const imagem = msg.content.find((c: any) => c.type === "image_url");
        if (imagem) return imagem.image_url.url;
      }
    }
    return undefined;
}