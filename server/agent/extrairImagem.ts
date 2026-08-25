export function extrairUltimaImagem(historico: any[]): string | undefined {
  for (let i = historico.length - 1; i >= 0; i--) {
    const msg = historico[i];
    if (Array.isArray(msg.content)) {
      const imagem = msg.content.find((c: any) => c.type === "image_url");
      if (imagem) return imagem.image_url.url;
    }
  }
  return undefined;
}