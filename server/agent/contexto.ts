import { GENEROS } from "../../shared/generos";

export function montarTema(dados: { genero: string; descricao: string; clima?: string }): string {
  const generoInfo = GENEROS.find((g) => g.valor === dados.genero);
  const contextoGenero = generoInfo
    ? `Gênero: ${generoInfo.label} (${generoInfo.descricao})`
    : `Gênero: ${dados.genero}`;

  const climaTexto = dados.clima
    ? `Preferência de clima/atmosfera: ${dados.clima}`
    : "Sem preferência de clima específica — decida livremente com base no gênero e na descrição.";

  return `${dados.descricao}. ${contextoGenero}. ${climaTexto}`;
}