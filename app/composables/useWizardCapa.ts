import { ref } from "vue";
import { schemaEtapa1, schemaEtapa2, schemaEtapa3, schemaEtapa4, schemaGeracaoCapa } from "~~/shared/schemasGeneros";
import { useRouter } from "vue-router";

export function useWizardCapa() {
  const router = useRouter()
  const etapaAtual = ref(1);
  const totalEtapas = 4;
  const erros = ref<Record<string, string>>({});

  const titulo = ref("");
  const autor = ref("");
  const genero = ref("");
  const descricao = ref("");
  const clima = ref("");

  function validarEtapaAtual(): boolean {
    erros.value = {};
    const schemasPorEtapa = {
      1: { schema: schemaEtapa1, dados: { titulo: titulo.value, autor: autor.value } },
      2: { schema: schemaEtapa2, dados: { genero: genero.value } },
      3: { schema: schemaEtapa3, dados: { descricao: descricao.value } },
      4: { schema: schemaEtapa4, dados: { clima: clima.value || undefined } },
    };
    const { schema, dados } = schemasPorEtapa[etapaAtual.value as 1 | 2 | 3 | 4];

    const validacao = schema.safeParse(dados);
    if (!validacao.success) {
      for (const issue of validacao.error.issues) {
        erros.value[issue.path[0] as string] = issue.message;
      }
      return false;
    }
    return true;
  }

  function avancar() {
    if (validarEtapaAtual() && etapaAtual.value < totalEtapas) {
      etapaAtual.value++;
    }
  }

  function voltar() {
    erros.value = {};
    if (etapaAtual.value > 1) {
      etapaAtual.value--;
    }
  }

  function gerarCapa(): boolean {
    if (!validarEtapaAtual()) return false;

    const validacaoCompleta = schemaGeracaoCapa.safeParse({
      titulo: titulo.value,
      autor: autor.value,
      genero: genero.value,
      descricao: descricao.value,
      clima: clima.value || undefined,
    });

    if (!validacaoCompleta.success) {
      console.error("Validação final falhou:", validacaoCompleta.error);
      return false;
    }

    sessionStorage.setItem("dadosGeracaoCapa", JSON.stringify(validacaoCompleta.data));
    router.push("/gerando");
    return true;
  }

  return {
    etapaAtual,
    totalEtapas,
    erros,
    titulo,
    autor,
    genero,
    descricao,
    clima,
    avancar,
    voltar,
    gerarCapa,
  };
}