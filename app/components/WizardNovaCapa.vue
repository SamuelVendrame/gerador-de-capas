<script setup lang="ts">
import { ref } from "vue";
import { schemaEtapa1, schemaEtapa2, schemaEtapa3, schemaEtapa4, schemaGeracaoCapa } from "~~/shared/schemasGeneros";

const etapaAtual = ref(1);
const totalEtapas = 4;

const titulo = ref("");
const autor = ref("");
const genero = ref("");
const descricao = ref("");
const clima = ref("");

const erros = ref<Record<string, string>>({});
const gerando = ref(false);
const resultado = ref<any>(null);

function validarEtapaAtual(): boolean {
  erros.value = {};
  let schema;
  let dados;

  if (etapaAtual.value === 1) {
    schema = schemaEtapa1;
    dados = { titulo: titulo.value, autor: autor.value };
  } else if (etapaAtual.value === 2) {
    schema = schemaEtapa2;
    dados = { genero: genero.value };
  } else if (etapaAtual.value === 3) {
    schema = schemaEtapa3;
    dados = { descricao: descricao.value };
  } else {
    schema = schemaEtapa4;
    dados = { clima: clima.value || undefined };
  }

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

const emit = defineEmits<{ capaGerada: [] }>();

async function gerarCapa() {
  if (!validarEtapaAtual()) return;

  const validacaoCompleta = schemaGeracaoCapa.safeParse({
    titulo: titulo.value,
    autor: autor.value,
    genero: genero.value,
    descricao: descricao.value,
    clima: clima.value || undefined,
  });

  if (!validacaoCompleta.success) {
    console.error("Validação final falhou:", validacaoCompleta.error);
    return;
  }

  gerando.value = true;
  resultado.value = null;

  try {
    const response = await $fetch("/api/gerar-capa", {
      method: "POST",
      body: validacaoCompleta.data,
    });
    resultado.value = response;
    emit("capaGerada"); 
  } catch (erro) {
    console.error("Erro ao gerar capa:", erro);
  } finally {
    gerando.value = false;
  }
}
</script>

<template>
  <div class="wizard-container">
    <BarraProgresso :etapa-atual="etapaAtual" :total-etapas="totalEtapas" />

    <WizardEtapa1 v-if="etapaAtual === 1" v-model:titulo="titulo" v-model:autor="autor" />
    <WizardEtapa2 v-else-if="etapaAtual === 2" v-model:genero="genero" />
    <WizardEtapa3 v-else-if="etapaAtual === 3" v-model:descricao="descricao" />
    <WizardEtapa4
      v-else-if="etapaAtual === 4"
      v-model:clima="clima"
      :gerando="gerando"
      @gerar="gerarCapa"
    />

    <div v-if="Object.keys(erros).length > 0" class="resumo-erros">
      <span v-for="(mensagem, campo) in erros" :key="campo" class="erro-item">{{ mensagem }}</span>
    </div>

    <div class="navegacao">
      <button v-if="etapaAtual > 1" class="btn-voltar" @click="voltar">Voltar</button>
      <button v-if="etapaAtual < totalEtapas" class="btn-avancar" @click="avancar">Avançar</button>
    </div>

    <div v-if="resultado" class="resultado">
      <p>{{ resultado.sucesso ? "Capa gerada com sucesso!" : "Não foi possível aprovar a capa." }}</p>
    </div>
  </div>
</template>

<style scoped>
.wizard-container { background: white; }
.resumo-erros {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding: 12px;
  background: #fef2f2;
  border-radius: 6px;
}
.erro-item { color: #c00; font-size: 14px; }
.navegacao { display: flex; justify-content: space-between; margin-top: 24px; }
.btn-voltar {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
}
.btn-avancar {
  padding: 10px 20px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-left: auto;
}
.resultado { margin-top: 24px; text-align: center; }
</style>