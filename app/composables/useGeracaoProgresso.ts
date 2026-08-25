import { ref } from "vue";

export type PassoProgresso = { titulo: string; comentario: string; duracaoSegundos: number };

export function useGeracaoProgresso() {
  const passos = ref<PassoProgresso[]>([]);
  const finalizado = ref(false);
  const sucesso = ref<boolean | null>(null);
  const caminhoImagem = ref<string | null>(null);
  const motivo = ref<string | null>(null);

  function iniciar(dados: any) {
    const response = fetch("/api/gerar-capa-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    response.then(async (res) => {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const texto = decoder.decode(value);
        const linhas = texto.split("\n\n").filter((l) => l.startsWith("data: "));

        for (const linha of linhas) {
          const dado = JSON.parse(linha.replace("data: ", ""));

          if (dado.tipo === "passo") {
            passos.value.push({ titulo: dado.titulo, comentario: dado.comentario, duracaoSegundos: dado.duracaoSegundos });
          } else if (dado.tipo === "concluido") {
            finalizado.value = true;
            sucesso.value = dado.sucesso;
            caminhoImagem.value = dado.caminhoImagem ?? null;
            motivo.value = dado.motivo ?? null;
          }
        }
      }
    });
  }

  return { passos, finalizado, sucesso, caminhoImagem, motivo, iniciar };
}