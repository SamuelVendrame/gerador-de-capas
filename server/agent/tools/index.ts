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
        description: "Renderiza o componente de capa com os parâmetros escolhidos e retorna um screenshot para revisão. IMPORTANTE: use exatamente a imagemUrl retornada pela chamada anterior de gerarImagem — nunca invente ou use uma URL de exemplo.",
        parameters: {
        type: "object",
        properties: {
            layout: {
            type: "string",
            enum: ["centralizado", "topoBase", "rodape", "faixa", "direita"],
            },
            fonte: {
            type: "string",
            enum: ["Playfair Display", "Cormorant Garamond", "Bebas Neue", "Space Grotesk", "Baloo 2"],
            },
            imagemUrl: { type: "string", description: "URL exata retornada pela ferramenta gerarImagem — não invente uma nova." },
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