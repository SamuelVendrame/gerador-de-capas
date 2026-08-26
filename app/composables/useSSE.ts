export async function lerStreamSSE(
  url: string,
  body: any,
  aoReceberEvento: (dado: any) => void
): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const eventosCompletos = buffer.split("\n\n");
    buffer = eventosCompletos.pop() ?? "";

    for (const linha of eventosCompletos) {
      if (!linha.startsWith("data: ")) continue;
      try {
        aoReceberEvento(JSON.parse(linha.replace("data: ", "")));
      } catch (erroParse) {
        console.error("Falha ao parsear evento SSE:", erroParse, linha);
      }
    }
  }
}