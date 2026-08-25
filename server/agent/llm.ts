import type { ToolCall, Mensagem } from "../types/llm-types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELOS_FALLBACK = [
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "openrouter/free"
];

function verificarRateLimitOuLancar(mensagemErro: string, modelo: string, contexto: { ultimoErro: Error | null }): void {
  const rateLimit =
    mensagemErro.includes("ResourceExhausted") ||
    mensagemErro.includes("Rate limit") ||
    mensagemErro.includes("429");

  if (rateLimit) {
    console.warn(`[chamarLLM] Modelo ${modelo} com rate limit, tentando próximo...`);
    contexto.ultimoErro = new Error(mensagemErro);
    return;
  }

  throw new Error(mensagemErro);
}

export async function chamarLLM(historico: Mensagem[], tools: any): Promise<Mensagem> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurada no .env");

  const contexto = { ultimoErro: null as Error | null };

  for (const modelo of MODELOS_FALLBACK) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: modelo, messages: historico, tools }),
      });

      const textoResposta = await response.text();

      if (!response.ok) {
        verificarRateLimitOuLancar(
          `OpenRouter retornou HTTP ${response.status}: ${textoResposta}`,
          modelo,
          contexto
        );
        continue;
      }

      let data;
      try {
        data = JSON.parse(textoResposta);
      } catch {
        verificarRateLimitOuLancar(
          `A API não retornou um JSON válido. Conteúdo bruto:\n${textoResposta}`,
          modelo,
          contexto
        );
        continue;
      }

      const escolha = data.choices?.[0];
      if (!escolha) {
        verificarRateLimitOuLancar(
          `Resposta do OpenRouter sem 'choices'. Resposta completa: ${textoResposta}`,
          modelo,
          contexto
        );
        continue;
      }

      return escolha.message as Mensagem;
    } catch (erro) {
      throw erro instanceof Error ? erro : new Error(String(erro));
    }
  }

  throw new Error(`Todos os modelos de fallback falharam. Último erro: ${contexto.ultimoErro?.message}`);
}