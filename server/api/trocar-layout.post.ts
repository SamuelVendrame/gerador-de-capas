import { renderizarCapa } from "../agent/tools/renderizarCapa";
import { atualizarRegistro, lerHistorico } from "../data/historicoStore";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, layout, fonte } = body;

  const historico = await lerHistorico();
  const registro = historico.find((r) => r.id === id);
  if (!registro) throw createError({ statusCode: 404, statusMessage: "Registro não encontrado" });
  
  await atualizarRegistro(id, { layout, fonte });
  const atualizado = (await lerHistorico()).find((r) => r.id === id);
  return atualizado;
});