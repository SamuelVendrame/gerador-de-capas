import { chromium } from "playwright";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function converterParaBase64(caminhoArquivo: string): Promise<string> {
  const buffer = await readFile(caminhoArquivo);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export async function renderizarECapturar(params: {
    layout: string;
    fonte: string;
    imagemUrl: string;
    titulo: string;
    autor: string;
}): Promise<{ urlPublica: string; caminhoLocal: string }> {
    const query = new URLSearchParams({
    layout: params.layout,
    fonte: params.fonte,
    imagemUrl: params.imagemUrl,
    titulo: params.titulo,
    autor: params.autor,
});

  const url = `http://localhost:3000/render/capa?${query.toString()}`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 2400 } });

  await page.goto(url, { waitUntil: "networkidle" });

  await page.waitForTimeout(500);

  const nomeArquivo = `${randomUUID()}.png`;
  const pastaDestino = join(process.cwd(), "public", "renders");
  await mkdir(pastaDestino, { recursive: true });

  const caminhoCompleto = join(pastaDestino, nomeArquivo);
  await page.screenshot({ path: caminhoCompleto });

  await browser.close();

  return {
    urlPublica: `http://localhost:3000/renders/${nomeArquivo}`,
    caminhoLocal: caminhoCompleto,
  };
}
