import { ref } from "vue";
import type { RegistroHistorico } from "~~/shared/schemaHistorico";

export function useHistorico() {
  const registros = ref<RegistroHistorico[]>([]);
  const carregando = ref(true);

  async function carregarHistorico() {
    carregando.value = true;
    try {
      registros.value = await $fetch("/api/historico");
    } catch (erro) {
      console.error("Erro ao carregar histórico:", erro);
    } finally {
      carregando.value = false;
    }
  }

  async function tentarNovamente(registro: RegistroHistorico) {
    try {
      await $fetch("/api/gerar-capa", {
        method: "POST",
        body: {
          titulo: registro.titulo,
          autor: registro.autor,
          genero: registro.genero,
          descricao: registro.descricao,
          clima: registro.clima,
          idExistente: registro.id,
        },
      });
      await carregarHistorico();
    } catch (erro) {
      console.error("Erro ao tentar novamente:", erro);
    }
  }

  return { registros, carregando, carregarHistorico, tentarNovamente };
}