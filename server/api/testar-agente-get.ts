import { rodarAgente } from "../agent/loop";

export default defineEventHandler(async (event) => {
  console.log("ENV carregada?", !!process.env.OPENROUTER_API_KEY);

  const resultado = await rodarAgente({
    titulo: "O Vale Esquecido",
    autor: "Ana Silva",
    tema: "ficção científica com cowboys que laceiam e montam em dinossauros",
  });

  return resultado;
});