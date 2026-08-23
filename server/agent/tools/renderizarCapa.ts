import { renderizarECapturar, converterParaBase64 } from "../../renderer/screenshot";

export async function renderizarCapa(params: Record<string, any>): Promise<string> {
  console.log(`[renderizarCapa] params:`, params);
  const resultado = await renderizarECapturar({
    layout: params.layout,
    fonte: params.fonte,
    imagemUrl: params.imagemUrl,
    titulo: params.titulo,
    autor: params.autor,
  });

  return await converterParaBase64(resultado.caminhoLocal);
}