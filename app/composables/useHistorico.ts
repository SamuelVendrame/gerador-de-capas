import { ref } from "vue";
import { useRouter } from "vue-router";
import type { RegistroHistorico } from "~~/shared/schemaHistorico";

export function useHistorico() {
  const router = useRouter();
  const registros = ref<RegistroHistorico[]>([]);
  const carregando = ref(true);

  const resumo = computed(() => {
    const concluidas = registros.value.filter((r) => r.status === "concluido").length;
    const emProcessamento = registros.value.filter((r) => r.status === "em_processamento").length;
    const comFalha = registros.value.filter((r) => r.status === "cancelado").length;
    return { concluidas, emProcessamento, comFalha, total: registros.value.length };
  });

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

  function tentarNovamente(registro: RegistroHistorico) {
    sessionStorage.setItem("dadosGeracaoCapa", JSON.stringify({
      titulo: registro.titulo,
      autor: registro.autor,
      genero: registro.genero,
      descricao: registro.descricao,
      clima: registro.clima,
      idExistente: registro.id, 
    }));
    router.push("/gerando");
  }

  return { registros, carregando, carregarHistorico, tentarNovamente, resumo };
}