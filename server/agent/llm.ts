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
const MODELO = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";

export async function chamarLLM(historico: Mensagem[], tools: any): Promise<Mensagem> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY não configurada no .env");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODELO,
      messages: historico,
      tools,
    }),
  });

  const textoResposta = await response.text();

  if (!response.ok) {
    throw new Error(`OpenRouter retornou HTTP ${response.status}: ${textoResposta}`);
  }

  let data;
  try {
    data = JSON.parse(textoResposta);
  } catch (err) {
    throw new Error(`A API não retornou um JSON válido. Conteúdo bruto recebido:\n${textoResposta}`);
  }

  const escolha = data.choices?.[0];
  if (!escolha) throw new Error("Resposta do OpenRouter sem 'choices'");

  return escolha.message as Mensagem;
}