import { ref } from "vue";

export type PassoProgresso = {
  titulo: string;
  comentario: string;
  duracaoSegundos: number;
  status: "sucesso" | "erro";
};

export function useGeracaoProgresso() {
  const passos = ref<PassoProgresso[]>([]);
  const finalizado = ref(false);
  const sucesso = ref<boolean | null>(null);
  const caminhoImagem = ref<string | null>(null);
  const motivo = ref<string | null>(null);
  const erroFatal = ref<string | null>(null);
  const idGeracao = ref<string | null>(null);

  async function iniciar(dados: any) {
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
                  status: dado.ehCorrecao ? "erro" : "sucesso",
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
    }
  }

  return { passos, finalizado, sucesso, caminhoImagem, motivo, erroFatal, idGeracao, iniciar };
}