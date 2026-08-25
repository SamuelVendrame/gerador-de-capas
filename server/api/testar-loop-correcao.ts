import { rodarAgente } from "../agent/loop";
import type { Mensagem } from "../types/llm-types";

export default defineEventHandler(async (event) => {
  const dadosDoLivro = {
    titulo: "Teste de Correção Teste de Correção Teste de Correção Teste de Correção Teste de Correção Teste de Correção",
    autor: "Autor Teste",
    tema: "Fantasia, com grandes colinas e um castelo branco com telhados roxos, tendo um dragao vermelho voando aos fundos",
  };

  const historicoSimulado: Mensagem[] = [
    {
      role: "system",
      content:
        "Você é um agente que gera capas de livro. Use as ferramentas disponíveis para gerar a arte de fundo e depois renderizar a capa. " +
        "Analise cada resultado visual e decida se está bom o suficiente ou se precisa corrigir. " +
        "Quando aprovar o resultado final, responda apenas com o texto 'APROVADO' seguido de um breve resumo.",
    },
    {
      role: "user",
      content: `Gere uma capa para o livro "${dadosDoLivro.titulo}" de ${dadosDoLivro.autor}. Tema: ${dadosDoLivro.tema}. Use o layout "faixa".`,    },
    {
      role: "assistant",
      content: null as any,
      tool_calls: [
        {
          id: "call-simulada-1",
          function: { name: "gerarImagem", arguments: JSON.stringify({ prompt: "paisagem de teste" }) },
        },
      ],
    } as any,
    {
      role: "tool",
      tool_call_id: "call-simulada-1",
      content: "gerarImagem executado com sucesso.",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Aqui está o resultado de gerarImagem, analise: A imagem contém texto indesejado sobreposto. Você precisa gerar novamente sem texto na imagem.",
        },
      ],
    },
  ];

  const resultado = await rodarAgente(dadosDoLivro, historicoSimulado);

  return resultado;
});