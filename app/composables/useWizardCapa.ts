import { ref } from "vue";
import { useRouter } from "vue-router";
import { schemaEtapa1, schemaEtapa2, schemaEtapa3, schemaEtapa4, schemaGeracaoCapa } from "~~/shared/schemaGeracaoCapa";
import { emAndamento } from "~/composables/useGeracaoProgresso";

export function useWizardCapa() {
  const router = useRouter();

  const dadosPreenchidos = (() => {
    if (typeof window === "undefined") return null; // proteção SSR
    const salvo = sessionStorage.getItem("dadosWizardPreenchido");
    if (!salvo) return null;
    sessionStorage.removeItem("dadosWizardPreenchido");
    return JSON.parse(salvo);
  })();

  const idExistente = ref<string | null>(dadosPreenchidos?.id ?? null);
  const etapaAtual = ref<number>(dadosPreenchidos?.etapaInicial ?? 1);
  const totalEtapas = 4;
  const erros = ref<Record<string, string>>({});

  const titulo = ref(dadosPreenchidos?.titulo ?? "");
  const autor = ref(dadosPreenchidos?.autor ?? "");
  const genero = ref(dadosPreenchidos?.genero ?? "");
  const descricao = ref(dadosPreenchidos?.descricao ?? "");
  const clima = ref(dadosPreenchidos?.clima ?? "");

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
    if (emAndamento.value) {
      erros.value = { geral: "Já existe uma geração em andamento. Aguarde ela terminar antes de iniciar outra." };
      return false;
    }

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

    sessionStorage.setItem("dadosGeracaoCapa", JSON.stringify({
      ...validacaoCompleta.data,
      idExistente: idExistente.value,
    }));
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