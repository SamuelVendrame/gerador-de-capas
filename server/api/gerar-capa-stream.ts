import { schemaGeracaoCapa } from "../../shared/schemasGeneros";
import { rodarAgente } from "../agent/loop";
import { montarTema } from "../agent/contexto";
import { extrairUltimaImagem } from "../agent/extrairImagem";
import { traduzirErroParaUsuario } from "../agent/traduzirErro";
import {
  criarOuReiniciarRegistro,
  registrarSucesso,
  registrarFalha,
  registrarErro,
} from "../data/historicoRegistro";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "text/event-stream");
  setResponseHeader(event, "Cache-Control", "no-cache");
  setResponseHeader(event, "Connection", "keep-alive");

  const body = await readBody(event);
  const validacao = schemaGeracaoCapa.safeParse(body);
  if (!validacao.success) {
    event.node.res.write(`data: ${JSON.stringify({ erro: "Dados inválidos" })}\n\n`);
    event.node.res.end();
    return;
  }

  const dados = validacao.data;
  const idExistente = body.idExistente as string | undefined;
  const id = idExistente ?? randomUUID();
  await criarOuReiniciarRegistro(id, idExistente, dados);

  const enviarEvento = (dado: any) => {
    event.node.res.write(`data: ${JSON.stringify(dado)}\n\n`);
  };

  enviarEvento({ tipo: "iniciado", id });

  const tema = montarTema(dados);

  try {
    const resultado = await rodarAgente(
      { titulo: dados.titulo, autor: dados.autor, tema },
      undefined,
      (progresso) => enviarEvento({ tipo: "passo", ...progresso })
    );

    if (resultado.sucesso) {
      const ultimaImagem = extrairUltimaImagem(resultado.historico);
      await registrarSucesso(id, resultado, ultimaImagem);
      enviarEvento({ tipo: "concluido", sucesso: true, caminhoImagem: ultimaImagem });
    } else {
      await registrarFalha(id, resultado);
      enviarEvento({ tipo: "concluido", sucesso: false, motivo: resultado.motivoFalha });
    }
  } catch (erro) {
    await registrarErro(id, erro);
    const mensagemTecnica = erro instanceof Error ? erro.message : "Erro desconhecido";
    enviarEvento({ tipo: "erro", mensagem: traduzirErroParaUsuario(mensagemTecnica) });
  }

  event.node.res.end();
});