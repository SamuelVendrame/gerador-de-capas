import { randomUUID } from "crypto";
import { schemaGeracaoCapa } from "../../shared/schemasGeneros";
import { rodarAgente } from "../agent/loop";
import { montarTema } from "../agent/contexto";
import { extrairUltimaImagem } from "../agent/extrairImagem";
import {
  criarOuReiniciarRegistro,
  registrarSucesso,
  registrarFalha,
  registrarErro,
} from "../data/historicoRegistro";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validacao = schemaGeracaoCapa.safeParse(body);
  if (!validacao.success) {
    throw createError({ statusCode: 400, statusMessage: "Dados inválidos", data: validacao.error.issues });
  }

  const dados = validacao.data;
  const idExistente = body.idExistente as string | undefined;
  const id = idExistente ?? randomUUID();

  await criarOuReiniciarRegistro(id, idExistente, dados);

  const tema = montarTema(dados);

  try {
    const resultado = await rodarAgente({ titulo: dados.titulo, autor: dados.autor, tema });

    if (resultado.sucesso) {
      const ultimaImagem = extrairUltimaImagem(resultado.historico);
      await registrarSucesso(id, resultado, ultimaImagem);
    } else {
      await registrarFalha(id, resultado);
    }

    return { id, ...resultado };
  } catch (erro) {
    await registrarErro(id, erro);
    throw erro;
  }
});