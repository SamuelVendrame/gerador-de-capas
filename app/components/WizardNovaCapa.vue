<script setup lang="ts">
import { watch } from "vue";
import { useWizardCapa } from "~/composables/useWizardCapa";
import { emAndamento } from "~/composables/useGeracaoProgresso";

const {
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
} = useWizardCapa();

const TITULOS_ETAPA: Record<number, string> = {
  1: "Qual é o livro?",
  2: "Que tipo de livro é?",
  3: "Sobre o que ele fala?",
  4: "Alguma preferência de clima?",
};
const SUBTITULOS_ETAPA: Record<number, string> = {
  1: "Só o essencial. O agente cuida do resto — layout, tipografia, arte e revisão.",
  2: "Isso guia paleta, composição e tipografia que o agente vai escolher.",
  3: "É daqui que sai o prompt da arte de fundo. Fale do tom, do lugar, do conflito.",
  4: "Opcional. Se você não disser nada, o agente decide e mostra o motivo de cada escolha.",
};
</script>

<template>
  <div class="wizard-container">
    <BarraProgresso :etapa-atual="etapaAtual" :total-etapas="totalEtapas" />

    <h2>{{ TITULOS_ETAPA[etapaAtual] }}</h2>
    <p class="subtitulo">{{ SUBTITULOS_ETAPA[etapaAtual] }}</p>

    <div class="card-etapa">
      <WizardEtapa1 v-if="etapaAtual === 1" v-model:titulo="titulo" v-model:autor="autor" />
      <WizardEtapa2 v-else-if="etapaAtual === 2" v-model:genero="genero" />
      <WizardEtapa3 v-else-if="etapaAtual === 3" v-model:descricao="descricao" />
      <WizardEtapa4 v-else-if="etapaAtual === 4" v-model:clima="clima" :gerando="false" @gerar="gerarCapa" />

      <div v-if="Object.keys(erros).length > 0" class="resumo-erros">
        <span v-for="(mensagem, campo) in erros" :key="campo" class="erro-item">{{ mensagem }}</span>
      </div>

        <div class="navegacao">
        <button v-if="etapaAtual > 1" class="btn-voltar" @click="voltar">Voltar</button>
        <button v-if="etapaAtual < totalEtapas" class="btn-avancar" @click="avancar">Avançar</button>
        <button v-else class="btn-avancar" :disabled="emAndamento" @click="gerarCapa">
            Gerar capa
        </button>
        </div>

        <div v-if="emAndamento && etapaAtual === totalEtapas" class="resumo-erros">
        <span class="erro-item">Já existe uma geração em andamento. Aguarde ela terminar antes de iniciar outra.</span>
        </div>

      </div>
    </div>
</template>

<style scoped>
.wizard-container { display: flex; flex-direction: column; gap: 4px; }

h2 { margin: 8px 0 0; font-size: 22px; }
.subtitulo { color: var(--cor-texto-secundario); font-size: 14px; margin: 0 0 16px; }

.card-etapa {
  background: white;
  border-radius: var(--raio-card);
  padding: 24px;
  box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.15);
}

.resumo-erros {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding: 12px;
  background: var(--cor-erro-fundo);
  border-radius: 6px;
}
.erro-item { color: var(--cor-erro-texto); font-size: 14px; }

.navegacao { display: flex; justify-content: space-between; margin-top: 24px; }
.btn-voltar {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-botao);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-weight: 600;
}
.btn-avancar {
  padding: 10px 20px;
  font-weight: 600;
  background: var(--cor-primaria);
  color: white;
  border: none;
  border-radius: var(--raio-botao);
  cursor: pointer;
  margin-left: auto;
  box-shadow: 0px 5px 16px rgba(77, 24, 97, 0.5);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-avancar:hover {
  background: #8b45f0;
  box-shadow: 0px 7px 22px rgba(77, 24, 97, 0.6);
}
</style>