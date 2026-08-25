import { renderizarCapa } from "../agent/tools/renderizarCapa";
import { atualizarRegistro, lerHistorico } from "../data/historicoStore";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, layout, fonte } = body;

  const historico = await lerHistorico();
  const registro = historico.find((r) => r.id === id);
  if (!registro) throw createError({ statusCode: 404, statusMessage: "Registro não encontrado" });
  if (!registro.imagemFundoUrl) {
    throw createError({ statusCode: 400, statusMessage: "Este registro não tem a arte de fundo salva (gerado antes desta funcionalidade)." });
  }

  const novaCapa = await renderizarCapa({
    layout,
    fonte,
    imagemUrl: registro.imagemFundoUrl,
    titulo: registro.titulo,
    autor: registro.autor,
  });

  await atualizarRegistro(id, { layout, fonte, caminhoImagem: novaCapa });

  const atualizado = (await lerHistorico()).find((r) => r.id === id);
  return atualizado;
});