
type ToolCall = {
  id: string;
  function: { name: string; arguments: string }; // arguments vem como JSON string
};

type Mensagem = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | Array<{ type: "text" | "image_url"; text?: string; image_url?: { url: string } }>;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODELO = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";
const MAX_TENTATIVAS = 3;

const TOOLS = [
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

async function gerarImagem(prompt: string): Promise<string> {
  const apiKey = process.env.WAVESPEED_API_KEY;

  if (!apiKey) {
    throw new Error("WAVESPEED_API_KEY não configurada no .env");
  }

  const response = await fetch(
    "https://api.wavespeed.ai/api/v3/wavespeed-ai/z-image/turbo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        size: "1024*1024",
      }),
    }
  );

  const textoResposta = await response.text();

  let data: any;

  try {
    data = JSON.parse(textoResposta);
  } catch {
    throw new Error(
      `WaveSpeed não retornou JSON válido.\nHTTP ${response.status}\nResposta:\n${textoResposta}`
    );
  }

  if (!response.ok || data.code !== 200) {
    throw new Error(
      `WaveSpeed retornou erro.\nHTTP ${response.status}\n${data.message ?? textoResposta}`
    );
  }

  const taskId = data.data?.id;

  if (!taskId) {
    throw new Error(
      `WaveSpeed não retornou task ID.\nResposta: ${textoResposta}`
    );
  }

  console.log("[gerarImagem] task criada:", taskId);

  return await esperarImagemWaveSpeed(taskId, apiKey);
}

async function esperarImagemWaveSpeed(
  taskId: string,
  apiKey: string
): Promise<string> {
  const maxTentativas = 30;

  for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch(
      `https://api.wavespeed.ai/api/v3/predictions/${taskId}/result`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const textoResposta = await response.text();

    let data: any;

    try {
      data = JSON.parse(textoResposta);
    } catch {
      throw new Error(
        `WaveSpeed retornou resposta não-JSON no polling.\n` +
        `HTTP ${response.status}\n` +
        `Resposta:\n${textoResposta}`
      );
    }

    if (!response.ok || data.code !== 200) {
      throw new Error(
        `Erro consultando imagem.\n` +
        `HTTP ${response.status}\n` +
        `${data.message ?? textoResposta}`
      );
    }

    const resultado = data.data;

    console.log(
      `[gerarImagem] tentativa ${tentativa + 1}:`,
      resultado.status
    );

    if (resultado.status === "completed") {
      const url = resultado.outputs?.[0];

      if (!url) {
        throw new Error(
          `WaveSpeed marcou como completed, mas não retornou output.`
        );
      }

      return url;
    }

    if (
      resultado.status === "failed" ||
      resultado.status === "cancelled" ||
      resultado.status === "timeout"
    ) {
      throw new Error(
        `Geração da imagem terminou com status ${resultado.status}: ${
          resultado.error || "sem detalhes"
        }`
      );
    }
  }

  throw new Error("Tempo máximo excedido esperando a geração da imagem.");
}

async function renderizarCapa(params: Record<string, any>): Promise<string> {
  console.log(`[renderizarCapa] params:`, params);
  // fazer a chamada do renderer (Playwright) aqui
  return "https://fake-url/screenshot-capa.png";
}

//chamada real ao OpenRouter
async function chamarLLM(historico: Mensagem[]): Promise<Mensagem> {
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
      tools: TOOLS,
    }),
  });

  // le a resposta como texto bruto primeiro
  const textoResposta = await response.text();

  // verifica se houve erro HTTP
  if (!response.ok) {
    throw new Error(`OpenRouter retornou HTTP ${response.status}: ${textoResposta}`);
  }

  let data;
  // tenta converter o texto pra json
  try {
    data = JSON.parse(textoResposta);
  } catch (err) {
    // se o openRouter retornar algo que nao seja json (ex: um erro cloudflare ou timeout), 
    throw new Error(`A API não retornou um JSON válido. Conteúdo bruto recebido:\n${textoResposta}`);
  }

  const escolha = data.choices?.[0];

  if (!escolha) throw new Error("Resposta do OpenRouter sem 'choices'");

  return escolha.message as Mensagem;
}

// loop principal do agente
export async function rodarAgente(dadosDoLivro: {
  titulo: string;
  autor: string;
  tema: string;
}) {
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
    const resposta = await chamarLLM(historico);
    historico.push(resposta);

    const respostaTexto = typeof resposta.content === "string" ? resposta.content : "";

    if (respostaTexto.startsWith("APROVADO")) {
      console.log("Capa aprovada:", respostaTexto);
      return { sucesso: true, historico };
    }

    if (resposta.tool_calls && resposta.tool_calls.length > 0) {
      for (const call of resposta.tool_calls) {
        const args = JSON.parse(call.function.arguments);
        let resultadoUrl: string;

        if (call.function.name === "gerarImagem") {
          resultadoUrl = await gerarImagem(args.prompt);
        } else if (call.function.name === "renderizarCapa") {
          resultadoUrl = await renderizarCapa(args);
        } else {
          throw new Error(`Ferramenta desconhecida: ${call.function.name}`);
        }


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