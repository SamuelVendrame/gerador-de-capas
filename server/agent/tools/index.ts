import { gerarImagem } from "./gerarImagem";
import { renderizarCapa } from "./renderizarCapa";

export const TOOLS = [
  {
    type: "function",
    function: {
      name: "gerarImagem",
      description: "Gera uma imagem de fundo via WaveSpeed a partir de um prompt descritivo. Nunca peça texto na imagem.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Descrição da composição visual desejada" },
        },
        required: ["prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "renderizarCapa",
      description: "Renderiza o componente de capa com os parâmetros escolhidos e retorna um screenshot para revisão.",
      parameters: {
        type: "object",
        properties: {
          layout: { type: "string" },
          fonte: { type: "string" },
          imagemUrl: { type: "string" },
          titulo: { type: "string" },
          autor: { type: "string" },
        },
        required: ["layout", "fonte", "imagemUrl", "titulo", "autor"],
      },
    },
  },
] as const;

export async function executarTool(nome: string, args: Record<string, any>): Promise<string> {
  if (nome === "gerarImagem") return await gerarImagem(args.prompt);
  if (nome === "renderizarCapa") return await renderizarCapa(args);
  throw new Error(`Ferramenta desconhecida: ${nome}`);
}