export type ToolCall = {
    id: string;
    function: { name: string; arguments: string }; 
};

export type Mensagem = {
    role: "system" | "user" | "assistant" | "tool";
    content: string | Array<{ type: "text" | "image_url"; text?: string; image_url?: { url: string } }>;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELOS_FALLBACK = [
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "google/gemma-4-31b-it:free",
  "openrouter/free"
];

function erroDeRateLimit(mensagem: string): boolean {
  return mensagem.includes("ResourceExhausted") || mensagem.includes("Rate limit") || mensagem.includes("429");
}

export async function chamarLLM(historico: Mensagem[], tools: any): Promise<Mensagem> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurada no .env");

  let ultimoErro: Error | null = null;

  for (const modelo of MODELOS_FALLBACK) {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: modelo, messages: historico, tools }),
      });

      const textoResposta = await response.text();

      if (!response.ok) {
        if (erroDeRateLimit(textoResposta)) {
          console.warn(`[chamarLLM] Modelo ${modelo} com rate limit, tentando próximo...`);
          ultimoErro = new Error(`OpenRouter retornou HTTP ${response.status}: ${textoResposta}`);
          continue;
        }
        throw new Error(`OpenRouter retornou HTTP ${response.status}: ${textoResposta}`);
      }

      let data;
      try {
        data = JSON.parse(textoResposta);
      } catch {
        throw new Error(`A API não retornou um JSON válido. Conteúdo bruto:\n${textoResposta}`);
      }

      const escolha = data.choices?.[0];
      if (!escolha) {
        if (erroDeRateLimit(textoResposta)) {
          console.warn(`[chamarLLM] Modelo ${modelo} com rate limit, tentando próximo...`);
          ultimoErro = new Error(`Resposta sem 'choices': ${textoResposta}`);
          continue;
        }
        throw new Error(`Resposta do OpenRouter sem 'choices'. Resposta completa: ${textoResposta}`);
      }

      return escolha.message as Mensagem;
    } catch (erro) {
      ultimoErro = erro instanceof Error ? erro : new Error(String(erro));
      if (!erroDeRateLimit(ultimoErro.message)) throw ultimoErro; // erro real, não adianta trocar de modelo
    }
  }

  throw new Error(`Todos os modelos de fallback falharam. Último erro: ${ultimoErro?.message}`);
}