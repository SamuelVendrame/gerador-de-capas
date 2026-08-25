import { chamarLLM, type Mensagem } from "./llm";
import { TOOLS, executarTool } from "./tools";

const MAX_TENTATIVAS = 3;

// componentizar
function extrairUltimaRespostaTexto(historico: Mensagem[]): string | undefined {
  for (let i = historico.length - 1; i >= 0; i--) {
    const msg = historico[i];
    if (msg?.role === "assistant" && typeof msg.content === "string" && msg.content.trim()) {
      return msg.content;
    }
  }
  return undefined;
}

export async function rodarAgente(
  dadosDoLivro: { titulo: string; autor: string; tema: string },
  historicoInicial?: Mensagem[]
) {
  const inicio = Date.now();
  let tentativas = 0;
  let ultimaImagemGerada: string | null = null;
  let tentativasImagem = 0;
  let ajustesAgente = 0;
  let layoutFinal: string | undefined;
  let fonteFinal: string | undefined;

  const historico: Mensagem[] = historicoInicial ?? [
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

  try {
    while (tentativas < MAX_TENTATIVAS) {
      const resposta = await chamarLLM(historico, TOOLS);
      historico.push(resposta);

      const respostaTexto = typeof resposta.content === "string" ? resposta.content : "";

      if (respostaTexto.startsWith("APROVADO")) {
        const duracaoSegundos = (Date.now() - inicio) / 1000;
        return { sucesso: true, historico, tentativasImagem, ajustesAgente, duracaoSegundos, layout: layoutFinal, fonte: fonteFinal };
      }

      if (resposta.tool_calls && resposta.tool_calls.length > 0) {
        for (const call of resposta.tool_calls) {
          const args = JSON.parse(call.function.arguments);
          let url: string;

          if (call.function.name === "gerarImagem") {
            tentativasImagem++;
            url = await executarTool(call.function.name, args);
            ultimaImagemGerada = url;
          } else if (call.function.name === "renderizarCapa") {
            ajustesAgente++;
            layoutFinal = args.layout;
            fonteFinal = args.fonte;
            if (ultimaImagemGerada) args.imagemUrl = ultimaImagemGerada;
            url = await executarTool(call.function.name, args);
          } else {
            throw new Error(`Ferramenta desconhecida: ${call.function.name}`);
          }

          historico.push({ role: "tool", tool_call_id: call.id, content: `${call.function.name} executado com sucesso.` });
          historico.push({
            role: "user",
            content: [
              { type: "text", text: `Aqui está o resultado de ${call.function.name}, analise:` },
              { type: "image_url", image_url: { url } },
            ],
          });
        }
      }
      tentativas++;
    }

   const duracaoSegundos = (Date.now() - inicio) / 1000;
   const ultimaResposta = extrairUltimaRespostaTexto(historico);
   return { sucesso: false, historico, tentativasImagem, ajustesAgente, duracaoSegundos, layout: layoutFinal, fonte: fonteFinal, motivoFalha: ultimaResposta };
  } catch (erro) {
    const duracaoSegundos = (Date.now() - inicio) / 1000;
    const erroComMetricas = erro instanceof Error ? erro : new Error(String(erro));
    (erroComMetricas as any).metricasParciais = { tentativasImagem, ajustesAgente, duracaoSegundos, layout: layoutFinal, fonte: fonteFinal };
    throw erroComMetricas;
  }
}