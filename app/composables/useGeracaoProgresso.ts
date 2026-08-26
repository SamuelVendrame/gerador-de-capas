import { ref } from "vue";

export type PassoProgresso = {
  titulo: string;
  comentario: string;
  duracaoSegundos: number;
  status: "sucesso" | "erro" | "limite";
  nomeTool?: string;
  imagemPasso?: string;
};

// Estado fora da função = compartilhado entre todas as chamadas do composable (singleton)
const passos = ref<PassoProgresso[]>([]);
const finalizado = ref(false);
const sucesso = ref<boolean | null>(null);
const caminhoImagem = ref<string | null>(null);
const motivo = ref<string | null>(null);
const erroFatal = ref<string | null>(null);
const idGeracao = ref<string | null>(null);
const emAndamento = ref(false);

export function useGeracaoProgresso() {
  async function verificarEstadoReal(id: string) {
    try {
      const historico = await $fetch("/api/historico");
      const registro = historico.find((r: any) => r.id === id);
      if (registro?.status === "concluido") {
        sucesso.value = true;
        caminhoImagem.value = registro.caminhoImagem;
        erroFatal.value = null;
      }
    } catch {
    }
  }

  async function iniciar(dados: any) {
    if (emAndamento.value) return; // já tem uma geração rodando — não inicia outra

    emAndamento.value = true;
    passos.value = [];
    finalizado.value = false;
    sucesso.value = null;
    caminhoImagem.value = null;
    erroFatal.value = null;
    idGeracao.value = null;

    try {
      const response = await fetch("/api/gerar-capa-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
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
            const dado = JSON.parse(linha.replace("data: ", ""));

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
          } catch (erroParse) {
            console.error("Falha ao parsear evento SSE:", erroParse, linha);
          }
        }
      }
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