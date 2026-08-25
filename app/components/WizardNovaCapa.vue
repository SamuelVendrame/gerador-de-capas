<script setup lang="ts">
import { useWizardCapa } from "~/composables/useWizardCapa";

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
      :gerando="false"
      @gerar="gerarCapa"
    />

    <div v-if="Object.keys(erros).length > 0" class="resumo-erros">
      <span v-for="(mensagem, campo) in erros" :key="campo" class="erro-item">{{ mensagem }}</span>
    </div>

    <div class="navegacao">
      <button v-if="etapaAtual > 1" class="btn-voltar" @click="voltar">Voltar</button>
      <button v-if="etapaAtual < totalEtapas" class="btn-avancar" @click="avancar">Avançar</button>
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