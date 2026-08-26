export async function gerarImagem(prompt: string): Promise<string> {
  const apiKey = process.env.WAVESPEED_API_KEY;
  if (!apiKey) throw new Error("WAVESPEED_API_KEY não configurada no .env");

  const response = await fetch(
    "https://api.wavespeed.ai/api/v3/wavespeed-ai/z-image/turbo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt, size: "1024*1024" }),
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
    throw new Error(`WaveSpeed não retornou task ID.\nResposta: ${textoResposta}`);
  }

  console.log("[gerarImagem] task criada:", taskId);
  return await esperarImagemWaveSpeed(taskId, apiKey);
}

async function esperarImagemWaveSpeed(taskId: string, apiKey: string): Promise<string> {
  const maxTentativas = 30;

  for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch(
      `https://api.wavespeed.ai/api/v3/predictions/${taskId}/result`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const textoResposta = await response.text();
    let data: any;

    try {
      data = JSON.parse(textoResposta);
    } catch {
      throw new Error(
        `WaveSpeed retornou resposta não-JSON no polling.\nHTTP ${response.status}\nResposta:\n${textoResposta}`
      );
    }

    if (!response.ok || data.code !== 200) {
      throw new Error(`Erro consultando imagem.\nHTTP ${response.status}\n${data.message ?? textoResposta}`);
    }

    const resultado = data.data;
    const numeroTentativa = tentativa + 1;

    if (numeroTentativa % 5 === 0 || resultado.status === "completed" || ["failed", "cancelled", "timeout"].includes(resultado.status)) {
      console.log(`[gerarImagem] tentativa ${numeroTentativa}: ${resultado.status}`);
    }

    if (resultado.status === "completed") {
      const url = resultado.outputs?.[0];
      if (!url) throw new Error(`WaveSpeed marcou como completed, mas não retornou output.`);
      return url;
    }

    if (["failed", "cancelled", "timeout"].includes(resultado.status)) {
      throw new Error(
        `Geração da imagem terminou com status ${resultado.status}: ${resultado.error || "sem detalhes"}`
      );
    }
  }

  throw new Error("Tempo máximo excedido esperando a geração da imagem.");
}