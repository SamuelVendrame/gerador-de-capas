import { ref } from "vue";
import type { RegistroHistorico } from "~~/shared/schemaHistorico";

export function useDetalheCapa() {
  const registroSelecionado = ref<RegistroHistorico | null>(null);

  function abrirDetalhe(registro: RegistroHistorico) {
    registroSelecionado.value = registro;
  }

  function fecharDetalhe() {
    registroSelecionado.value = null;
  }

  function baixarImagem() {
    if (!registroSelecionado.value?.caminhoImagem) return;
    const link = document.createElement("a");
    link.href = registroSelecionado.value.caminhoImagem;
    link.download = `${registroSelecionado.value.titulo}.png`;
    link.click();
  }

  async function gerarVariacao() {
    if (!registroSelecionado.value) return;
    await $fetch("/api/gerar-capa", {
      method: "POST",
      body: {
        titulo: registroSelecionado.value.titulo,
        autor: registroSelecionado.value.autor,
        genero: registroSelecionado.value.genero,
        descricao: registroSelecionado.value.descricao,
        clima: registroSelecionado.value.clima,
      },
    });
    fecharDetalhe();
  }

    async function trocarLayout(novoLayout: string, novaFonte: string) {
    if (!registroSelecionado.value) return;
    const atualizado = await $fetch<RegistroHistorico>("/api/trocar-layout", {
        method: "POST",
        body: { id: registroSelecionado.value.id, layout: novoLayout, fonte: novaFonte },
    });
    registroSelecionado.value = atualizado;
    }

  return { registroSelecionado, abrirDetalhe, fecharDetalhe, baixarImagem, gerarVariacao, trocarLayout };
}