<script setup lang="ts">
const props = defineProps<{
  etapaAtual: number;
  totalEtapas: number;
}>();

const NOMES_ETAPAS: Record<number, string> = {
  1: "Livro",
  2: "Gênero",
  3: "Descrição",
  4: "Clima",
};
</script>

<template>
  <div class="cabecalho-progresso">
    <span class="rotulo-passo">
      Passo {{ etapaAtual }} de {{ totalEtapas }} ·
      {{ NOMES_ETAPAS[etapaAtual] }}
    </span>

    <span class="nota-agente">
      Tipografia, layout e paleta: o agente decide
    </span>
  </div>

  <div class="barra-progresso">
    <div
      v-for="n in totalEtapas"
      :key="n"
      class="segmento"
      :class="{ preenchido: n <= etapaAtual }"
    ></div>
  </div>
</template>

<style scoped>
.cabecalho-progresso {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 13px;
  min-width: 0;
}

.rotulo-passo {
  color: rgb(124, 58, 237);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.nota-agente {
  color: #999;
  text-align: right;
}

.barra-progresso {
  display: flex;
  gap: 8px;
  width: 100%;
}

.segmento {
  flex: 1;
  min-width: 0;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  transition: background 0.3s;
}

.segmento.preenchido {
  background: #7c3aed;
}

@media (max-width: 600px) {
  .cabecalho-progresso {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .nota-agente {
    text-align: left;
    line-height: 1.4;
  }

  .barra-progresso {
    gap: 5px;
  }
}
</style>