import { chamarLLM, type Mensagem } from "./llm";
import { TOOLS, executarTool } from "./tools";

const MAX_TENTATIVAS = 3;

export async function rodarAgente(dadosDoLivro: {
      titulo: string;
      autor: string;
      tema: string;
    }) 
  {
    
  let tentativas = 0;

  const historico: Mensagem[] = [
    {
      role: "system",
      content:
        "Você é um agente que gera capas de livro. Use as ferramentas disponíveis para gerar a arte de fundo e depois renderizar a capa. " +
        "Analise cada resultado visual e decida se está bom o suficiente ou se precisa corrigir. " +
        "Quando aprovar o resultado final, responda apenas com o texto 'APROVADO' seguido de um breve resumo.",
    },
    {
      role: "user",
      content: `Gere uma capa para o livro "${dadosDoLivro.titulo}" de ${dadosDoLivro.autor}. Tema: ${dadosDoLivro.tema}`,
    },
  ];

  while (tentativas < MAX_TENTATIVAS) {
    const resposta = await chamarLLM(historico, TOOLS);
    historico.push(resposta);

    const respostaTexto = typeof resposta.content === "string" ? resposta.content : "";

    if (respostaTexto.startsWith("APROVADO")) {
      console.log("Capa aprovada:", respostaTexto);
      return { sucesso: true, historico };
    }

    if (resposta.tool_calls && resposta.tool_calls.length > 0) {
      for (const call of resposta.tool_calls) {
        const args = JSON.parse(call.function.arguments);
        const resultadoUrl = await executarTool(call.function.name, args);

        historico.push({
          role: "tool",
          tool_call_id: call.id,
          content: `Resultado de ${call.function.name}: ${resultadoUrl}`,
        });

        historico.push({
          role: "user",
          content: [
            { type: "text", text: `Aqui está o resultado de ${call.function.name}, analise:` },
            { type: "image_url", image_url: { url: resultadoUrl } },
          ],
        });
      }
    }

    tentativas++;
  }

  console.log("Limite de tentativas atingido sem aprovação.");
  return { sucesso: false, historico };
}