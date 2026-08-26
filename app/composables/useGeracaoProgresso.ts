import { ref } from "vue";
import { lerStreamSSE } from "./useSSE.ts";

export type PassoProgresso = {
  titulo: string;
  comentario: string;
  duracaoSegundos: number;
  status: "sucesso" | "erro" | "limite";
  nomeTool?: string;
  imagemPasso?: string;
};

const passos = ref<PassoProgresso[]>([]);
const finalizado = ref(false);
const sucesso = ref<boolean | null>(null);
const caminhoImagem = ref<string | null>(null);
const motivo = ref<string | null>(null);
const erroFatal = ref<string | null>(null);
const idGeracao = ref<string | null>(null);

export const emAndamento = ref(false);

async function verificarEstadoReal(id: string) {
  try {
    const historico = await $fetch("/api/historico");
    const registro = historico.find((r: any) => r.id === id);
    if (registro?.status === "concluido") {
      sucesso.value = true;
      caminhoImagem.value = registro.caminhoImagem ?? null;
      erroFatal.value = null;
    }
  } catch {
  }
}

function processarEvento(dado: any) {
  if (dado.tipo === "iniciado") {
    idGeracao.value = dado.id;
  } else if (dado.tipo === "passo") {
    passos.value.push({
      titulo: dado.titulo,
      comentario: dado.comentario,
      duracaoSegundos: dado.duracaoSegundos,
      status: dado.status === "limite" ? "limite" : (dado.ehCorrecao ? "erro" : "sucesso"),
      nomeTool: dado.nomeTool,
      imagemPasso: dado.caminhoImagem,
    });
    if (dado.caminhoImagem) {
      caminhoImagem.value = dado.caminhoImagem;
    }
  } else if (dado.tipo === "concluido") {
    finalizado.value = true;
    sucesso.value = dado.sucesso;
    caminhoImagem.value = dado.caminhoImagem ?? null;
    motivo.value = dado.motivo ?? null;
  } else if (dado.tipo === "erro") {
    finalizado.value = true;
    sucesso.value = false;
    erroFatal.value = dado.mensagem;
    passos.value.push({
      titulo: "Processo interrompido",
      comentario: dado.mensagem,
      duracaoSegundos: 0,
      status: "erro",
    });

    if (idGeracao.value) {
      setTimeout(() => verificarEstadoReal(idGeracao.value!), 2000);
    }
  }
}

export function useGeracaoProgresso() {
  async function iniciar(dados: any) {
    if (emAndamento.value) return;

    emAndamento.value = true;
    passos.value = [];
    finalizado.value = false;
    sucesso.value = null;
    caminhoImagem.value = null;
    erroFatal.value = null;
    idGeracao.value = null;

    try {
      await lerStreamSSE("/api/gerar-capa-stream", dados, processarEvento);
    } catch (erro) {
      console.error("Erro na conexão de streaming:", erro);
      erroFatal.value = erro instanceof Error ? erro.message : "Erro desconhecido";
      finalizado.value = true;
    } finally {
      emAndamento.value = false;
    }
  }

  return { passos, finalizado, sucesso, caminhoImagem, motivo, erroFatal, idGeracao, emAndamento, iniciar };
}