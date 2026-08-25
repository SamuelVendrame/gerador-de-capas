import { ref } from "vue";

export type PassoProgresso = {
  titulo: string;
  comentario: string;
  duracaoSegundos: number;
  status: "sucesso" | "erro";
};

function inferirStatus(comentario: string): "sucesso" | "erro" {
  const indicadoresErro = [
    "detectei",
    "corrigindo",
    "erro",
    "não foi possível",
    "ajustando",
  ];

  const textoBaixo = comentario.toLowerCase();

  return indicadoresErro.some((indicador) =>
    textoBaixo.includes(indicador)
  )
    ? "erro"
    : "sucesso";
}

export function useGeracaoProgresso() {
  const passos = ref<PassoProgresso[]>([]);
  const finalizado = ref(false);
  const sucesso = ref<boolean | null>(null);
  const caminhoImagem = ref<string | null>(null);
  const motivo = ref<string | null>(null);
  const erroFatal = ref<string | null>(null);

  async function iniciar(dados: unknown) {
    passos.value = [];
    finalizado.value = false;
    sucesso.value = null;
    caminhoImagem.value = null;
    motivo.value = null;
    erroFatal.value = null;

    try {
      const response = await fetch("/api/gerar-capa-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(
          `Erro HTTP ${response.status}: ${response.statusText}`
        );
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("O navegador não conseguiu iniciar o streaming.");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const eventosCompletos = buffer.split("\n\n");

        buffer = eventosCompletos.pop() ?? "";

        for (const evento of eventosCompletos) {
          const linha = evento.trim();

          if (!linha.startsWith("data: ")) {
            continue;
          }

          try {
            const conteudo = linha.slice(6);
            const dado = JSON.parse(conteudo);

            if (dado.tipo === "passo") {
              const ultimoPasso =
                passos.value[passos.value.length - 1];

              if (
                dado.caminhoImagem &&
                ultimoPasso?.titulo === dado.titulo
              ) {
                caminhoImagem.value = dado.caminhoImagem;
                continue;
              }

              const passo: PassoProgresso = {
                titulo: dado.titulo,
                comentario: dado.comentario,
                duracaoSegundos: dado.duracaoSegundos,
                status: inferirStatus(dado.comentario),
              };

              passos.value.push(passo);

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
              erroFatal.value =
                dado.mensagem ?? "Erro desconhecido durante a geração.";
            }
          } catch (erroParse) {
            console.error(
              "Falha ao parsear evento SSE:",
              erroParse,
              evento
            );
          }
        }
      }

      // Caso o servidor encerre o stream sem mandar concluído/erro
      if (!finalizado.value) {
        finalizado.value = true;

        if (sucesso.value === null) {
          sucesso.value = false;
        }
      }
    } catch (erro) {
      console.error("Erro na conexão de streaming:", erro);

      erroFatal.value =
        erro instanceof Error
          ? erro.message
          : "Erro desconhecido";

      finalizado.value = true;
      sucesso.value = false;
    }
  }

  return {
    passos,
    finalizado,
    sucesso,
    caminhoImagem,
    motivo,
    erroFatal,
    iniciar,
  };
}