import { rodarAgente } from "../agent/loop";
import type { Mensagem } from "../agent/llm";

export default defineEventHandler(async (event) => {
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
      content: `Gere uma capa para o livro "Teste de Correção" de Autor Teste. Tema: teste`,
    },
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

  const resultado = await rodarAgente(
    { titulo: "Teste de Correção", autor: "Autor Teste", tema: "teste" },
    historicoSimulado
  );

  return resultado;
});