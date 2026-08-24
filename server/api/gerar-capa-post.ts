import { schemaGeracaoCapa, GENEROS } from "../../shared/schemasGeneros";
import { rodarAgente } from "../agent/loop";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validacao = schemaGeracaoCapa.safeParse(body);
  if (!validacao.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Dados inválidos",
      data: validacao.error.issues,
    });
  }

  const dados = validacao.data;

  const generoInfo = GENEROS.find((g) => g.valor === dados.genero);
  const contextoGenero = generoInfo
    ? `Gênero: ${generoInfo.label} (${generoInfo.descricao})`
    : `Gênero: ${dados.genero}`;

  const climaTexto = dados.clima
    ? `Preferência de clima/atmosfera: ${dados.clima}`
    : "Sem preferência de clima específica — decida livremente com base no gênero e na descrição.";

  const tema = `${dados.descricao}. ${contextoGenero}. ${climaTexto}`;

  const resultado = await rodarAgente({
    titulo: dados.titulo,
    autor: dados.autor,
    tema,
  });

  return resultado;
});