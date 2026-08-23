import { rodarAgente } from "../agent/loop";

export default defineEventHandler(async (event) => {
  console.log("ENV carregada?", !!process.env.OPENROUTER_API_KEY);

  const resultado = await rodarAgente({
    titulo: "O Vale Esquecido",
    autor: "Ana Silva",
    tema: "fantasia épica",
  });

  return resultado;
});