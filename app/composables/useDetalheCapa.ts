import { ref } from "vue";
import { useRouter } from "vue-router";
import type { RegistroHistorico } from "~~/shared/schemaHistorico";

export function useDetalheCapa() {
  const router = useRouter();

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

  function gerarVariacao() {
    if (!registroSelecionado.value) return;
    sessionStorage.setItem("dadosGeracaoCapa", JSON.stringify({
      titulo: registroSelecionado.value.titulo,
      autor: registroSelecionado.value.autor,
      genero: registroSelecionado.value.genero,
      descricao: registroSelecionado.value.descricao,
      clima: registroSelecionado.value.clima,
    }));
    router.push("/gerando");
  }


    async function trocarLayout(novoLayout: string, novaFonte: string) {
    if (!registroSelecionado.value) return;
    const atualizado = await $fetch<RegistroHistorico>("/api/trocar-layout", {
        method: "POST",
        body: { id: registroSelecionado.value.id, layout: novoLayout, fonte: novaFonte },
    });
    registroSelecionado.value = atualizado;
    }


    function ajustarInstrucoes() {
      if (!registroSelecionado.value) return;
      sessionStorage.setItem("dadosWizardPreenchido", JSON.stringify({
        id: registroSelecionado.value.id, 
        titulo: registroSelecionado.value.titulo,
        autor: registroSelecionado.value.autor,
        genero: registroSelecionado.value.genero,
        descricao: registroSelecionado.value.descricao,
        clima: registroSelecionado.value.clima,
        etapaInicial: 4,
      }));
      router.push("/");
    }

    async function baixarPdf() {
      if (!registroSelecionado.value?.caminhoImagem) return;

      const blob = await $fetch("/api/gerar-pdf", {
        method: "POST",
        body: {
          imagemBase64: registroSelecionado.value.caminhoImagem,
          titulo: registroSelecionado.value.titulo,
        },
        responseType: "blob",
      });

      const url = URL.createObjectURL(blob as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${registroSelecionado.value.titulo}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }

   return { registroSelecionado, abrirDetalhe, fecharDetalhe, baixarImagem, gerarVariacao, trocarLayout, ajustarInstrucoes, baixarPdf };

}