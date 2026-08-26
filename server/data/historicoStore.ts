import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";
import type { RegistroHistorico } from "../../shared/schemaHistorico";

const CAMINHO_ARQUIVO = join(process.cwd(), "server", "data", "historico.json");

let filaEscrita: Promise<any> = Promise.resolve();

function enfileirarEscrita<T>(operacao: () => Promise<T>): Promise<T> {
  const resultado = filaEscrita.then(operacao, operacao);
  filaEscrita = resultado.catch(() => {});
  return resultado;
}

async function garantirArquivo(): Promise<void> {
  const pasta = dirname(CAMINHO_ARQUIVO);
  await mkdir(pasta, { recursive: true });

  if (!existsSync(CAMINHO_ARQUIVO)) {
    await writeFile(CAMINHO_ARQUIVO, JSON.stringify([], null, 2));
    return;
  }

  const conteudo = await readFile(CAMINHO_ARQUIVO, "utf-8");
  if (!conteudo.trim()) {
    await writeFile(CAMINHO_ARQUIVO, JSON.stringify([], null, 2));
  }
}

export async function lerHistorico(): Promise<RegistroHistorico[]> {
  await garantirArquivo();
  const conteudo = await readFile(CAMINHO_ARQUIVO, "utf-8");
  return JSON.parse(conteudo);
}

export async function adicionarRegistro(registro: RegistroHistorico): Promise<void> {
  return enfileirarEscrita(async () => {
    const historico = await lerHistorico();
    historico.unshift(registro);
    await writeFile(CAMINHO_ARQUIVO, JSON.stringify(historico, null, 2));
  });
}

export async function atualizarRegistro(id: string, atualizacoes: Partial<RegistroHistorico>): Promise<void> {
  return enfileirarEscrita(async () => {
    const historico = await lerHistorico();
    const indice = historico.findIndex((r) => r.id === id);
    if (indice === -1) throw new Error(`Registro com id ${id} não encontrado`);
    historico[indice] = { ...historico[indice], ...atualizacoes } as RegistroHistorico;
    await writeFile(CAMINHO_ARQUIVO, JSON.stringify(historico, null, 2));
  });
}